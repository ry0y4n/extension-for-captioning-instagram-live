let wrapper = document.createElement('div');
wrapper.setAttribute('id', 'text_overlay_wrapper')
wrapper.style.position = 'absolute';
wrapper.style.top = '25px';
wrapper.style.left = '18px';
wrapper.style.width = '320px';
wrapper.style.height = '900px';
wrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
wrapper.style.padding = "10px";
wrapper.style.zIndex = 2147483647;
document.body.appendChild(wrapper);

let resutlText = document.createElement('div');
resutlText.setAttribute('id', 'result-text');
resutlText.style.fontSize = "25px";
resutlText.style.lineHeight = 2.0;
resutlText.style.position = 'absolute';
resutlText.style.bottom = '1.5rem';
wrapper.appendChild(resutlText);

let flag_speech = 0;
let recognition;
let lastFinished = '';
let textUpdateTimeoutID = 0;
let textUpdateTimeoutSecond = 3;

function clearTimeoutForClearText() {
    if (textUpdateTimeoutID !== 0) {
        clearTimeout(textUpdateTimeoutID);
        textUpdateTimeoutID = 0;
    }
}

function setTimeoutForClearText() {
    if (textUpdateTimeoutSecond <= 0) return;

    clearTimeoutForClearText();
    textUpdateTimeoutID = setTimeout(
        () => {
            document.getElementById('result-text').innerHTML = "";
            lastFinished = '';
            textUpdateTimeoutID = 0;
        }, 
        textUpdateTimeoutSecond * 1000);
}

function vr_function() {
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = function(event) {
        let results = event.results;
        let currentTranscripts = '';
        for (let i = event.resultIndex; i < results.length; i++) {
            if (results[i].isFinal)
            {
                lastFinished = results[i][0].transcript;
                lastFinished += '。';
                vr_function();
            }
            else
            {
                currentTranscripts += results[i][0].transcript;
                flag_speech = 1;
            }
        }
        document.getElementById('result-text').innerHTML = [lastFinished, currentTranscripts].join('<br>');
        setTimeoutForClearText();
    }
    flag_speech = 0;
    recognition.start();
}

vr_function();
