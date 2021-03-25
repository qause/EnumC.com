/*
    Copyright (C) 2020 Eric Qian. 
    <https://ericqian.me/>
    All rights reserved. 
*/

console.log("CLI loading stated.");
window.scrollTo(0, 0);
// Define files in CLI filesystem. 
let directoriesAndFiles = {
    "/": "SYSTEM\nHOME\nTEST",
    SYSTEM: "..\nmenu\ncli",
    HOME: "..\nresume\nprofile",
    TEST: "..\ndirTest\nfileTest",
    DIRTEST: "..\nnestedDir",
    NESTEDDIR: "..\nNESTED2",
    NESTED2: "..\nfileTest"
};

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
function addLog(content, cliElm) {
    if (!cliElm) {
        console.warn("addLog() missing cliElm. Adding to top CLI.");
        cliElm = $("#windows").children().first();
        $("#windows").children().each(function () {
            if (((parseInt($(this).css('z-index')) || 0) > (cliElm.css('z-index')) || 0)) {
                cliElm = $(this);
            }
        });
    }
    let waitUntilExist = setInterval(function () {
        if ($(cliElm).find('.log').length) {
            let logElm = $(cliElm).find('.log');
            $(logElm).append(content);
            logContent.push(content);
            window.scrollTo(0, document.body.scrollHeight);
            $(".simplebar-content-wrapper").scrollTop(Number.MAX_SAFE_INTEGER);
            clearInterval(waitUntilExist);
        }
    }, 10)
    
}

/* Add HTML content to container. */
function addContainerLog(content, cliElm) {
    if (!cliElm) {
        console.warn("addContainerLog() missing cliElm. Adding to top CLI.");
        cliElm = $("#windows").children().first();
        $("#windows").children().each(function () {
            if (((parseInt($(this).css('z-index')) || 0) > (cliElm.css('z-index')) || 0)) {
                cliElm = $(this);
            }
        });
    }
    let waitUntilExist = setInterval(function () {
        if ($(cliElm).find('.container').length) {
            let logElm = $(cliElm).find('.container');
            $(logElm).append(content);
            logContent.push(content);
            window.scrollTo(0, document.body.scrollHeight);
            $(".simplebar-content-wrapper").scrollTop(Number.MAX_SAFE_INTEGER);
            clearInterval(waitUntilExist);
        }
    }, 10)
    
}

/* Recursive method to type text to log with delay between each character.
   content:     HTML content
   delayTime:   Delay between character in ms
*/
function typeText(content, elm, delayTime, isInProg, inProgObj) {

    if (isInProg != true) {
        var typingElement = $('<pre class="cli-text" style="overflow: visible; line-height: 0.5em;"></pre>');
        var typingElementComplete = $('<pre class="cli-text" style="overflow: visible; line-height: 0.5em;"></pre>').html(content);
        logContent.push(typingElementComplete);
        $(elm).find('.log').append(typingElement);
        
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
        $(".simplebar-content-wrapper").scrollTop(Number.MAX_SAFE_INTEGER);
        typeText(content, elm, delayTime, true, typingElement);
        
    }, delayTime);
}

