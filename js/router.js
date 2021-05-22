/*
    Copyright (C) 2020 Eric Qian.
    <https://ericqian.me/>
    All rights reserved.
*/

const entryPath = "menu";
var rootDomain = location.host;
var mainDomain = false;
var devMode = false;

// Warn: if path hardcoded, some elm might not load 
// due to XSS concerns***
console.debug("router: root domain - " + rootDomain);

if (rootDomain == "ericqian.me") {
    mainDomain = true;
    console.debug("router: Loaded on main domain.")
}
else if (rootDomain == "factorialize.com") {
    console.debug("router: Loaded on domain alias.");
}
else if (rootDomain == "enumc.com") {
    console.debug("router: Loaded on domain alias.");
}
else if (rootDomain.startsWith("localhost") || rootDomain.startsWith("127.0.0.1")) {
    devMode = true;
    console.warn("WARNING: The webpage has been served by localhost. Development mode is on.");
}
else {
    console.warn("router: Loaded on alternate domain. Due to XSS limitations, please ensure resources are correctly loaded.");
    console.warn("LICENSE: https://raw.githubusercontent.com/EnumC/EnumC.com/master/LICENSE");
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

function initInitialLoadSequence(e) {
    // addLog("<div class='cli-text'>Loading initial .</div>");
    addLog("<div class='cli-text'>This site is undergoing a complete redesign, and therefore might be very incomplete. Please see <a href='https://bananium.com' target='_blank' style='color:white; text-decoration:none;'>https://bananium.com</a> for past content.</div>",e);
    
    typeText("$ [" + currentDirectory + "] " + "startx",e);
    setTimeout(function () {
        // typeText("loading GUI...", e, 10);
        setTimeout(function () {
            // addLog("<div class='cli-text'>GUI Not yet available.</div>",e);
            addLog("<div class='cli-text'>Last revision on: " + lastAuthored + ".</div>",e);
            // updateCommitDetails(function() {
                
            // });
            

            setTimeout(function () {
                addLog("<div class='cli-text'>Dropping into shell.</div>",e);
                setTimeout(function () {
                    typeText("#     #                                                              #######                       #####  \n#  #  # ###### #       ####   ####  #    # ######    #####  ####     #       #    # #    # #    # #     # \n#  #  # #      #      #    # #    # ##  ## #           #   #    #    #       ##   # #    # ##  ## #       \n#  #  # #####  #      #      #    # # ## # #####       #   #    #    #####   # #  # #    # # ## # #       \n#  #  # #      #      #      #    # #    # #           #   #    #    #       #  # # #    # #    # #       \n#  #  # #      #      #    # #    # #    # #           #   #    #    #       #   ## #    # #    # #     # \n ## ##  ###### ######  ####   ####  #    # ######      #    ####     ####### #    #  ####  #    #  #####  \n                                                                                                          \n", e, 0);
                }, 500);
            }, 500);
        }, 500);
    }, 0);
    

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
            location.hash = "cli";
            path = "cli";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/cli.html"), function (e) {
                initInitialLoadSequence(e);
                hideLoading();
            }];
            break;
        case "menu":
            location.hash = "menu";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/menu.html"), placeholderPrep];
            break;
        case "gui":
            // $("#loaded-content").load("/html/mobile.html", function (){});
            window.location.href = "/html/mobile.html";
            location.hash = "gui";
            break;
        case "cli":
            location.hash = "cli";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/cli.html"), funct];
            break;
        case "resume":
            // window.open("/files/Eric_Qian_e_Resume_BW_040221.pdf");
            location.hash = "resume";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/general.html"), function (e) {
                addContainerLog('<object type="application/pdf" style="width: inherit; height: inherit;" data="/files/Eric_Qian_e_Resume_BW_040221.pdf"><iframe src = "/libs/ViewerJS/?zoom=page-width#../../files/Eric_Qian_e_Resume_BW_040221.pdf" style="width: 100%; height: 100%" allowfullscreen webkitallowfullscreen></iframe></object>',e);
            }];
            break;
        case "projects":
            // window.open("/files/Eric_Qian_e_Resume_BW_040221.pdf");
            location.hash = "projects";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/general.html"), function (e) {
                addContainerLog('<iframe src = "https://bananium.com/projects" style="width: inherit; height: 100%" allowfullscreen webkitallowfullscreen></iframe>', e);
            }];
            break;
        case "blog":
            location.hash = "blog";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/general.html"), function (e) {
                addContainerLog('<iframe src = "https://blog.ericqian.me" style="width: inherit; height: 100%" allowfullscreen webkitallowfullscreen></iframe>', e);
            }];
            break;
        case "linkedin":
            location.hash = "linkedin";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/general.html"), function (e) {
                addContainerLog('<iframe src = "https://www.linkedin.com/in/enumc" style="width: inherit; height: 100%" allowfullscreen webkitallowfullscreen></iframe>', e);
            }];
            break;
        case "EP-01":
            $("#loaded-content").load("/html/cli.html", function (e) {
                addLog("<div class='cli-text'>Please wait... If nothing happens, click here: https://www.youtube.com/watch?v=7pK42-nQZ-4</div>",e);
                window.location.href = "https://www.youtube.com/watch?v=7pK42-nQZ-4";
            });
            break;
        case "gravity":
            $("#loaded-content").load("/html/cli.html", function (e) {
                typeText("GRAVITY: Thank you for your interest! To be kept up to date on club-related news," + 
                        "enter the following information...", e, 25);
                        commandHandler('signup', 'gravity');
            });
            break;
        case "dirTest":
            location.hash = "cli";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/cli.html"), function (e) {
                addLog("<div class='cli-text'>directory routing test successful.</div>",e);
            }];
            break;
        case "fileTest":
            location.hash = "cli";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/cli.html"), function (e) {
                addLog("<div class='cli-text'>file routing test successful.</div>",e);
            }];
            break;
        case "top-secret-hash":
            location.hash = "top-secret-hash";
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/cli.html"), function (e) {
                typeText("You have gained access to a top secret database.", 25);
                addLog("<div class='cli-text'>There is a password hash hidden somewhere on this page.</div>",e);
                addLog("<div class='cli-text'>If you are able to successfully decode it, a secret awaits!</div>",e);
                addLog("<div class='cli-text'>programmers loves to use notepad in order to edit binary files, right? RIGHT?</div>",e);
                addLog("<div class='cli-text'><img src='files/ben.png' style='height:25vh'></img></div>",e);
                dateInPastArrow = (firstDate, secondDate) => firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0);
                var today = new Date();
                var targetDateInclusive = new Date('2020-10-15');
                if (dateInPastArrow(targetDateInclusive, today)) {
                    addLog("<div class='cli-text'>the database is under maintainence! Quick, use this oppotunity to break through validation!</div>",e);
                    commandHandler('login', '');
                }
                else {
                    addLog("<div class='cli-text'>Submission is disabled for " + new Date() + ". The IT department is on full alert today. Try again later.</div>",e);
                }

            }];
            break;
        case "400":
            validPath = false;
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/cli.html"), function (e) {
                addLog("<div class='cli-text'>400: requested path: |" + path + "| can not be processed. Please retry your request in the following format: https://enumc.com/requestedpath</div>",e);
                addLog("<img src='https://httpstatusdogs.com/img/400.jpg' style='height:20em' class=''></img> <p style='font-size: 6px;'>Image supplied by https://httpstatusdogs.com/ <3</p>",e);
            }];
            break;
        default:
            // alert("404: requested path: |" + path + "| is invalid.");
            validPath = false;
            return [$("<div style='width: 100 %; height: auto;'></div>").load("/html/cli.html"), function (e) {
                addLog("<div class='cli-text'>404: requested path: |" + path + "| is invalid.</div>",e);
                addLog("<img src='https://httpstatusdogs.com/img/404.jpg' style='height:20em' class=''></img> <p style='font-size: 6px;'>Image supplied by https://httpstatusdogs.com/ <3</p>",e);
            }];
            break;
    }
    // if (validPath) {
    //     if (currentDirectory == "/") {
    //         $('#path').text('C:\\ENUMC.COM\\' + path.toUpperCase() + ".HTML");
    //     }
    //     else {
    //         $('#path').text('C:\\ENUMC.COM\\' + currentDirectory + '\\' + path.toUpperCase() + ".HTML");
    //     }
    //     currentPath = path.toLowerCase();
    // }
    // else {
    //     $('#path').text('UNKNOWN');
    // }
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

