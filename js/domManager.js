function insertMessage(message){
    //if message is already in dom don't do anything
    messagesContainer = document.getElementById(messageContainerId);
    if(document.getElementById("message" + message.index)){
        return;
    }

    //<div class="message" id="message0"><div class="message_text_container"><h6>text</h6></div><div class="message_play_button"></div></div>
    let messageDiv = document.createElement("div");
    messageDiv.className = "message";
    messageDiv.id = "message" + message.index;
    let messageTextContainerDiv = document.createElement("div");
    messageTextContainerDiv.class = "message_text_container";
    let textContainer = document.createElement("h6");
    textContainer.textContent = message.text;
    let messagePlayButtonDiv = document.createElement("div");
    messagePlayButtonDiv.className = "message_play_button";
    messagePlayButtonDiv.addEventListener("mousedown", clickOnMessagePlay);
    let audioNode = document.createElement("audio");
    audioNode.src = message.audioPath;
    audioNode.type = "audio/ogg";

    //assemble message
    messageTextContainerDiv.appendChild(textContainer);
    messageDiv.appendChild(messageTextContainerDiv);
    messageDiv.appendChild(messagePlayButtonDiv);
    messageDiv.appendChild(audioNode);

    //find place to insert in messages_container2

    currentIndex = messagesContainer.childNodes.length - 1;
    if (currentIndex == -1){
        messagesContainer.appendChild(messageDiv);
    }
    while(true){
        if(currentIndex < 0){
            messagesContainer.insertBefore(messageDiv, messagesContainer.firstChild);
            break;
        }
        if(messagesContainer.childNodes[currentIndex] == null || messagesContainer.childNodes[currentIndex].className != "message"){
            currentIndex -=1;
            continue;
        }
        idString = messagesContainer.childNodes[currentIndex].id;
        messageIndexString = idString.slice(7);
        messageIndex = parseInt(messageIndexString);
        if(messageIndex > message.index){
            currentIndex -= 1;
            continue;
        }else{
            messagesContainer.insertBefore(messageDiv, messagesContainer.childNodes[currentIndex + 1]);
            break;
        }
    }
}

function bindFunctionToEnterOnNode(nodeId, func){
    document.getElementById(nodeId).addEventListener("keypress", enterCheck);
    function enterCheck(event){
        if (event.keyCode==13){
            event.preventDefault();
            func();
        }
    }
}



function enterOnUserCreateName(){
    document.getElementById(userCreatePasswordId).focus();
}

function enterOnUserCreatePassword(){
    let username = document.getElementById(userCreateNameId).value;
    let password = document.getElementById(userCreatePasswordId).value;
    createUser(username, password);
}



function enterOnUserLoginName(){
    document.getElementById(userCreatePasswordId).focus();
}

function enterOnUserLoginPassword(){
    let username = document.getElementById(userLoginNameId).value;
    let password = document.getElementById(userLoginPasswordId).value;
    loginUser(username, password);
}



function enterOnRoomJoinName(){
    document.getElementById(roomJoinPasswordId).focus();
}

function enterOnRoomJoinPassword(){
    let roomName = document.getElementById(roomJoinNameId).value;
    let roomPassword = document.getElementById(roomJoinPasswordId).value;
    joinRoom(roomName, roomPassword);
}



function enterOnRoomCreateName(){
    document.getElementById(roomCreatePasswordId).focus();
}

function enterOnRoomCreatePassword(){
    let roomName = document.getElementById(roomCreateNameId).value;
    let roomPassword = document.getElementById(roomCreatePasswordId).value;
    let accessByUrl = document.getElementById(roomCreateAccessByUrlId).checked;
    let accessByPassword = document.getElementById(roomCreateAccessByPasswordId).checked;
    createRoom(roomName, accessByUrl, accessByPassword, roomPassword);
}

function clickOnRoomCreateEnter(){
    enterOnRoomCreatePassword(); //same behaviour
}



function enterOnAddUserToRoomName(){
    let newUserName = document.getElementById(addUserToRoomName).value;
    addUserToRoom(newUserName);
}



function enterOnInputTextField(){
    let text = document.getElementById(inputTextFieldId).value;
    document.getElementById(inputTextFieldId).value = "";
    createMessage(text);
}



function clickOnMessagePlay(event){
    event.preventDefault();
    let messageDiv = event.target.parentNode;
    let audioNode = null;
    for (let i = 0; i < messageDiv.childNodes.length; i++) {
        if (messageDiv.childNodes[i].nodeName == "AUDIO") {
            audioNode = messageDiv.childNodes[i];
            break;
        }        
    }
    if(audioNode.paused){
        audioNode.play();
    }else{
        audioNode.pause()
    }
}   


function setRoomList(rooms){
    
}



function clearMessages(){
    let node = document.getElementById(messageContainerId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}


function cleanupMessages(beforeIndex){
    let parentNode = document.getElementById(messageContainerId);
    let nodes = [];
    for(let i=0; i<parentNode.childNodes.length; i++){
        nodes.push(parentNode.childNodes[i]);
    }
    for(let j=0; j<nodes.length; j++){
        let node = nodes[j];
        if(!(j==null)){
            if(node.className=="message"){
                let index = node.id.slice(7);
                if(index < beforeIndex){
                    node.remove();
                }
            }
        }
    }
}