/*
    Copyright (C) 2019 Eric Qian.
    <https://enumc.com/>
    All rights reserved. 
*/

console.log("CLI loading stated.");
window.scrollTo(0, 0);

if (typeof commandData == "undefined") {
    let commandData = {};
}
try {
    initCLI();
}
catch (err) {
    $("#cli-container").html("<p class='cli-text'>CLI initialization error: " + err + ".</p>" +
        "<p class='cli-text'>Please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>");
    throw new Error("CLI initialization error: " + err);
}

/* Add HTML content to log. */
function addLog(content) {
    $('.log').append(content);
    logContent.push(content);
    window.scrollTo(0, document.body.scrollHeight);
}

/* Recursive method to type text to log with delay between each character.
   content:     HTML content
   delayTime:   Delay between character in ms
*/
function typeText(content, delayTime, isInProg, inProgObj) {

    if (isInProg != true) {
        var typingElement = $('<pre class="cli-text" style="overflow: visible; line-height: 0.5em;"></pre>');
        var typingElementComplete = $('<pre class="cli-text" style="overflow: visible; line-height: 0.5em;"></pre>').html(content);
        logContent.push(typingElementComplete);
        $('.log').append(typingElement);
    }
    else {
        var typingElement = inProgObj;
    }
    if (content.length === 0) {
        return;
    }
    
    setTimeout(function () {
        typingElement.html(typingElement.html() + content.charAt(0));
        content = content.substr(1);
        typeText(content, delayTime, true, typingElement);
        
    }, delayTime);
}

