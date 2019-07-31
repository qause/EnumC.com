/*
    Copyright (C) 2019 Eric Qian.
    <https://enumc.com/>
    All rights reserved.
*/

let pathname = parent.location.hash;
console.log("Current Path: " + pathname);


function placeholderPrep() {
    fadeinandout(".fadeinout");
    // video = document.getElementById('video');
    // console.log(document.getElementById('video'));
    // long = document.getElementById('long');

    preloadVideo(video, startScrollAnimation);

    
    $(".main-center-header").fadeTo(5000, 1, function () {
        fadeInComplete = true;
    });
    document.getElementById("video").addEventListener("canplaythrough", function () {
        videoReady = true;
    });
    $("#autoSc").fadeTo(5000, 1);
    $("#experimental").fadeTo(5000, 1);
    $("#commitData").fadeTo(5000, 1);
    $(".container").fadeTo(5000, 1);


    $("#autoSc").click(function () {
        console.log("Start auto scroll");
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#end").offset().top
        }, document.documentElement.scrollHeight);
    });

    $("#experimental").click(function () {
        console.log("Loading experimental elements...");
        loadPath("cli", function (data) { });
    });
}

function loadPath(path, funct) {
    if (path.charAt(0) == '#') {
        path = path.substr(1);
    }
    console.log("Switching to path: " + path);
    console.log("with callback: ");
    console.log(funct);
    switch (path) {
        case "":
            $("#loaded-content").load("html/placeholder.html", placeholderPrep);
            parent.location.hash = "placeholder";
            break;
        case "placeholder":
            $("#loaded-content").load("html/placeholder.html", placeholderPrep);
            parent.location.hash = "placeholder";
            break;
        case "cli":
            $("#loaded-content").load("html/cli.html", funct);
            parent.location.hash = "cli";
            break;
        default:
            alert("requested path: |" + path + "| is invalid.");
            break;
    }
}

loadPath(pathname, function() {});