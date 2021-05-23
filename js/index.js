/*
    Copyright (C) 2020 Eric Qian. 
    <https://ericqian.me/>
    All rights reserved.
*/

let points = undefined;
let canvas = undefined;
let ctx = undefined;

// GLOBAL - Current directory
let currentDirectory = "/";

// Higher = slower animation.
let global_animate_numPoints = 100;

// Higher = faster text render.
let typeSpeed = 15;
// const textColor = "#7B0000";
const textColor = "#FFFFFF";
let gCommit;
let commitText;
let lastAuthored;

let logContent = [];

let prevWidth = 0;
let prevHeight = 0;

let previousX = 0;
let previousY = 0;

let initialTop = 0;
let initialLeft = 0;
window.onbeforeunload = function () {
    // Set position to top prior to refresh, since this is a 
    // single page application, and scroll should not persist
    // across refreshes. 
    window.scrollTo(0, 0);
};
function maximizeWindows(source) {
    console.log($(source).find("#wrapper"));
    let wrapper = $(source).find("#wrapper");
    initialHeight = $(source).children().first().outerHeight(false);
    initalWidth = $(source).children().first().outerWidth(false);

    targetHeight = $(window).height() - (wrapper.outerHeight(true) - wrapper.outerHeight(false));
    targetWidth = $(window).width() - (wrapper.outerWidth(true) - wrapper.outerWidth(false));

    if (initialHeight != targetHeight) {
        wrapper.css("height", targetHeight);
        prevHeight = initialHeight;
        previousY = $(source).css("top");
        $(source).css("top", "0");
        initialTop = wrapper.css("top");
        wrapper.css("top", "0");

    }
    else {
        console.log("already maximized (Y)");
        wrapper.css("height", prevHeight);
        source.style.top = previousY;
        wrapper.css("top", initialTop);
    }

    if (initalWidth != targetWidth) {
        wrapper.css("width", targetWidth);
        prevWidth = initalWidth;
        previousX = $(source).css("left");
        $(source).css("left", "0");
        initialLeft = wrapper.css("left");
        wrapper.css("left", "0");
    }
    else {
        console.log("already maximized (X)");
        wrapper.css("width", prevWidth);
        source.style.left = previousX;
        wrapper.css("left", initialLeft);
    }

}


function updateCommitDetails(callback) {
    $.getJSON('https://api.github.com/repos/EnumC/EnumC.com/git/refs/heads/master', function (data) {
        console.debug(data);
        console.debug("link: ", data.object.url);
        $.getJSON(data.object.url, function (commit) {
            console.debug("commit: ", JSON.stringify(commit, null, 2));
            commitText = JSON.stringify(commit, null, 2);
            gCommit = commit;
            lastAuthored = commit.author.date;
            console.debug("lastAuthored: ", lastAuthored);
            callback();
        });
    });
}


