var minimize_flag = true;
var maximize_flag = false;
var power = false;

function receiveMessage(message, sender, callback) {

    if (message.type === 'minimizeExtension') {
        minimize_flag = true;
        maximize_flag = false;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'minimize');
        });
    }

    if (message.type === 'maximizeExtension') {
        minimize_flag = false;
        maximize_flag = true;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'maximize');
        });
    }

    if (message.type === 'poweroffExtension') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'poweroff');
        });
        chrome.runtime.sendMessage({ type: 'clearTimer' });
    }

    if (message.type === 'poweronExtension') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'poweron');
        });
        chrome.runtime.sendMessage({ type: 'startTimer' });
    }

    if (message.type === 'getPowerStatus') {
        if (power) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "powerStatusOn");
            });
        }
    }

    if (message.type === 'saveRecord') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'save');
        });
    }

    if (message.type === 'recordIdtoBackend') {
        chrome.runtime.sendMessage({ type: 'recordIdtoDisplay', recordId: message.recordId });
    }

    if (message.type === 'closeDisplay') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'closeDisplay');
        });
    }

    if (message.type === 'uploadStarted') {
        chrome.runtime.sendMessage({ type: 'uploadStart'});
    }

    if (message.type === 'uploadEnded') {
        chrome.runtime.sendMessage({ type: 'uploadEnd'});
    }

}

chrome.runtime.onMessage.addListener(receiveMessage);
