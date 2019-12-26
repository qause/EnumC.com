var appIcon = '<img src="https://cdn0.iconfinder.com/data/icons/material-circle-apps/512/icon-android-material-design-512.png" style="border-radius: 1px;border: 10px solid #73AD21; padding: 5px; width: 150px; height: 150px; "></img >';
// Define files in CLI filesystem. 
var validAppDirectories = {
    "/": "SYSTEM\nHOME",
    SYSTEM: "..\nmenu\ncli",
    HOME: "..\nresume\nprofile",
    
};
$('.apps').height();
$('.apps').width();

(function addIcons(i) {
    setTimeout(function () {
        $('.apps').append(appIcon);              
        if (--i) {
            addIcons(i);  
        }
    }, 2500)
})(30);