function commandHandler(command, args, directoriesAndFiles) {
    try {
            addLog("$ [" + currentDirectory + "] " + command + " " + args + "<br>");
            switch (command) {
                case "help":
                    addLog('<div class="cli-text">available commands: </div><br><div class="cli-text">cd, ls, open, echo, fetch, time, man, clear, exit</div>');
                    break;
                case "cd":
                    console.log("dir requested: " + args.trim());

                    if (args.trim().toUpperCase() == "..") {
                        currentDirectory = "/";
                    }
                    else if ((args.trim().toUpperCase() in directoriesAndFiles)) {
                        currentDirectory = args.toUpperCase();
                    }
                    else {
                        let files = directoriesAndFiles[currentDirectory].split("\n");
                        let fileFound = false;
                        files.forEach(element => {
                            if (element == args) {
                                fileFound = true;
                            }
                        });
                        if (args.trim() == "") {
                            addLog("<div class='cli-text'>cd: " + "No path specified. Type 'man cd' to display example syntax." + ".</div>");
                        }
                        else if (!fileFound) {
                            addLog("<div class='cli-text'>cd: " + args + ": No such file or directory" + ".</div>");
                        }
                        else {
                            addLog("<div class='cli-text'>cd: " + args + ": is a file" + ".</div>");
                        }
                    }
                    $('#mark').text("$ [" + currentDirectory + "]");
                    console.log("currentDirectory changed to: " + currentDirectory);
                    switch (currentDirectory) {
                        case "/":
                            $('#path').text('C:\\ENUMC.COM\\');
                            break;
                        case "~/":
                            $('#path').text('C:\\ENUMC.COM\\SYSTEM\\');
                            break;
                        default:
                            $('#path').text('C:\\ENUMC.COM\\' + currentDirectory + '\\');
                    }
                    break;
                case "time":
                    addLog(Date());
                    break;
                case "echo":
                    addLog("<div class='cli-text'>" + args + "</div>");
                    break;
                case "ls":
                    // addLog("<div class='blinking cli-text'>Access Denied.</div>");
                    // addLog("<img src='https://httpstatusdogs.com/img/401.jpg' style='height:20em' class='blinking'></img> <p style='font-size: 6px;'>Image supplied by https://httpstatusdogs.com/ <3</p>");
                    addLog("<p class='cli-text' style='white-space: pre-line;'>" + directoriesAndFiles[currentDirectory] + "</p>");
                    // addLog("<p class='cli-text' style='white-space: pre-line;'>resume\nprofile\nmenu\ncli</p>");
                    break;
                case "fetch":
                    $.getJSON('https://dog.ceo/api/breeds/image/random', function (data) {
                        console.info(data.message);
                        addLog("<img src='" + data.message + "' style='height:20em' class=''></img> <p style='font-size: 6px;'>Image supplied by https://dog.ceo/dog-api/ <3</p>");
                    });
                    break;
                case "open":
                    let files = directoriesAndFiles[currentDirectory].split("\n");
                    let fileFound = false;
                    files.forEach(element => {
                        if (element == args) {
                            fileFound = true;
                        }
                    });
                    if (args.trim() == "") {
                        addLog("<div class='cli-text'>open: " + "No file specified. Type 'man open' to display example syntax." + ".</div>");
                    }
                    else if (!fileFound) {
                        addLog("<div class='cli-text'>cd: " + args + ": No such file. To open a directory, use cd. " + ".</div>");
                    }
                    else {
                        loadPath(args, function () { });
                    }
                    break;
                case "signup":
                    if (args.trim() == "gravity") {
                        
                        if (typeof commandData == "undefined" || commandData["email"] == undefined) {
                            commandData = { "email": undefined, "firstName": undefined, "lastName": undefined };
                        } 
                        console.log(commandData);
                        if(commandData["email"] == undefined) {
                            addLog("<div class='cli-text'>What is your email?</div>");
                            addLog("<input id='emailIn' onblur='this.focus()' autofocus style='color:black'></input>")
                            $('#emailIn').keypress(function (event) {
                                if ((event.keyCode ? event.keyCode : event.which) == '13') {
                                    
                                    document.getElementById("emailIn").disabled = true;
                                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('#emailIn').val().trim())) {
                                        commandData["email"] = $('#emailIn').val().trim();
                                    }
                                    else {
                                        addLog("<div class='cli-text'>invalid email address. Please try again.</div>");
                                        $(this).remove(); 
                                    }
                                    $('#emailIn').unbind("keypress");
                                    console.log(commandData);
                                    commandHandler("signup", "gravity");
                                }

                            });
                            document.getElementById("emailIn").select();
                        }
                        else if (commandData["firstName"] == undefined) {
                            addLog("<div class='cli-text'>What is your first name?</div>");
                            addLog("<input id='fNameIn' onblur='this.focus()' autofocus style='color:black'></input>")
                            $('#fNameIn').keypress(function (event) {
                                if ((event.keyCode ? event.keyCode : event.which) == '13') {
                                    document.getElementById("fNameIn").disabled = true;
                                    if ($('#fNameIn').val().trim().length > 0){
                                        commandData["firstName"] = $('#fNameIn').val().trim();
                                    }
                                    else {
                                        addLog("<div class='cli-text'>First name cannot be blank. Please try again.</div>");
                                        $(this).remove();
                                    }
                                    $('#fNameIn').unbind("keypress");
                                    console.log(commandData);
                                    commandHandler("signup", "gravity");
                                }

                            });
                            document.getElementById("fNameIn").select();
                        }
                        else if (commandData["lastName"] == undefined) {
                            addLog("<div class='cli-text'>What is your last name?</div>");
                            addLog("<input id='lNameIn' onblur='this.focus()' autofocus style='color:black'></input>")
                            $('#lNameIn').keypress(function (event) {
                                if ((event.keyCode ? event.keyCode : event.which) == '13') {
                                    document.getElementById("lNameIn").disabled = true;
                                    if ($('#lNameIn').val().trim().length > 0) {
                                        commandData["lastName"] = $('#lNameIn').val().trim();
                                    }
                                    else {
                                        addLog("<div class='cli-text'>Last name cannot be blank. Please try again.</div>");
                                        $(this).remove();
                                    }
                                    $('#lNameIn').unbind("keypress");
                                    console.log(commandData);
                                    commandHandler("signup", "gravity");
                                }

                            });
                            document.getElementById("lNameIn").select();
                        }
                        else {
                            addLog("<div class='cli-text'>Submitting information...</div>");
                            addLog("<progress id='infoPendingProgressBar'></progress>");
                            $.getJSON('https://gravity.enumc.com/newSubscriber.php?email=' + commandData["email"] + '&fname=' + commandData["firstName"] + '&lname=' + commandData["lastName"], function (data) {
                                let items = {};
                                $.each(data, function (key, val) {
                                    items[key] = val;
                                });

                                if (items["success"] == true) {
                                    if (items["message"] == "pending") {
                                        addLog("<div class='cli-text'>One last step!</div>");
                                        addLog("<div class='cli-text'>Email confirmation is required.</div>");
                                        addLog("<div class='cli-text'>You will receive a confirmation email within a couple minutes.</div>");
                                    }
                                    else {
                                        addLog("<div class='cli-text'>You have been successfully added to the mailing list!</div>");
                                    }
                                    
                                }
                                else {
                                    addLog("<div class='cli-text' style='word-break: break-all; width: 25em;'>An error occured. Reason: " + items["message"] + "</div>");
                                    addLog("<div class='cli-text' style='word-break: break-all; width: 25em;'>You may retry by either typing 'signup gravity' or by refreshing the page.</div");
                                    commandData = undefined;
                                }
                                $('#infoPendingProgressBar').remove();
                                console.log(items);

                            }).fail(function(e) {
                                $('#infoPendingProgressBar').remove();
                                console.log(e);
                                addLog("<div class='cli-text'>Error: AJAX request failed. Please check your internet connection and try again in a few minutes. If it still doesn't work,</div>");
                                addLog("<p class='cli-text'>please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>");
                            });
                        }

                    }
                    break;
                case "startx":
                    addLog("<div class='cli-text'>Display loading...</div>");
                    loadPath('gui');
                    break;
                case "man":
                    switch (args) {
                        case "":
                            addLog("<div class='cli-text'>No argument defined. Enter 'man command_name_here' for usage. </div>");
                            break;
                        case "help":
                            addLog("<div class='cli-text'>Display help page</div>");
                            addLog("<div class='cli-text'>Usage: help</div>");
                            break;
                        case "cd":
                            addLog("<div class='cli-text'>Set directory</div>");
                            addLog("<div class='cli-text'>Usage: cd [directoryname]</div>");
                            break;
                        case "time":
                            addLog("<div class='cli-text'>Display current time</div>");
                            addLog("<div class='cli-text'>Usage: time</div>");
                            break;
                        case "echo":
                            addLog("<div class='cli-text'>Echo arg</div>");
                            addLog("<div class='cli-text'>Usage: echo [arg]</div>");
                            break;
                        case "ls":
                            addLog("<div class='cli-text'>List files in current directory</div>");
                            addLog("<div class='cli-text'>Usage: ls</div>");
                            break;
                        case "fetch":
                            addLog("<div class='cli-text'>:3</div>");
                            addLog("<div class='cli-text'>Usage: fetch</div>");
                            break;
                        case "open":
                            addLog("<div class='cli-text'>Open file</div>");
                            addLog("<div class='cli-text'>Usage: open [filename]</div>");
                            break;
                        case "man":
                            addLog("<div class='cli-text'>Get command usage</div>");
                            addLog("<div class='cli-text'>Usage: man [commandname]</div>");
                            break;
                        case "login":
                            break;
                        case "su":
                            break;
                        case "whoami":
                            break;
                        case "command_name_here":
                            addLog("<div class='cli-text'>What did your instructor say about blindly copy pasting commands?!</div>");
                            addLog("<div class='cli-text'>To request the manual for a command, use an actual command name.</div>");
                            break;
                        case "clear":
                            addLog("<div class='cli-text'>Clear terminal</div>");
                            addLog("<div class='cli-text'>Usage: clear</div>");
                            break;
                        case "exit":
                            addLog("<div class='cli-text'>Exit terminal</div>");
                            addLog("<div class='cli-text'>Usage: exit</div>");
                            break;
                        default:
                            addLog("<div class='cli-text'>man page for " + args + " does not exist.</div>")
                            break;
                    }
                    break;

                // Server-side requests
                case "login":
                    addLog("not implemented");
                    break;
                case "su":
                    addLog("not implemented");
                    break;
                case "whoami":
                    addLog("not implemented");
                    break;
                // End server-side requests

                // Exception testing.
                case "breakme":
                    throw new Error("debug error");
                    break;
                case "reseterror":
                    document.getElementById("content-error-icon").style.display = "none";
                    break;
                // End exception testing.

                case "clear":
                    $('.log').html("");
                    logContent = [];
                    break;
                case "exit":
                    loadPath("menu", function () { });
                    break;
                default:
                    addLog("<div class='cli-text'>eCLI: " + command + ": command not found" + ".</div>");
            }
        addLog('<br><br>');
        document.getElementsByClassName("commandline")[0].select();
    }
    catch (err) {
        let errCommand = $('.commandline').val().trim();
        $("#cli-container").html("<p class='cli-text'>CLI command error: " + err + ".</p>" +
            "<br><p class='cli-text'>Command: " + errCommand + ".</p>" +
            "<p class='cli-text'>Please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>");
        throw new Error("CLI command error: " + err);
    };
}

