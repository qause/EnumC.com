/*
    Copyright (C) 2019 Eric Qian.
    <https://enumc.com/>
    All rights reserved.
*/

const entryPath = "menu";
let currentPath;
function placeholderPrep() {
    processWaitMsg(".fadeinout");
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
    var origPath = parent.location.hash;
    var validPath = true;
    if (path.charAt(0) == '#') {
        path = path.substr(1);
    }
    if (origPath.charAt(0) == '#') {
        origPath = origPath.substr(1);
    }
    console.log("Switching to path: " + path + " from path: " + origPath);
    console.log("with callback: ");
    console.log(funct);

    if (origPath == "menu") {
        try {
            console.log("destroying scrollmagic controller");
            controller.destroy(true);
            // Remove scrollmagic controller when navigating away.
        }
        catch (err) {
            console.warn("failed to destroy scrollmagic controller. This is not fatal.");
        }
        
    }
    switch (path) {
        case "":
            $("#loaded-content").load("/html/menu.html", placeholderPrep);
            parent.location.hash = "menu";
            break;
        case "menu":
            $("#loaded-content").load("/html/menu.html", placeholderPrep);
            parent.location.hash = "menu";
            break;
        case "cli":
            $("#loaded-content").load("/html/cli.html", funct);
            parent.location.hash = "cli";
            break;
        case "400":
            validPath = false;
            $("#loaded-content").load("/html/cli.html", function () {
                addLog("<div class='cli-text'>400: requested path: |" + path + "| can not be processed. Please retry your request in the following format: https://enumc.com/requestedpath</div>");
                addLog("<img src='https://httpstatusdogs.com/img/400.jpg' style='height:20em' class=''></img> <p style='font-size: 6px;'>Image supplied by https://httpstatusdogs.com/ <3</p>");
            })
            break;
        default:
            // alert("404: requested path: |" + path + "| is invalid.");
            validPath = false;
            $("#loaded-content").load("/html/cli.html", function() {
                addLog("<div class='cli-text'>404: requested path: |" + path + "| is invalid.</div>");
                addLog("<img src='https://httpstatusdogs.com/img/404.jpg' style='height:20em' class=''></img> <p style='font-size: 6px;'>Image supplied by https://httpstatusdogs.com/ <3</p>");
            })
            break;
    }
    if (validPath) {
        $('#path').text('C:\\ENUMC.COM\\' + currentDirectory + '\\' + path.toUpperCase() + ".HTML");
        currentPath = path.toLowerCase();
    }
    else {
        $('#path').text('UNKNOWN');
    }
}

let debResizeTimer; // Used for resize debounce
$(window).on('resize', function (e) {
    clearTimeout(debResizeTimer);
    debResizeTimer = setTimeout(function () {

        var width = $(this).width(),
            height = $(this).height(),
            aspRatio = width / height;

        console.log(parent.location.hash + " viewport resize. firing resize handler(s)");
        switch (parent.location.hash) {
            case "#menu":
                onMenuViewportChange();
                break;
            case "#cli":

                break;
            case "#400":

                break;
            default:
                console.warn("invalid location. unable to fire resize handler(s)");
                break;
        }

    }, 250);
    
});

loadPath(parent.location.hash, function () { });