function setCookie(cookieName, cookieValue, expiryInDays) {
    var expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (expiryInDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + expiryDate.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function onMD5In(inputFile) {
    addLog("<div class='cli-text'id='md5PendingProgressText'>Parsing. Please wait.</div><progress id='md5PendingProgressBar'></progress>");
    console.log(inputFile);
    var progBar = document.getElementById("md5PendingProgressBar");

    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = inputFile.files[0],
        chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

        progBar.max = chunks;

    fileReader.onload = function (e) {
        progBar.value = currentChunk;
        console.log('read chunk nr', currentChunk + 1, 'of', chunks);
        spark.append(e.target.result);                   // Append array buffer
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        } else {
            console.log('finished loading');
            // console.info('computed hash', spark.end());  // Compute hash
            $('#md5PendingProgressText').remove();
            $("#md5PendingProgressBar").remove();
            addLog("<div class='cli-text'>" + inputFile.files[0].name + " -> " + 
                    "MD5 -> " + spark.end().toUpperCase() + "</div>");
            $("#md5Input").remove();
        }
    };

    fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();

    
}

function commandHandler(command, args, directoriesAndFiles, cliElm) {
    try {
        addLog("$ [" + currentDirectory + "] " + command + " " + args + "<br>", cliElm);
            commandHistory.push([command, args]);
            historyIndex += 1;
            switch (command) {
                case "help":
                    addLog('<div class="cli-text">available commands: </div><br><div class="cli-text">cd, ls, open, echo, fetch, time, man, ping, pwd, login, su, whoami, md5, clear, exit</div>', cliElm);
                    break;
                case "cd": {

                
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
                            addLog("<div class='cli-text'>cd: " + "No path specified. Type 'man cd' to display example syntax." + ".</div>", cliElm);
                        }
                        else if (!fileFound) {
                            addLog("<div class='cli-text'>cd: " + args + ": No such file or directory" + ".</div>", cliElm);
                        }
                        else {
                            addLog("<div class='cli-text'>cd: " + args + ": is a file" + ".</div>", cliElm);
                        }
                    }
                    $('#mark').text("$ [" + currentDirectory + "]");
                    console.log("currentDirectory changed to: " + currentDirectory);
                    // switch (currentDirectory) {
                    //     case "/":
                    //         $('#path').text('C:\\ERICQIAN.ME\\');
                    //         break;
                    //     case "~/":
                    //         $('#path').text('C:\\ERICQIAN.ME\\SYSTEM\\');
                    //         break;
                    //     default:
                    //         $('#path').text('C:\\ERICQIAN.ME\\' + currentDirectory + '\\');
                    // }
                    break;
                }
                case "time":
                    addLog(Date(), cliElm);
                    break;
                case "echo":
                    addLog("<div class='cli-text'>" + args + "</div>", cliElm);
                    break;
                case "ls":
                    // addLog("<div class='blinking cli-text'>Access Denied.</div>");
                    // addLog("<img src='https://httpstatusdogs.com/img/401.jpg' style='height:20em' class='blinking'></img> <p style='font-size: 6px;'>Image supplied by https://httpstatusdogs.com/ <3</p>");
                    addLog("<p class='cli-text' style='white-space: pre-line;'>" + directoriesAndFiles[currentDirectory] + "</p>", cliElm);
                    // addLog("<p class='cli-text' style='white-space: pre-line;'>resume\nprofile\nmenu\ncli</p>");
                    break;
                case "fetch":
                    $.getJSON('https://dog.ceo/api/breeds/image/random', function (data) {
                        console.info(data.message);
                        addLog("<img src='" + data.message + "' style='height:20em' class=''></img> <p style='font-size: 6px;'>Image supplied by https://dog.ceo/dog-api/ <3</p>", cliElm);
                    });
                    break;
                case "open": {
                    let files = directoriesAndFiles[currentDirectory].split("\n");
                    let fileFound = false;
                    files.forEach(element => {
                        if (element == args) {
                            fileFound = true;
                        }
                    });

                    if (args.trim() == "") {
                        addLog("<div class='cli-text'>open: " + "No file specified. Type 'man open' to display example syntax." + ".</div>", cliElm);
                    }
                    else if (!fileFound || args.trim().toUpperCase() in directoriesAndFiles) {
                        addLog("<div class='cli-text'>open: " + args + ": No such file. To open a directory, use cd. " + ".</div>", cliElm);
                    }
                    else {
                        loadPath(args, function () { });
                    }
                    break;
                }
                case "md5": {
                    // $.getScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/core.js", function (data, textStatus, jqxhr) {
                    //     $.getScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/md5.js", function (data, textStatus, jqxhr) {
                    //         addLog("<form><input type='file' id='md5Input' onchange='onMD5In(document.getElementById(`md5Input`));'></form>");
                    //     });
                    // });

                    $.getScript(
						"https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0/spark-md5.min.js",
						function (data, textStatus, jqxhr) {
							addLog(
								"<form><input type='file' id='md5Input' onchange='onMD5In(document.getElementById(`md5Input`));'></form>"
                                , cliElm);
						}
					);                  
                    
                    break;
                }
                case "signup":
                    if (args.trim() == "gravity") {
                        
                        if (typeof commandData == "undefined" || commandData["email"] == undefined) {
                            commandData = { "email": undefined, "firstName": undefined, "lastName": undefined };
                        } 
                        console.log(commandData);
                        if(commandData["email"] == undefined) {
                            addLog("<div class='cli-text'>What is your email?</div>", cliElm);
                            addLog("<input id='emailIn' onblur='this.focus()' autofocus style='color:black'></input>", cliElm)
                            $('#emailIn').keypress(function (event) {
                                if ((event.keyCode ? event.keyCode : event.which) == '13') {
                                    
                                    document.getElementById("emailIn").disabled = true;
                                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('#emailIn').val().trim())) {
                                        commandData["email"] = $('#emailIn').val().trim();
                                    }
                                    else {
                                        addLog("<div class='cli-text'>invalid email address. Please try again.</div>", cliElm);
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
                            addLog("<div class='cli-text'>What is your first name?</div>", cliElm);
                            addLog("<input id='fNameIn' onblur='this.focus()' autofocus style='color:black'></input>", cliElm)
                            $('#fNameIn').keypress(function (event) {
                                if ((event.keyCode ? event.keyCode : event.which) == '13') {
                                    document.getElementById("fNameIn").disabled = true;
                                    if ($('#fNameIn').val().trim().length > 0){
                                        commandData["firstName"] = $('#fNameIn').val().trim();
                                    }
                                    else {
                                        addLog("<div class='cli-text'>First name cannot be blank. Please try again.</div>", cliElm);
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
                            addLog("<div class='cli-text'>What is your last name?</div>", cliElm);
                            addLog("<input id='lNameIn' onblur='this.focus()' autofocus style='color:black'></input>", cliElm)
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
                            addLog("<div class='cli-text'>Submitting information...</div>", cliElm);
                            addLog("<progress id='infoPendingProgressBar'></progress>", cliElm);
                            $.getJSON('https://gravity.enumc.com/newSubscriber.php?email=' + commandData["email"] + '&fname=' + commandData["firstName"] + '&lname=' + commandData["lastName"], function (data) {
                                let items = {};
                                $.each(data, function (key, val) {
                                    items[key] = val;
                                });

                                if (items["success"] == true) {
                                    if (items["message"] == "pending") {
                                        addLog("<div class='cli-text'>One last step!</div>", cliElm);
                                        addLog("<div class='cli-text'>Email confirmation is required.</div>", cliElm);
                                        addLog("<div class='cli-text'>You will receive a confirmation email within a couple minutes.</div>", cliElm);
                                    }
                                    else {
                                        addLog("<div class='cli-text'>You have been successfully added to the mailing list!</div>");
                                    }
                                    
                                }
                                else {
                                    addLog("<div class='cli-text' style='word-break: break-all; width: 25em;'>An error occured. Reason: " + items["message"] + "</div>", cliElm);
                                    addLog("<div class='cli-text' style='word-break: break-all; width: 25em;'>You may retry by either typing 'signup gravity' or by refreshing the page.</div", cliElm);
                                    commandData = undefined;
                                }
                                $(cliElm).find('#infoPendingProgressBar').remove();
                                console.log(items);

                            }).fail(function(e) {
                                $(cliElm).find('#infoPendingProgressBar').remove();
                                console.log(e);
                                addLog("<div class='cli-text'>Error: AJAX request failed. Please check your internet connection and try again in a few minutes. If it still doesn't work,</div>", cliElm);
                                addLog("<p class='cli-text'>please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>", cliElm);
                            });
                        }

                    }
                    break;
                case "startx":
                    addLog("<div class='cli-text'>Display loading...</div>", cliElm);
                    loadPath('gui');
                    break;
                case "pwd":
                    addLog("<div class='cli-text'>" + currentDirectory + "</div>", cliElm);
                    break;
                case "ping": {
                    addLog("<div class='cli-text'>Checking Ping...</div>", cliElm);
                    addLog("<progress id='infoPendingProgressBar'></progress>", cliElm);
                    let path = "https://node1.enumc.com:443/latency.php";

                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            addLog("<div class='cli-text'>latency to server:</div>", cliElm);

                            if (xhr.status === 200) {
                                // success(JSON.parse(xhr.responseText));
                                addLog("<div class='cli-text'>" + String(window.performance.now() - start) + "ms</div>", cliElm);
                            } else {
                                addLog("<div class='cli-text'>ERROR. Request failed.</div>", cliElm);
                                // error(xhr);                    
                            }
                        }
                        $(cliElm).find('#infoPendingProgressBar').remove();
                    };
                    xhr.open('GET', path, true);
                    let start = window.performance.now();
                    xhr.send();
                    break;
                }
                case "history": {
                    for (historyIndex = 0; historyIndex < commandHistory.length; historyIndex++) {
                        addLog(historyIndex + "&nbsp;&nbsp;&nbsp;&nbsp;" + commandHistory[historyIndex][0] + " " + commandHistory[historyIndex][1] + "<br>", cliElm);
                    }
                    break;
                }
                    
                case "man":
                    switch (args) {
                        case "":
                            addLog("<div class='cli-text'>No argument defined. Enter 'man command_name_here' for usage. </div>", cliElm);
                            break;
                        case "help":
                            addLog("<div class='cli-text'>Display help page</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: help</div>", cliElm);
                            break;
                        case "cd":
                            addLog("<div class='cli-text'>Set directory</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: cd [directoryname]</div>", cliElm);
                            break;
                        case "time":
                            addLog("<div class='cli-text'>Display current time</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: time</div>");
                            break;
                        case "echo":
                            addLog("<div class='cli-text'>Echo arg</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: echo [arg]</div>", cliElm);
                            break;
                        case "ls":
                            addLog("<div class='cli-text'>List files in current directory</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: ls</div>", cliElm);
                            break;
                        case "history":
                            addLog("<div class='cli-text'>List history of commands</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: history</div>", cliElm);
                            break;
                        case "fetch":
                            addLog("<div class='cli-text'>:3</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: fetch</div>", cliElm);
                            break;
                        case "open":
                            addLog("<div class='cli-text'>Open file</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: open [filename]</div>", cliElm);
                            break;
                        case "man":
                            addLog("<div class='cli-text'>Get command usage</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: man [commandname]</div>", cliElm);
                            break;
                        case "login":
                            addLog("<div class='cli-text'>Authenticate server-side</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: login [credentials]</div>", cliElm);
                            break;
                        case "ping":
                            addLog("<div class='cli-text'>Check dynamic server response time</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: ping</div>", cliElm);
                            break;
                        case "pwd":
                            addLog("<div class='cli-text'>Get current path</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: pwd</div>", cliElm);
                            break;
                        case "su":
                            addLog("<div class='cli-text'>Authenticate server-side with privilege</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: su [credentials]</div>", cliElm);
                            break;
                        case "whoami":
                            addLog("<div class='cli-text'>Get logged in user info</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: whoami</div>", cliElm);
                            break;
                        case "md5":
                            addLog("<div class='cli-text'>Get md5 hash of input file</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: md5</div>", cliElm);
                            break;
                        case "command_name_here":
                            addLog("<div class='cli-text'>What did your parent teach you about blindly copy pasting commands?!</div>", cliElm);
                            addLog("<div class='cli-text'>To request the manual for a command, use an actual command name.</div>", cliElm);
                            break;
                        case "clear":
                            addLog("<div class='cli-text'>Clear terminal</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: clear</div>", cliElm);
                            break;
                        case "exit":
                            addLog("<div class='cli-text'>Exit terminal</div>", cliElm);
                            addLog("<div class='cli-text'>Usage: exit</div>", cliElm);
                            break;
                        default:
                            addLog("<div class='cli-text'>man page for " + args + " does not exist.</div>", cliElm)
                            break;
                    }
                    break;

                // Server-side requests
                case "login":
                    // addLog("not implemented");
                    addLog("<div class='cli-text'>enumc.com login: </div>", cliElm);
                    addLog("<input id='loginInfo' onblur='this.focus()' autofocus style='color:black'></input>", cliElm);
                    window.setTimeout(function () { 
                        $(cliElm).find('#loginInfo').keypress(function (event) {
                            if ((event.keyCode ? event.keyCode : event.which) == '13') {
                                this.disabled = true;
                                if ($(this).val().trim().length > 0) {
                                    // commandData["firstName"] = $(cliElm).find('#loginInfo').val().trim();
                                    var username = $(this).val().trim();
                                    addLog("<div class='cli-text'>Submitting information...</div>", cliElm);
                                    addLog("<progress id='infoPendingProgressBar'></progress>", cliElm);

                                    if (devMode) {
                                        console.warn("su on test portal");
                                        var loginPortal = "https://dyno.enumc.com/getLogin.php?login=";
                                    }
                                    else {
                                        var loginPortal = "https://node1.enumc.com/getLogin.php?login=";
                                    }

                                    $.getJSON(loginPortal + username + '&action=login', function (data) {
                                        let items = {};
                                        $.each(data, function (key, val) {
                                            items[key] = val;
                                        });
                                        if (items["message"] != "invalid" && items["message"] != "undefined" && items["message"] != "unknown") {
                                            addLog("<div class='cli-text'>" + items["message"] + "</div>", cliElm);
                                        }
                                        else if (items["message"] == "unknown") {
                                            addLog("<div class='cli-text'>User Not Found.</div>", cliElm);
                                        }
                                        else {
                                            addLog("<div class='cli-text'>Invalid user" + "</div>", cliElm);
                                        }

                                        $(cliElm).find('#infoPendingProgressBar').remove();
                                        console.log(items);

                                    }).fail(function (e) {
                                        $(cliElm).find('#infoPendingProgressBar').remove();
                                        console.log(e);
                                        addLog("<div class='cli-text'>Error: AJAX request failed. Please check your internet connection and try again in a few minutes. If it still doesn't work,</div>", cliElm);
                                        addLog("<p class='cli-text'>please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>", cliElm);
                                    });
                                }
                                else {
                                    addLog("<div class='cli-text'>Invalid credentials.</div>", cliElm);
                                    $(this).remove();
                                }
                                $(this).unbind("keypress");
                                $(this).prop('id', '');
                                console.log(username);
                                $(cliElm).find(".commandline")[0].select();
                                // commandHandler("signup", "gravity");
                            }

                        });
                        $(cliElm).find("#loginInfo").select();
                    }, 0);  // chrome workaround - wait until DOM update.
                    break;
                case "su":
                    // addLog("not implemented");
                    addLog("<div class='cli-text'>enumc.com login: </div>", cliElm);
                    addLog("<input id='loginInfo' onblur='this.focus()' autofocus style='color:black'></input>", cliElm)
                    window.setTimeout(function () {
                        $(cliElm).find('#loginInfo').keypress(function (event) {
                            if ((event.keyCode ? event.keyCode : event.which) == '13') {
                                this.disabled = true;
                                if ($(this).val().trim().length > 0) {
                                    // commandData["firstName"] = $(cliElm).find('#loginInfo').val().trim();
                                    var username = $(this).val().trim();
                                    addLog("<div class='cli-text'>Submitting information...</div>", cliElm);
                                    addLog("<progress id='infoPendingProgressBar'></progress>", cliElm);

                                    if (devMode) {
                                        console.warn("su on test portal");
                                        var loginPortal = "https://dyno.enumc.com/getLogin.php?login=";
                                    }
                                    else {
                                        var loginPortal = "https://node1.enumc.com/getLogin.php?login=";
                                    }

                                    $.getJSON(loginPortal + username + '&action=su', function (data) {
                                        let items = {};
                                        $.each(data, function (key, val) {
                                            items[key] = val;
                                        });

                                        if (items["message"] != "invalid" && items["message"] != "undefined" && items["message"] != "unknown") {
                                            setCookie('user', items["message"], 1);
                                            addLog("<div class='cli-text'>Logged in as: " + username + "</div>", cliElm);
                                        }
                                        else {
                                            addLog("<div class='cli-text'>Invalid user" + "</div>", cliElm);
                                        }

                                        $(cliElm).find('#infoPendingProgressBar').remove();
                                        console.log(items);
                                        

                                    }).fail(function (e) {
                                        $(cliElm).find('#infoPendingProgressBar').remove();
                                        console.log(e);
                                        addLog("<div class='cli-text'>Error: AJAX request failed. Please check your internet connection and try again in a few minutes. If it still doesn't work,</div>", cliElm);
                                        addLog("<p class='cli-text'>please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>", cliElm);
                                    });
                                }
                                else {
                                    addLog("<div class='cli-text'>Invalid credentials.</div>", cliElm);
                                    $(this).remove();
                                }
                                $(this).unbind("keypress");
                                $(this).prop('id', '');
                                console.log(username);
                                // commandHandler("signup", "gravity");
                                document.getElementsByClassName("commandline")[0].select();
                            }

                        });
                    }, 0);
                    $(cliElm).find('#loginInfo').select();
                    break;
                case "whoami": {
                    // addLog("not implemented");
                    // addLog("<div class='cli-text'>enumc.com login: </div>");
                    // addLog("<input id='loginInfo' onblur='this.focus()' autofocus style='color:black'></input>")

                    if (devMode) {
                        console.warn("su on test portal");
                        var loginPortal = "https://dyno.enumc.com/getLogin.php?login=";
                    }
                    else {
                        var loginPortal = "https://node1.enumc.com/getLogin.php?login=";
                    }
                    var user = getCookie('user');
                    if (user == "") {
                        user = "undefined";
                        addLog("<div class='cli-text'>Not logged in" + "</div>", cliElm);
                        break;
                    }
                    $.getJSON(loginPortal + user + '&action=whoami', function (data) {
                        let items = {};
                        $.each(data, function (key, val) {
                            items[key] = val;
                        });

                        if (items["message"] != "invalid" && items["message"] != "undefined") {
                            addLog("<div class='cli-text'>Current user: " + items["message"] + "</div>", cliElm);
                        }
                        else {
                            addLog("<div class='cli-text'>Invalid user" + "</div>", cliElm);
                        }

                        $(cliElm).find('#infoPendingProgressBar').remove();
                        console.log(items);

                    }).fail(function (e) {
                        $(cliElm).find('#infoPendingProgressBar').remove();
                        console.log(e);
                        addLog("<div class='cli-text'>Error: AJAX request failed. Please check your internet connection and try again in a few minutes. If it still doesn't work,</div>", cliElm);
                        addLog("<p class='cli-text'>please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>", cliElm);
                    });

                    break;
                }
                    
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
                    // loadPath("menu", function () { });
                    destroyWindow(cliElm);
                    break;
                default:
                    addLog("<div class='cli-text'>eCLI: " + command + ": command not found" + ".</div>", cliElm);
            }
        addLog('<br><br>', cliElm);
        $(cliElm).find("commandline").select();
    }
    catch (err) {
        let errCommand = $(cliElm).find('.commandline').val().trim();
        $(cliElm).find("#cli-container").html("<p class='cli-text'>CLI command error: " + err + ".</p>" +
            "<br><p class='cli-text'>Command: " + errCommand + ".</p>" +
            "<p class='cli-text'>Please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a></p>");
        throw new Error("CLI command error: " + err);
    };
}

/* Initializes CLI and set up command, filesystem, and data. */
function initCLI(cliElm) {
    if (typeof lastAuthored != "string") {
        updateCommitDetails(function () {
            $("#lastModElement").html($("#lastModElement").html() + lastAuthored);
        });
    }
    else {
        $("#lastModElement").html($("#lastModElement").html() + lastAuthored);
    }

    logContent.forEach(element => {
        addLog(element, cliElm);
    });

    

    // CURRENTDIRECTORY MOVED TO INDEX.JS
    $('#mark').text("$ [" + currentDirectory + "]");
    
    commandHistory = [];
    historyIndex = 0;
    
    
    

    $(document).bind("copy", function(e) {
        e.preventDefault();
        addLog("$ [" + currentDirectory + "] " + "<br>", cliElm);
        document.getElementsByClassName('commandline')[0].val = "";
        // document.getElementsByClassName('commandline')[0].focus();
    });

    document.addEventListener("click", function(){
        // if (document.getElementsByClassName('commandline')[0]) {
        //     document.getElementsByClassName('commandline')[0].focus();
        // }
        
    });
    
    document.onkeydown = function(e) {
        switch(e.which) {
            case 38:
            // Up arrow
            // $('.commandline');
            historyIndex -= 1;
            if (historyIndex < 0) {
                historyIndex = 0;
            }
            commandLineElem = document.getElementsByClassName('commandline')[0];
            commandPrev = commandHistory[historyIndex][0] + " " + commandHistory[historyIndex][1];
            commandLineElem.focus();
            commandLineElem.value = commandPrev;
            setTimeout(function(){ commandLineElem.selectionStart = commandLineElem.selectionEnd = 10000; }, 0);
            console.log(commandPrev);
            break;

            case 40:
                // Down arrow
                historyIndex += 1;
                if (historyIndex >= commandHistory.length) {
                    historyIndex = commandHistory.length - 1;
                }
                commandLineElem = document.getElementsByClassName('commandline')[0];
                commandNext = commandHistory[historyIndex][0] + " " + commandHistory[historyIndex][1];
                commandLineElem.focus();
                commandLineElem.value = commandNext;
                setTimeout(function(){ commandLineElem.selectionStart = commandLineElem.selectionEnd = 10000; }, 0);
                console.log(commandNext);
                break;
        }
    }
}

function keyPressHandler(event, elm) {
    let keycode = (event.keyCode ? event.keyCode : event.which);
    // console.log("keycode: " + keycode);
    if (keycode == '13') {
        let command = $(elm).val().trim();
        let args = "";
        console.log('New command entered.');
        if (command.indexOf(' ') != -1) {
            args = command.substr(command.indexOf(' ') + 1);
            command = command.substr(0, command.indexOf(' '));
        }
        console.log("command: " + command);
        console.log("args: " + args);
        commandHandler(command, args, directoriesAndFiles, elm.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
        $(elm).val("");
    }

}
// function centerCLI() {
//     $("#wrapper").css("left", "");
// }

$(".log").bind("DOMSubtreeModified", function () {
    // Scroll to bottom whenever log is updated.
    window.scrollTo(0, document.body.scrollHeight);
});
// if (document.getElementsByClassName("commandline")[0]) {
//     document.getElementsByClassName("commandline")[0].select();
// }

// $('#cli-container').click(function() {
//     document.getElementsByClassName("commandline")[0].select();
// });

// Log load completion.
console.log("CLI loading completed.");
hideLoading();