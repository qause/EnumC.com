/*
    Copyright (C) 2019 Eric Qian.
    <https://enumc.com/>
    All rights reserved. 
*/

console.log("CLI loading stated.");
window.scrollTo(0, 0);

try {
    initCLI();
}
catch (err) {
    $("#cli-container").html("<p class='cli-text'>CLI initialization error: " + err + ".</p>" +
        "<p class='cli-text'>Please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>");
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
        try {
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
                            else if(!fileFound) {
                                addLog("<div class='cli-text'>cd: " + args + ": No such file or directory" + ".</div>");
                            }
                            else {
                                addLog("<div class='cli-text'>cd: " + args + ": is a file" + ".</div>");
                            }
                            
                        }
                        $('#mark').text("$ [" + currentDirectory + "]");
                        console.log("currentDirectory changed to: " + currentDirectory);
                        switch(currentDirectory) {
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
                    case "man":
                        switch(args) {
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

                    case "clear":
                        $('.log').html("");
                        logContent = [];
                        break;
                    case "exit":
                        loadPath("menu", function() {});
                        break;
                    default:
                        addLog("<div class='cli-text'>eCLI: " + command + ": command not found" + ".</div>");
                }
                addLog('<br><br>');

                $('.commandline').val("");
            }
        }
        catch (err) {
            let errCommand = $('.commandline').val().trim();
            $("#cli-container").html("<p class='cli-text'>CLI command error: " + err + ".</p>" + 
                "<br><p class='cli-text'>Command: " + errCommand + ".</p>" +
                "<p class='cli-text'>Please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>");
        };
    });
}

$(".log").bind("DOMSubtreeModified", function () {
    // Scroll to bottom whenever log is updated.
    window.scrollTo(0, document.body.scrollHeight);
});

document.getElementsByClassName("commandline")[0].select();

// Log load completion.
console.log("CLI loading completed.");