// On DOM ready.
$(document).ready(function () {
    $('#wrapper').hide();
    $('.desktop').show();
    createWindow(location.hash, function () {
        let appbarWidth = $('.desktop').width();
        // $("#windows").css('left', appbarWidth);
    });

    const selection = new SelectionArea({

        // document object - if you want to use it within an embed document (or iframe).
        document: window.document,

        // Class for the selection-area element.
        class: 'selection-area',

        // Query selector or dom-node to set up container for the selection-area element.
        container: 'body',

        // Query selectors for elements which can be selected.
        selectables: [],

        // Query selectors for elements from where a selection can be started from.
        startareas: ['#windows'],

        // Query selectors for elements which will be used as boundaries for the selection.
        boundaries: ['#windows'],

        // px, how many pixels the point should move before starting the selection (combined distance).
        // Or specifiy the threshold for each axis by passing an object like {x: <number>, y: <number>}.
        startThreshold: 10,

        // Enable / disable touch support
        allowTouch: true,

        // On which point an element should be selected.
        // Available modes are cover (cover the entire element), center (touch the center) or
        // the default mode is touch (just touching it).
        intersect: 'touch',

        // Specifies what should be done if already selected elements get selected again.
        //   invert: Invert selection for elements which were already selected
        //   keep: Make stored elements (by keepSelectio()) 'fix'
        //   drop: Remove stored elements after they have been touched
        overlap: 'invert',

        // Configuration in case a selectable gets just clicked.
        singleTap: {

            // Enable single-click selection (Also disables range-selection via shift + ctrl).
            allow: true,

            // 'native' (element was mouse-event target) or 'touch' (element visually touched).
            intersect: 'native'
        },

        // Scroll configuration.
        scrolling: {

            // On scrollable areas the number on px per frame is devided by this amount.
            // Default is 10 to provide a enjoyable scroll experience.
            speedDivider: 10,

            // Browsers handle mouse-wheel events differently, this number will be used as 
            // numerator to calculate the mount of px while scrolling manually: manualScrollSpeed / scrollSpeedDivider.
            manualSpeed: 0
        }
    });
    selection.on('beforestart', evt => {

        // Use this event to decide whether a selection should take place or not.
        // For example if the user should be able to normally interact with input-elements you 
        // may want to prevent a selection if the user clicks such a element:
        // selection.on('beforestart', ({event}) => {
        //   return event.target.tagName !== 'INPUT'; // Returning false prevents a selection
        // });

        // console.log('beforestart', evt);
        // console.log(evt.event.srcElement);
        if (evt.event.srcElement != document.getElementById("windows")) {
            // prohibit selection if not on desktop.
            return false;
        }
    }).on('start', evt => {

        // A selection got initiated, you could now clear the previous selection or
        // keep it if in case of multi-selection.
        // console.log('start', evt);
    }).on('move', evt => {

        // Here you can update elements based on their state.
        // console.log('move', evt);
    }).on('stop', evt => {

        // The last event can be used to call functions like keepSelection() in case the user wants
        // to select multiple elements.
        // console.log('stop', evt);
    });

    canvas = document.getElementById("info-section");
    ctx = canvas.getContext("2d");
    ctx.lineCap = "round";

    // Set canvas resolution. The actual size can be configured
    // in custom.css.
    if (window.innerHeight > window.innerWidth) {
        //portrait
        canvas.width = 1000;
        canvas.height = 1000;
        ctx.lineWidth = 8;
    }
    else {
        canvas.width = 1000;
        canvas.height = 400;
        ctx.lineWidth = 5;
    }

    let width = canvas.width;
    let height = canvas.height;

    // define the path to plot
    let lines = [
        [
            [0, 0],
            [width, 0]
        ],
        [
            [width, 0],
            [width, height]
        ],
        [
            [width, height],
            [0, height]
        ],
        [
            [0, height],
            [0, 0]
        ],

        // [
        //     [width / 2, 0],
        //     [width / 2, height]
        // ]
    ];

    // set some style
    ctx.strokeStyle = textColor;
    ctx.fillStyle = textColor;
    ctx.font = "48px monospace";
    ctx.shadowColor = "rgba(0,255,0,0.8)";
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "lighter";
    ctx.textBaseline = "top";

    // extend the line from start to finish with animation
    // Check out https://stackoverflow.com/questions/23939588/how-to-animate-drawing-lines-on-canvas
    // if you would like to try something similar.
    drawLine(lines);

    infoText = "This site is undergoing a complete redesign, and therefore might be very incomplete. Please see https://bananiumlabs.com for past content.";
    type(infoText, 25, 25, 50, 10);
});

function drawLine(input) {
    points = calcWaypoints(input);
    animate();
}

// Adapted from https://codepen.io/tmrDevelops/pen/EaaBYB
/* type method
* str - string to type on the canvas
* startX - position X of the point to start from
* startY - position Y of the point to start from
* lineHeight - height of each line (the position Y will be incremented by this value)
* padding - padding in the canvas. No text will be typed within padding
*/
function type(str, startX, startY, lineHeight, padding) {
    "use strict";
    var cursorX = startX || 0;
    var cursorY = startY || 0;
    var lineHeight = lineHeight || 32;
    padding = padding || 10;
    var i = 0;
    let ctx_inter = setInterval(function () {
        var rem = str.substr(i);
        var space = rem.indexOf(' ');
        space = (space === -1) ? str.length : space;
        var wordwidth = ctx.measureText(rem.substring(0, space)).width;
        var w = ctx.measureText(str.charAt(i)).width;
        if (cursorX + wordwidth >= canvas.width - padding) {
            cursorX = startX;
            cursorY += lineHeight;
        }
        ctx.fillText(str.charAt(i), cursorX, cursorY);
        i++;
        cursorX += w;
        if (i === str.length) {
            clearInterval(ctx_inter);
        }
    }, typeSpeed);
}

