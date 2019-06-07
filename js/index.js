let points = undefined;
let canvas = undefined;
let ctx = undefined;

// Higher = slower animation.
let global_animate_numPoints = 100;

// Higher = faster text render.
let typeSpeed = 15;



/**
 * Frame-by-frame video animation with ScrollMagic and GSAP
 * 
 * Note that your web server must support byte ranges (most do).
 * Otherwise currentTime will always be 0 in Chrome.
 * See here: http://stackoverflow.com/a/5421205/950704
 * and here: https://bugs.chromium.org/p/chromium/issues/detail?id=121765
 */

const video = document.getElementById('video');
const long = document.getElementById('long');
let scrollpos = 0;
let lastpos;
const controller = new ScrollMagic.Controller();
const scene = new ScrollMagic.Scene({
    triggerElement: long,
    triggerHook: "onEnter"
});
const startScrollAnimation = () => {
    scene
        .addTo(controller)
        .duration(long.clientHeight - window.innerHeight)
        .offset(window.innerHeight/2)
        .on("progress", (e) => {
            scrollpos = e.progress;
        })
        .on("leave", (e) => {
            $('#video').fadeOut();
        })
        .on("enter", (e) => {
            $('#video').fadeIn();
        });
        
    scene.addIndicators({ name: "main animate", colorEnd: "#CCCC00" });

    setInterval(() => {
        if (lastpos === scrollpos) return;
        requestAnimationFrame(() => {
            video.currentTime = video.duration * scrollpos;
            video.pause();
            lastpos = scrollpos;
            console.log(video.currentTime, scrollpos);
        });
    }, 50);
};

const preloadVideo = (v, callback) => {
    const ready = () => {
        v.removeEventListener('canplaythrough', ready);

        video.pause();
        var i = setInterval(function () {
            if (v.readyState > 3) {
                clearInterval(i);
                video.currentTime = 0;
                callback();
            }
        }, 50);
    };
    v.addEventListener('canplaythrough', ready, false);
    try {
        v.play();
    }
    catch (e) {
        console.warn("Error occured when calling v.play(). Stacktrace: ");
        console.warn(e);
    }
};

preloadVideo(video, startScrollAnimation);

// startScrollAnimation();





// On DOM ready.
$(document).ready(function() {
    $("#autoSc").click(function () {
        console.log("Start auto scroll");
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#end").offset().top
        }, document.documentElement.scrollHeight);
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
    
    ctx.strokeStyle = "#7B0000";
    ctx.font = "48px monospace";
    ctx.shadowColor = "rgba(0,255,0,0.8)";
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#7B0000';
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
// remember to fix method asap
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