/* Initializes CLI and set up command, filesystem, and data. */
function initCLI() {
    if (typeof lastAuthored != "string") {
        updateCommitDetails(function () {
            $("#lastModElement").html($("#lastModElement").html() + lastAuthored);
        });
    }
    else {
        $("#lastModElement").html($("#lastModElement").html() + lastAuthored);
    }

    logContent.forEach(element => {
        addLog(element);
    });

    // Define files in CLI filesystem. 
    let directoriesAndFiles = {
        "/": "SYSTEM\nHOME",
        SYSTEM: "..\nmenu\ncli",
        HOME: "..\nresume\nprofile"
    };

    // CURRENTDIRECTORY MOVED TO INDEX.JS
    $('#mark').text("$ [" + currentDirectory + "]");
    
    $('.commandline').keypress(function (event) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            let command = $('.commandline').val().trim();
            let args = "";
            console.log('New command entered.');
            if (command.indexOf(' ') != -1) {
                args = command.substr(command.indexOf(' ') + 1);
                command = command.substr(0, command.indexOf(' '));
            }
            console.log("command: " + command);
            console.log("args: " + args);
            commandHandler(command, args, directoriesAndFiles);
            $('.commandline').val("");
        }
        
    });
}

$(".log").bind("DOMSubtreeModified", function () {
    // Scroll to bottom whenever log is updated.
    window.scrollTo(0, document.body.scrollHeight);
});

document.getElementsByClassName("commandline")[0].select();
$('#cli-container').click(function() {
    document.getElementsByClassName("commandline")[0].select();
});

// Log load completion.
console.log("CLI loading completed.");
hideLoading();