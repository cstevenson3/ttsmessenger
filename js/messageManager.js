//post a new message

let noFileString = "nofile";

let inputTextFieldId = "input_text_field";
let roomNameTextFieldId = "room_switch_text_area";

let testRoom = "welcome"; // magic number
let roomPassword = "";

let getMessageMutex = 1;

window.onload = init;

function init(){
    //css changes
    document.getElementById("input").style.backgroundColor = "grey";
    document.getElementById(inputTextFieldId).addEventListener("keypress", keyupOnInputTextField);
    document.getElementById(roomNameTextFieldId).addEventListener("keypress", keyupOnRoomNameTextField);
    document.getElementById("room_create_enter").addEventListener("click", clickOnRoomCreateEnter);
    //init get message loop
    getMessage(testRoom, nextMessage);
}

function createRoom(name, accessByURL, accessByPassword, password){
    getMessageMutex = 0;
    fetch(noFileString, 
    {method: "POST", 
    body: "", 
    headers: {
    "Content-Type": "text/plain",
    "Command":"createRoom",
    "Room":name,
    "Room-Access-By-URL":accessByURL,
    "Room-Access-By-Password":accessByPassword,
    "Room-Password":password
    }
    }
    ).then(createMessageResponse);
}

function createMessageResponse(response){
    if(response.status==200){
        console.log("yes");
    }
    switchRoom(response.headers.get("Room"));
    getMessageMutex = 1;
}

function clickOnRoomCreateEnter(e){
    let name = document.getElementById("room_create_name").value;
    let password = document.getElementById("room_create_password").value;
    let accessByURL = document.getElementById("access_by_url").checked; 
    let accessByPassword = document.getElementById("access_by_password").checked; 
    roomPassword = password;
    createRoom(name,accessByURL,accessByPassword,password);
}

function switchRoom(roomName){
    
    var node = document.getElementById("messages_container2");
    testRoom = roomName;
    //roomPassword = document.getElementById("room_switch_password").value;
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    nextMessage = 0;
    document.getElementById(roomNameTextFieldId).value = roomName;
}

function enterOnRoomName(e){
    e.preventDefault();
    roomName = document.getElementById(roomNameTextFieldId).value;
    switchRoom(roomName);
    roomPassword = document.getElementById("room_switch_password").value;
}

function keyupOnRoomNameTextField(e){
    if (e.keyCode == 13){
        enterOnRoomName(e);
    }
}

function enterOnInput(e){
    e.preventDefault();
    message = document.getElementById(inputTextFieldId).value;
    console.log(message);
    document.getElementById(inputTextFieldId).value = "";
    createMessage(testRoom, message);
}

function keyupOnInputTextField (e){
    if (e.keyCode == 13){
        enterOnInput(e);
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
    "Room":room,
    "Room-Password":roomPassword
    }
    }
    ).then(postMessageResponse);
}

function postMessageResponse(response){
    console.log(response.status);
}

let nextMessage = 0; //the next message which needs to be loaded

function getMessage(room, messageIndex){
    console.log(roomPassword);
    if(getMessageMutex == 0){
        sleep(50).then(() => {getMessage(testRoom, nextMessage);});
        return;
    }
    //fetch message
    fetch(noFileString, 
    {method: "POST",
    headers: {
    "Content-Type": "text/plain",
    "Command": "getMessage",
    "Room": room,
    "Message-Index":messageIndex,
    "Room-Password":roomPassword
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