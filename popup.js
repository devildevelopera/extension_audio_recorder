
document.addEventListener('DOMContentLoaded', function () {

    var powerButton = document.getElementById('power-button');
    if (powerButton) {
        powerButton.addEventListener('click', function () {
            var background = chrome.extension.getBackgroundPage();
            background.power = !background.power;
            if(background.power){
                chrome.runtime.sendMessage({ type: 'poweronExtension' });
            } else {
                chrome.runtime.sendMessage({ type: 'poweroffExtension' });
            }
            updateLabel();
        });
    }

    updateLabel();

});

function updateLabel() {
    var power = chrome.extension.getBackgroundPage().power;

    var powerButton = document.getElementById('power-button');
    if (powerButton) {
        powerButton.innerHTML = power ? "Turn Off" : "Turn On";
    }
}