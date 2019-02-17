//post a new message

let noFileString = "nofile";

let inputTextFieldId = "input_text_field";

let testRoom = "abc"; // magic number

window.onload = init;

function init(){
    //css changes
    document.getElementById("input").style.backgroundColor = "grey";
    document.getElementById(inputTextFieldId).addEventListener("keypress", keyupOnInputTextField);
    //init get message loop
    getMessage(testRoom, nextMessage);
}

function keyupOnInputTextField (e){
    if (e.keyCode == 13){
        e.preventDefault();
        message = document.getElementById(inputTextFieldId).value;
        console.log(message);
        document.getElementById(inputTextFieldId).value = "";
        createMessage(testRoom, message);
    }
}

function createMessage(room, message){
    bodyText = message;
    fetch(noFileString, 
    {method: "POST", 
    body: bodyText, 
    headers: {
    "Content-Type": "text/plain",
    "Command":"createMessage",
    "Room":room
    }
    }
    ).then(postMessageResponse);
}

function postMessageResponse(response){
    console.log(response.status);
}

let nextMessage = 0; //the next message which needs to be loaded

function getMessage(room, messageIndex){
    //fetch message
    fetch(noFileString, 
    {method: "POST",
    headers: {
    "Content-Type": "text/plain",
    "Command": "getMessage",
    "Room": room,
    "Message-Index":messageIndex
    }
    }
    ).then(getMessageResponse);
}


function getMessageResponse(response){
    let status = response.headers.get("Get-Message-Response");
    console.log(status);
    if (status == null){
        console.log("getMessageFailed (null)");
    }else if(status == "success"){
        response.text().then(getMessageResponseText);
    }else{
        console.log("getMessage Failed (not success)");
        sleep(50).then(() => {getMessage(testRoom, nextMessage);});
    }

    function getMessageResponseText(text){
        console.log(text);
        let audioID = response.headers.get("Message-Index") + "audio";
        let messageContainerID = document.getElementById('messages_container2');
        messageContainerID.innerHTML += '<div class="message"><audio controls id="' + audioID + '"><source src="' + response.headers.get("Audio") + '" type="audio/ogg"></audio><h6>' + text + '</h6><div class="message_play_button"></div></div>';
        messageContainerID.scrollTop = messageContainerID.scrollHeight;
        let messageAudio = document.getElementById(audioID);
        messageAudio.addEventListener('canplaythrough', soundLoaded, false);
        messageAudio.load();
        //update html
        nextMessage += 1;
        sleep(50).then(() => {getMessage(testRoom, nextMessage);});

        function soundLoaded(){
            messageAudio.play();
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}