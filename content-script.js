let recorder;
let audio;
let stream;
var display_iframe = document.createElement('iframe');

chrome.runtime.onMessage.addListener(function (msg, sender) {

    if (msg == "minimize") {
        minimize();
    }

    if (msg == "maximize") {
        maximize();
    }

    if (msg == "poweroff") {
        poweroff();
    }

    if (msg == "poweron") {
        poweron();
    }

    if (msg == "save") {
        save();
    }

    if (msg == "cancel") {
        cancel();
    }

    if (msg == "closeDisplay") {
        closeDisplay();
    }

    if (msg == "powerStatusOn") {
        document.body.appendChild(iframe);
    }
})

var iframe = document.createElement('iframe');
iframe.style.width = "64px";
iframe.style.height = "54px";
iframe.style.position = "fixed";
iframe.style.bottom = (screen.height / 2 - 32) + "px";
iframe.style.right = "0px";
iframe.style.backgroundColor = "transparent";
iframe.style.zIndex = "9000000000000000000";
iframe.setAttribute('allow', 'microphone; camera');
iframe.frameBorder = "none";
iframe.src = chrome.extension.getURL("recorder.html");

window.addEventListener('load', (event) => {
    chrome.runtime.sendMessage({ type: "getPowerStatus" });
});

function minimize() {
    iframe.style.width = "64px";
    stream.getTracks()[0].stop();
    recorder = undefined;
}

async function save() {
    iframe.style.width = "64px";
    audio = await recorder.stop();
    stream.getTracks()[0].stop();
    recorder = undefined;
    chrome.runtime.sendMessage({ type: 'uploadStarted' });
    const reader = new FileReader();
    reader.readAsDataURL(audio.audioBlob);
    reader.onload = () => {
        const base64AudioMessage = reader.result.split(',')[1];
        const audioFile = dataURLtoFile(reader.result, 'voice.mp3');
        console.log(audioFile);
        var data = new FormData();
        data.append('avatar', audioFile);
        fetch('https://bymsaudi.com/voice/voice.php', {
            method: 'POST',
            body: data
        }).then(res => {
            if (res.status === 200) {
                res.json().then(json => {
                    console.log(json)
                    display(json.url);
                });
            } else {
                console.log('Invalid status saving audio message: ' + res.status);
            }
            chrome.runtime.sendMessage({ type: 'uploadEnded' });
        });
    };
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

async function maximize() {
    iframe.style.width = "250px";
    if (!recorder) {
        recorder = await recordAudio();
    }
    recorder.start();
}

function poweroff() {
    if (iframe.style.width == "250px") {
        stream.getTracks()[0].stop();
        recorder = undefined;
    }
    document.body.removeChild(iframe);
}

function poweron() {
    document.body.appendChild(iframe);
    iframe.style.width = "64px";
}

function display(id) {
    display_iframe.style.width = "500px";
    display_iframe.style.height = "200px";
    display_iframe.style.position = "fixed";
    display_iframe.style.bottom = (screen.height / 2 - 100) + "px";
    display_iframe.style.right = (screen.width / 2 - 250) + "px";
    display_iframe.style.zIndex = "9000000000000000000";
    display_iframe.frameBorder = "none";
    display_iframe.src = chrome.extension.getURL("display.html");
    document.body.appendChild(display_iframe);
    setTimeout(function () {
        chrome.runtime.sendMessage({ type: 'recordIdtoBackend', recordId: id });
    }, 100);
}


function closeDisplay() {
    document.body.removeChild(display_iframe);
}

const recordAudio = () =>
    new Promise(async resolve => {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        const start = () => {
            audioChunks = [];
            mediaRecorder.start();
        };

        const stop = () =>
            new Promise(resolve => {
                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioChunks, audioBlob, audioUrl, play });
                });

                mediaRecorder.stop();
            });

        resolve({ start, stop });
    });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
