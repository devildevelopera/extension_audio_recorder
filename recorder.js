var interval = undefined;

document.addEventListener('DOMContentLoaded', function () {

    $('#bigDiv').hide();

    var minButton = document.getElementById('min');
    if (minButton) {
        minButton.addEventListener('click', function () {
            minimize();
        });
    }

    var cancelButton = document.getElementById('cancel');
    if (cancelButton) {
        cancelButton.addEventListener('click', function () {
            minimize();
        });
    }

    var saveButton = document.getElementById('save');
    if (saveButton) {
        saveButton.addEventListener('click', function () {
            $('#bigDiv').hide();
            $('#plusdiv').show();
            clearTimer();
            chrome.runtime.sendMessage({ type: 'saveRecord' });
        });
    }

    var plusButton = document.getElementById('plusdiv');
    if (plusButton) {
        plusButton.addEventListener('click', function () {
            $('#bigDiv').show();
            $('#plusdiv').hide();
            chrome.runtime.sendMessage({ type: 'maximizeExtension' });
            startTimer();
        });
    }

    var okButton = document.getElementById('ok');
    if (okButton) {
        okButton.addEventListener('click', function () {
            chrome.runtime.sendMessage({ type: 'closeDisplay' });
        });
    }

});

function minimize() {
    $('#bigDiv').hide();
    $('#plusdiv').show();
    clearTimer();
    chrome.runtime.sendMessage({ type: 'minimizeExtension' });
}

function startTimer() {
    var seconds_left = 0;
    interval = setInterval(function () {
        ++seconds_left;
        var mins = Math.floor(seconds_left / 60);
        var secs = Math.floor(seconds_left % 60);
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        $('#timer_div').html(mins + ":" + secs);
    }, 1000);
}

function clearTimer() {
    clearInterval(interval);
    interval = undefined;
    $('#timer_div').html("00:00");
}

function receiveMessage(message, sender, callback) {

    if (message.type === 'set_minimize') {
        $('#minus').click();
    }

    if (message.type === 'set_maximize') {
        $('#plusdiv').click();
    }

    if (message.type === 'clearTimer') {
        clearTimer();
    }

    if (message.type === 'startTimer') {
        $('#bigDiv').hide();
        $('#plusdiv').show();
    }

    if (message.type === 'uploadStart') {
        $( ".small-div" ).addClass( "spinner" );
    }

    if (message.type === 'uploadEnd') {
        $( ".small-div" ).removeClass( "spinner" );
    }

    if (message.type === 'recordIdtoDisplay') {
        $('#id-text').val(message.recordId);

        var copyText = document.getElementById("id-text");
        if (copyText) {
            copyText.select();
            document.execCommand("copy");
        }

    }

}

chrome.runtime.onMessage.addListener(receiveMessage);
