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
    $("#cli-container").html("<p class='cli-text'>CLI runtime error: " + err + ".</p>");
}

function addLog(content) {
    $('.log').append(content);
}

function typeText(content, delayTime, isInProg, inProgObj) {

    if (isInProg != true) {
        var typingElement = $('<pre class="cli-text" style="overflow: visible; line-height: 0.5em;"></pre>');
        $('.log').append(typingElement);
        // console.log(typingElement);
    }
    else {
        var typingElement = inProgObj;
    }
    if (content.length === 0) {
        return;
    }
    
    setTimeout(function () {
        // console.debug("Now typing: " + content.charAt(0));

        typingElement.html(typingElement.html() + content.charAt(0));
        content = content.substr(1);
        typeText(content, delayTime, true, typingElement);
        
    }, delayTime);
}

function initCLI() {
    let validDirectories = ['SYSTEM', '/', '~/', '~/HOME'];

    //CURRENTDIRECTORY MOVED TO INDEX.JS
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
            addLog("$ [" + currentDirectory + "] " + command + " " + args + "<br>");

            switch (command) {
                case "help":
                    addLog('<div class="cli-text">available commands: </div><br><div class="cli-text">cd, ls, open, echo, fetch, time, man, clear, exit</div>');
                    break;
                case "cd":
                    console.log("valid dir: " + args.trim());
                    if(validDirectories.indexOf(args.trim().toUpperCase()) != -1) {
                        currentDirectory = args.toUpperCase();
                    }
                    else {
                        addLog("<div class='cli-text'>cd: " + args + ": No such file or directory" + ".</div>");
                    }
                    $('#mark').text("$ [" + currentDirectory + "]");
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
                    
                    // addLog("");
                    break;

                case "time":
                    addLog(Date());
                    break;
                case "echo":
                    addLog("<div class='cli-text'>" + args + "</div>");
                    break;
                case "ls":
                    addLog("<div class='blinking cli-text'>Access Denied.</div>");
                    addLog("<img src='https://httpstatusdogs.com/img/401.jpg' style='height:20em' class='blinking'></img> <p style='font-size: 6px;'>Image supplied by https://httpstatusdogs.com/ <3</p>");
                    break;
                case "fetch":
                    $.getJSON('https://dog.ceo/api/breeds/image/random', function (data) {
                        console.info(data.message);
                        addLog("<img src='" + data.message + "' style='height:20em' class=''></img> <p style='font-size: 6px;'>Image supplied by https://dog.ceo/dog-api/ <3</p>");
                    });
                    break;
                case "open":
                    loadPath(args, function() {});
                    break;
                case "man":
                    switch(args) {
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
                    // addLog("not implemented");
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
                    break;
                case "exit":
                    loadPath("menu", function() {});
                    break;
                default:
                    addLog("<div class='cli-text'>cd: " + command + ": command not found" + ".</div>");
            }
            addLog('<br><br>');

            $('.commandline').val("");
        }
    });
}

$(".log").bind("DOMSubtreeModified", function () {
    // Scroll to bottom whenever log is updated.
    window.scrollTo(0, document.body.scrollHeight);
});

document.getElementsByClassName("commandline")[0].select();
console.log("CLI loading completed.");