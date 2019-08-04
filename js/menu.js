var fadeInComplete = false;
var videoReady = false;
function processWaitMsg(element) {

    $(element).delay(200).animate(
        { opacity: 'toggle' },
        1000,
        function () {
            if (!fadeInComplete || !videoReady) {
                console.log("fade in out active");
                processWaitMsg(element);
            }
            else {
                $("#waitmsg").text("Loading complete.");
                // processWaitMsg(element);
                delete fadeInComplete;
                delete videoReady;
                $(element).fadeIn();
            }

        }
    );
}

function onMenuViewportChange() {
    scene.offset(window.innerHeight);
}

$.getJSON('https://api.github.com/repos/EnumC/EnumC.com/git/refs/heads/master', function (data) {
    console.info(data);
    console.info("link: ", data.object.url);
    $.getJSON(data.object.url, function (commit) {
        console.info("commit: ", JSON.stringify(commit, null, 2));
        $("#commitData").text(JSON.stringify(commit, null, 2));
    });
});

/**
 * Frame-by-frame video animation with ScrollMagic and GSAP
 * 
 * Note that your web server must support byte ranges (most do).
 * Otherwise currentTime will always be 0 in Chrome.
 * See here: http://stackoverflow.com/a/5421205/950704
 * and here: https://bugs.chromium.org/p/chromium/issues/detail?id=121765
 */

var video = document.getElementById('video');
var long = document.getElementById('long');
var title = document.getElementById('title-section');
var scrollpos = 0;
var lastpos;

console.log("init");
// var controller = new ScrollMagic.Controller({ container: "#video-container"});
var controller = new ScrollMagic.Controller({});
var scene = new ScrollMagic.Scene({
    triggerElement: long,
    triggerHook: "onEnter"
});
var startScrollAnimation = () => {
    scene
        .addTo(controller)
        .duration(long.clientHeight - title.clientHeight - window.innerHeight * 2)
        //.offset(window.innerHeight)
        .offset(window.innerHeight)
        .on("progress", (e) => {
            scrollpos = e.progress;
        })
        .on("leave", (e) => {
            $('#video').fadeOut();
        })
        .on("enter", (e) => {
            $('#video').fadeIn();
        });

    scene.addIndicators({ name: "main animate", colorEnd: "#CCCC00" });

    setInterval(() => {
        if (lastpos === scrollpos) return;
        requestAnimationFrame(() => {
            video.currentTime = video.duration * scrollpos;
            video.pause();
            lastpos = scrollpos;
            console.log(video.currentTime, scrollpos);
        });
    }, 50);
};

var preloadVideo = (v, callback) => {
    var ready = () => {
        v.removeEventListener('canplaythrough', ready);

        video.pause();
        var i = setInterval(function () {
            if (v.readyState > 3) {
                clearInterval(i);
                video.currentTime = 0;
                callback();
            }
        }, 50);
    };
    v.addEventListener('canplaythrough', ready, false);
    try {
        v.play();
    }
    catch (e) {
        console.warn("Error occured when calling v.play(). Stacktrace: ");
        console.warn(e);
    }
};

// startScrollAnimation();


