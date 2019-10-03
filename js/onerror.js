/*  message: error message (string). Available as event (sic!) in HTML onerror="" handler.
    source: URL of the script where the error was raised (string)
    lineno: Line number where error was raised (number)
    colno: Column number for the line where the error occurred (number)
    error: Error Object (object) 
*/
function showCustomError(message, source, lineno, colno, error) {
    console.log('Error: ', error);
    try {
        document.getElementById("content-error-icon").style.display = "block";
    }
    catch (err) {
        document.write("The site has encountered an issue and entered into an unknown state.<br>" + 
            "Error: Unable to set error icon display to block.<br>" + "Error: <br>" + message + "<br>" + source + "<br>" + lineno + "<br>" + colno + "<br>" + error.toString() + "<br>" +
            "<br><b>Please report this issue with the abovementioned error message here: \n<a href='https://github.com/EnumC/EnumC.com/issues'>https://github.com/EnumC/EnumC.com/issues</a><b>");
    }
}
window.onerror = function (message, source, lineno, colno, error) {
    showCustomError(message, source, lineno, colno, error);
};