/*
    Copyright (C) 2019 Eric Qian.
    <https://enumc.com/>
    All rights reserved.
*/

const entryPath = "menu";
var rootDomain = location.host;
var mainDomain = false;
var devMode = false;

// Warn: if path hardcoded, some elm might not load 
// due to XSS concerns***
console.debug("router: root domain - " + rootDomain);

if (rootDomain == "enumc.com") {
    mainDomain = true;
    console.debug("router: Loaded on main domain.")
}
else if (rootDomain == "factorialize.com") {
    console.debug("router: Loaded on domain alias.");
}
else {
    console.warn("router: Loaded on alternate domain. Due to XSS limitations, please ensure resources are correctly loaded.");
    console.warn("LICENSE: https://raw.githubusercontent.com/EnumC/EnumC.com/master/LICENSE");
}
if (rootDomain.startsWith("localhost")) {
    devMode = true;
    console.warn("WARNING: The webpage has been served by localhost. Development mode is on.");
}

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

function initInitialLoadSequence() {
    // addLog("<div class='cli-text'>Loading initial .</div>");
    // typeText("loading...", 500);
    typeText("#     #                                                              #######                       #####  \n#  #  # ###### #       ####   ####  #    # ######    #####  ####     #       #    # #    # #    # #     # \n#  #  # #      #      #    # #    # ##  ## #           #   #    #    #       ##   # #    # ##  ## #       \n#  #  # #####  #      #      #    # # ## # #####       #   #    #    #####   # #  # #    # # ## # #       \n#  #  # #      #      #      #    # #    # #           #   #    #    #       #  # # #    # #    # #       \n#  #  # #      #      #    # #    # #    # #           #   #    #    #       #   ## #    # #    # #     # \n ## ##  ###### ######  ####   ####  #    # ######      #    ####     ####### #    #  ####  #    #  #####  \n                                                                                                          \n"
            , 2);
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
    console.log("router: Switching to path: " + path + " from path: " + origPath);
    console.log("router : with callback: ");
    console.log(funct);

    if (origPath == "menu") {
        try {
            console.debug("router: destroying scrollmagic controller");
            controller.destroy(true);
            // Remove scrollmagic controller when navigating away.
        }
        catch (err) {
            console.warn("router: failed to destroy scrollmagic controller. This is not fatal.");
        }
        
    }
    switch (path) {
        case "":
            // $("#loaded-content").load("/html/menu.html", placeholderPrep);
            $("#loaded-content").load("/html/cli.html", function() {
                initInitialLoadSequence();
            });
            parent.location.hash = "cli";
            path = "cli";
            break;
        case "menu":
            $("#loaded-content").load("/html/menu.html", placeholderPrep);
            parent.location.hash = "menu";
            break;
        case "cli":
            $("#loaded-content").load("/html/cli.html", funct);
            parent.location.hash = "cli";
            break;
        case "resume":
            window.open("/files/resume.pdf");
            break;
        case "EP-01":
            $("#loaded-content").load("/html/cli.html", function () {
                addLog("<div class='cli-text'>ELEV PITCH - NOT IMPLEMENTED.</div>");
            })
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
        if (currentDirectory == "/") {
            $('#path').text('C:\\ENUMC.COM\\' + path.toUpperCase() + ".HTML");
        }
        else {
            $('#path').text('C:\\ENUMC.COM\\' + currentDirectory + '\\' + path.toUpperCase() + ".HTML");
        }
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

        console.log("router: " + parent.location.hash + " viewport resize. firing resize handler(s)");
        switch (parent.location.hash) {
            case "#menu":
                onMenuViewportChange();
                break;
            case "#cli":

                break;
            case "#400":

                break;
            default:
                console.warn("router: invalid location. unable to fire resize handler(s)");
                break;
        }

    }, 250);
    
});

loadPath(parent.location.hash, function () { });