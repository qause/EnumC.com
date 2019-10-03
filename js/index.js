/*
    Copyright (C) 2019 Eric Qian.
    <https://enumc.com/>
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


window.onbeforeunload = function () { 
    // Set position to top prior to refresh, since this is a 
    // single page application, and scroll should not persist
    // across refreshes. 
    window.scrollTo(0, 0); 
};

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