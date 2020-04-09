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
if (rootDomain.startsWith("localhost") || rootDomain.startsWith("127.0.0.1")) {
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
    addLog("<div class='cli-text'>This site is undergoing a complete redesign, and therefore might be very incomplete. Please see https://bananiumlabs.com for past content.</div>");
    
    typeText("$ [" + currentDirectory + "] " + "startx");
    setTimeout(function () {
        typeText("loading GUI...", 50);
        setTimeout(function () {
            addLog("<div class='cli-text'>GUI Not yet available.</div>");
            addLog("<div class='cli-text'>Last revision on: " + lastAuthored + ".</div>");
            // updateCommitDetails(function() {
                
            // });
            

            setTimeout(function () {
                addLog("<div class='cli-text'>Dropping into shell.</div>");
                setTimeout(function () {
                    typeText("#     #                                                              #######                       #####  \n#  #  # ###### #       ####   ####  #    # ######    #####  ####     #       #    # #    # #    # #     # \n#  #  # #      #      #    # #    # ##  ## #           #   #    #    #       ##   # #    # ##  ## #       \n#  #  # #####  #      #      #    # # ## # #####       #   #    #    #####   # #  # #    # # ## # #       \n#  #  # #      #      #      #    # #    # #           #   #    #    #       #  # # #    # #    # #       \n#  #  # #      #      #    # #    # #    # #           #   #    #    #       #   ## #    # #    # #     # \n ## ##  ###### ######  ####   ####  #    # ######      #    ####     ####### #    #  ####  #    #  #####  \n                                                                                                          \n");
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
    

    // initGUILoadSequence();
}

function initGUILoadSequence() {
    // typeText("$ [" + currentDirectory + "] " + "startx");
    // setTimeout(function () { 
    //     // addLog("<div class='cli-text'>loading GUI...</div>"); 
    //     // setTimeout(function () {
    //     //     addLog("<div class='cli-text'>loading content...</div>");
            
    //     //     commandHandler('startx', '');
    //     //     setTimeout(function() {
    //     //         typeText("#     #                                                              #######                       #####  \n#  #  # ###### #       ####   ####  #    # ######    #####  ####     #       #    # #    # #    # #     # \n#  #  # #      #      #    # #    # ##  ## #           #   #    #    #       ##   # #    # ##  ## #       \n#  #  # #####  #      #      #    # # ## # #####       #   #    #    #####   # #  # #    # # ## # #       \n#  #  # #      #      #      #    # #    # #           #   #    #    #       #  # # #    # #    # #       \n#  #  # #      #      #    # #    # #    # #           #   #    #    #       #   ## #    # #    # #     # \n ## ##  ###### ######  ####   ####  #    # ######      #    ####     ####### #    #  ####  #    #  #####  \n                                                                                                          \n"
    //     //             , 2);
    //     //         $("#loaded-content").load("/html/ui_begin.html", function() {
    //     //             $("#gui-container").fadeIn(3000);
    //     //         });
                
    //     //     }, 1500);
    //     // }, 1500);
    // }, 1500);    
    
}

function loadPath(path, funct) {
    var origPath = location.hash;
    var validPath = true;
    if (typeof path === "undefined") {
        console.warn("router: no object for path provided for loadPath(). Assuming path is empty.");
        path = "";
    }
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
                hideLoading();
            });
            location.hash = "cli";
            path = "cli";
            break;
        case "menu":
            $("#loaded-content").load("/html/menu.html", placeholderPrep);
            location.hash = "menu";
            break;
        case "gui":
            // $("#loaded-content").load("/html/mobile.html", function (){});
            window.location.href = "/html/mobile.html";
            location.hash = "gui";
            break;
        case "cli":
            $("#loaded-content").load("/html/cli.html", funct);
            location.hash = "cli";
            break;
        case "resume":
            window.open("/files/resume.pdf");
            break;
        case "EP-01":
            $("#loaded-content").load("/html/cli.html", function () {
                addLog("<div class='cli-text'>Please wait... If nothing happens, click here: https://www.youtube.com/watch?v=7pK42-nQZ-4</div>");
                window.location.href = "https://www.youtube.com/watch?v=7pK42-nQZ-4";
            })
            break;
        case "gravity":
            $("#loaded-content").load("/html/cli.html", function () {
                typeText("GRAVITY: Thank you for your interest! To be kept up to date on club-related news," + 
                        "enter the following information...", 25);
                        commandHandler('signup', 'gravity');
            });
            break;
        case "dirTest":
            $("#loaded-content").load("/html/cli.html", function() {
                addLog("<div class='cli-text'>directory routing test successful.</div>");
            });
            location.hash = "cli";
            break;
        case "fileTest":
            $("#loaded-content").load("/html/cli.html", function () {
                addLog("<div class='cli-text'>file routing test successful.</div>");
            });
            location.hash = "cli";
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

        console.log("router: " + location.hash + " viewport resize. firing resize handler(s)");
        switch (location.hash) {
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

loadPath(location.hash, function () { });