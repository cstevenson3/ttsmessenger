let noFileString = "nofile";

let inputTextFieldId = "input_text_field";
let roomNameTextFieldId = "room_switch_text_area";

let currentRoom = "welcome";
let roomPassword = "";

let currentUser = "";
let userPassword = "";

let getMessageMutex = 1;

window.onload = init;

function init(){
    //css changes
    document.getElementById("input").style.backgroundColor = "grey";

    //events
    document.getElementById(inputTextFieldId).addEventListener("keypress", keyupOnInputTextField);
    document.getElementById(roomNameTextFieldId).addEventListener("keypress", keyupOnRoomNameTextField);
    document.getElementById("room_switch_password").addEventListener("keypress", keyupOnRoomPasswordTextField);
    document.getElementById("room_create_enter").addEventListener("click", clickOnRoomCreateEnter);
    document.getElementById("user_login_password").addEventListener("keypress", keyPressOnUserLoginPassword);
    document.getElementById("user_create_password").addEventListener("keypress", keyPressOnUserCreatePassword);
    document.getElementById("room_add_user").addEventListener("keypress", keyPressOnRoomAddUser);

    //insertMessage(new Message("welcome", 0, "text lol 0", "/audio/a.wav"));
    //insertMessage(new Message("welcome", 2, "text lol 2", "/audio/a.wav"));
    //insertMessage(new Message("welcome", 1, "text lol 1", "/audio/a.wav"));

    //init get message loop
    getMessage(currentRoom, nextMessage);
}

function addUserToRoom(room, user){
    fetch(noFileString, 
        {method: "POST", 
        body: "", 
        headers: {
        "Content-Type": "text/plain",
        "Command":"addUserToRoom",
        "Room":currentRoom,
        "User":currentUser,
        "User-Password":userPassword,
        "New-User": user
        }
        }
        ).then(addUserToRoomResponse);
        function addUserToRoomResponse(response){
            if(response.ok){
                console.log("Added user to room");
            }else{
                console.log("Failed to add user to room");
            }
        }
}

function keyPressOnRoomAddUser(e){
    if (e.keyCode==13){
        e.preventDefault();
        username = document.getElementById("room_add_user").value;
        addUserToRoom(currentRoom, username);
    }
}

function createUser(username, password){
    fetch(noFileString, 
        {method: "POST", 
        body: "", 
        headers: {
        "Content-Type": "text/plain",
        "Command":"createUser",
        "New-User":username,
        "User-Password":password
        }
        }
        ).then(createUserResponse);
        function createUserResponse(response){
            if(response.ok){
                loginUser(username, password);
            }else{
                console.log("Failed to create user");
            }
        }
}

function keyPressOnUserCreatePassword(e){
    if(e.keyCode == 13){
        e.preventDefault();
        username = document.getElementById("user_create_username").value;
        password = document.getElementById("user_create_password").value;
        createUser(username, password);
    }
}

function loginUser(username, password){
    //TODO check if valid user
    userPassword = password;
    currentUser = username;
}

function keyPressOnUserLoginPassword(e){
    if(e.keyCode == 13){
        e.preventDefault();
        username = document.getElementById("user_login_username").value;
        password = document.getElementById("user_login_password").value;
        loginUser(username, password);
    }
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
    "Room-Password":password,
    "User":currentUser,
    "User-Password":userPassword
    }
    }
    ).then(createRoomResponse);
}

function createRoomResponse(response){
    if(response.status==200){
        console.log("yes");
        switchRoom(response.headers.get("Room"));
    }
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
    currentRoom = roomName;
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

function keyupOnRoomPasswordTextField(e){
    if(e.keyCode == 13){
        e.preventDefault();
        roomName = document.getElementById(roomNameTextFieldId).value;
        switchRoom(roomName);
        roomPassword = document.getElementById("room_switch_password").value;
    }
}

function enterOnInput(e){
    e.preventDefault();
    message = document.getElementById(inputTextFieldId).value;
    console.log(message);
    document.getElementById(inputTextFieldId).value = "";
    createMessage(currentRoom, message);
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
    "Room-Password":roomPassword,
    "User":currentUser,
    "User-Password":userPassword
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
        sleep(50).then(() => {getMessage(currentRoom, nextMessage);});
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
    "Room-Password":roomPassword,
    "User":currentUser,
    "User-Password":userPassword
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
        sleep(50).then(() => {getMessage(currentRoom, nextMessage);});
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
        sleep(50).then(() => {getMessage(currentRoom, nextMessage);});

        function soundLoaded(){
            messageAudio.play();
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}