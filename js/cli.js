/*
    Copyright (C) 2019 Eric Qian.
    <https://enumc.com/>
    All rights reserved. 
*/

console.log("CLI loading stated.");
parent.location.hash = "#cli";
window.scrollTo(0, 0);

try {
    initCLI();
}
catch (err) {
    $("#cli-container").html("<p class='cli-text'>CLI runtime error: " + err + ".</p>");
}

function initCLI() {
    let validDirectories = ['SYSTEM', '/', '~/', '~/HOME'];

    let currentDirectory = "SYSTEM";
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
            $('.log').append("$ [" + currentDirectory + "] " + command + " " + args + "<br>");

            switch (command) {
                case "help":
                    $('.log').append('<div class="cli-text">available commands: </div><br><div class="cli-text">cd, ls, echo, time, clear, exit</div>');
                    break;
                case "cd":
                    console.log("valid dir: " + args.trim());
                    if(validDirectories.indexOf(args.trim().toUpperCase()) != -1) {
                        currentDirectory = args.toUpperCase();
                    }
                    else {
                        $('.log').append("<div class='cli-text'>cd: " + args + ": No such file or directory" + ".</div>");
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
                    
                    // $('.log').append("");
                    break;

                case "time":
                    $('.log').append(Date());
                    break;
                case "echo":
                    $('.log').append("<div class='cli-text'>" + args + "</div>");
                    break;
                case "ls":
                    $('.log').append("<div class='blinking cli-text'>Access Denied.</div>");
                    break;
                case "clear":
                    $('.log').html("");
                    break;
                case "exit":
                    loadPath("placeholder", function() {});
                    break;
                default:
                    $('.log').append("<div class='cli-text'>cd: " + command + ": command not found" + ".</div>");
            }
            $('.log').append('<br><br>');

            $('.commandline').val("");
        }
    });
}

document.getElementsByClassName("commandline")[0].select();
console.log("CLI loading completed.");