// calc waypoints traveling along vertices
function calcWaypoints(vertices) {
    let waypoints = [];
    for (let i = 0; i < vertices.length; i++) {
        let pt0 = vertices[i][0];
        let pt1 = vertices[i][1];
        let dx = pt1[0] - pt0[0];
        let dy = pt1[1] - pt0[1];
        let arr = [];
        let numPoints = global_animate_numPoints; // This controls speed

        for (let j = 0; j < numPoints; j++) {
            let x = pt0[0] + dx * j / numPoints;
            let y = pt0[1] + dy * j / numPoints;
            arr.push({
                x: x,
                y: y
            });
        }
        arr.push({ x: vertices[i][1][0], y: vertices[i][1][1] });
        waypoints.push(arr);
    }
    return waypoints;
}

let loc = 0;
function animate() {
    if (typeof points[0][loc + 1] !== "undefined") {
        requestAnimationFrame(animate);
    }

    for (let i = 0; i < points.length; i++) {
        if (typeof points[i][loc + 1] !== "undefined") {
            ctx.beginPath();
            ctx.moveTo(points[i][loc].x, points[i][loc].y);
            ctx.lineTo(points[i][loc + 1].x, points[i][loc + 1].y);
            ctx.stroke();
        }
    }
    loc++;
}
let numWindows = 0;

let xOffsetCoeff = 20;
let yOffsetCoeff = 20;
let maxOffset = 100;

function createWindow(path, callback) {

    let newElem = loadPath(path);
    let newWindow = $(newElem[0]).css("opacity", "0").appendTo($("#windows"));
    console.log(newWindow);

    $(newWindow).draggable({
        cancel: ".main-content", // Restrict dragging to title-bar only.
        scroll: false,
        zIndex: 10000,
        start: zIndexHandler // Call z index handler to set new z axis.
    });
    zIndexHandler.call($(newWindow));
    $(newWindow).click(zIndexHandler);


    console.log(newElem[1]);

    let waitUntilExist = setInterval(function () {
        $(newWindow).children().resizable({
            handles: "all"
        });
        if ($(newWindow).children().is(".ui-resizable")) {
            let pos = $(newWindow).children().offset();
            let newXOff = xOffsetCoeff * numWindows;
            while (newXOff > maxOffset) {
                newXOff = newXOff - maxOffset;
            }
            let newYOff = yOffsetCoeff * numWindows;
            while (newYOff > maxOffset) {
                newYOff = newYOff - maxOffset;
            }
            $(newWindow).children().first().css({ top: pos.top + newXOff, left: pos.left + newYOff });
            $(newWindow).css("opacity", "1");
            $(newWindow).children().resizable({
                handles: "all"
            }).hide().show("slow", callback);
            if (newElem[1]) {
                newElem[1]($(newWindow));
            };
            if (path.charAt(0) == '#') {
                path = path.substr(1);
            }
            if (path == "") {
                path = "index";
            }
            if (currentDirectory == "/") {
                $(newWindow).find("#path").text('C:\\ERICQIAN.ME\\' + path.toUpperCase() + ".HTML");
            }
            else {
                $(newWindow).find("#path").text('C:\\ERICQIAN.ME\\' + currentDirectory + '\\' + path.toUpperCase() + ".HTML");
            }

            numWindows++;

            clearInterval(waitUntilExist);
        }
    }, 50)
    return newWindow;
}

function destroyWindow(cliElem) {
    $(cliElem).remove();
    numWindows--;
}
function zIndexHandler() {
    $(this).css("z-index", numWindows);
    var needReIndex = false;
    $("#windows").children().not(this).each(function () {
        if ((parseInt($(this).css('z-index')) || 0) == numWindows) {
            needReIndex = true;
        }
    });
    if (needReIndex) {
        $("#windows").children().not(this).each(function () {
            var newIndex = (parseInt($(this).css('z-index')) || 0) - 1;
            if (newIndex < 0) {
                newIndex = 0;
            }
            $(this).css("z-index", newIndex);
        });
    }
}

function openWithTransfer(path, elm) {
    let newWindow = createWindow(path);
    let waitUntilExist = setInterval(function () {
        if ($(newWindow).children().length && $(elm).length) {
            $(elm).transfer({ to: $(newWindow).children(), duration: 'slow' });
            clearInterval(waitUntilExist);
        }
    }, 10);
}