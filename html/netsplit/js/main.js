let inputCodeVal;
$('#submitVerification').click(function() {
    inputCodeVal = $('#inputCode1')[0].value;
    console.log(inputCodeVal);
    processInput(inputCodeVal);
});

$('#checkout').hide();
function processInput(code) {
    console.debug(a('netflixitis', '2019'));
    if (code == a('netflixitis', '2019')) {
        $('#verify').hide(0);
        $('#error-notice').hide(0);
        $('#checkout').show(1000);
        $('#checkout').get(0).scrollIntoView();
        
    }
    else {
        $('#error-notice').show(250);
    }

}

function a(e, r) {
    return Array.from(
        e,
        (c, i) => String.fromCharCode(c.charCodeAt() ^ r.charCodeAt(i % r.length))
    ).join('');
}