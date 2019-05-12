window.onload = init;

function init(){
    //css changes
    document.getElementById("input").style.backgroundColor = "grey"; //changes from red to grey to indicate js is loaded

    //events
    bindFunctionToEnterOnNode(userCreateNameId, enterOnUserCreateName);
    bindFunctionToEnterOnNode(userCreatePasswordId, enterOnUserCreatePassword);

    bindFunctionToEnterOnNode(userLoginNameId, enterOnUserLoginName);
    bindFunctionToEnterOnNode(userLoginPasswordId, enterOnUserLoginPassword);

    bindFunctionToEnterOnNode(roomJoinNameId, enterOnRoomJoinName);
    bindFunctionToEnterOnNode(roomJoinPasswordId, enterOnRoomJoinPassword);

    bindFunctionToEnterOnNode(roomCreateNameId, enterOnRoomCreateName);
    bindFunctionToEnterOnNode(roomCreatePasswordId, enterOnRoomCreatePassword);
    document.getElementById(roomCreateEnterId).addEventListener("click", clickOnRoomCreateEnter);

    bindFunctionToEnterOnNode(addUserToRoomNameId, enterOnAddUserToRoomName);

    bindFunctionToEnterOnNode(inputTextFieldId, enterOnInputTextField);

    setUsernameDisplay(clientState.user.username);

    sleep(0).then(updateLoop);
}

function updateLoop(){
    //get server changes -> update clientState
    
    //clientState -> make DOMchanges
    //set room list
    setRoomList(clientState.rooms);
    //clear message container
    //clearMessages();
    //remove old messages
    cleanupMessages(clientState.latestMessageIndex + 1 - NUM_MESSAGES_SHOWN);
    //for latest 20 messages, insert into DOM
    for(let i = clientState.latestMessageIndex + 1; i > clientState.latestMessageIndex + 1 - NUM_MESSAGES_SHOWN; i-=1){
        let message = MessageCache.getMessage(clientState.currentRoom, i);
        if(message==null){

        }else{
            insertMessage(message);
        }
    }

    sleep(500).then(updateLoop);
}

function createUser(username, password){
    createUserToServer(new User(username, password), createUserResponse);
}

function createUserResponse(response){
    console.log(response);
    let username = response.headers.get("User");
    let password = response.headers.get("User-Password");
    let header = "(Create User): "
    switch(response.statusText){
        case ServerRequestResult.SUCCESS:
            alert(header + "User " + username + " created successfully, logging in now");
            loginUser(username, password)
        break;

        case ServerRequestResult.USER_ALREADY_EXISTS:
            alert(header + "User " + username + " already exists and is not available");
        break;

        case ServerRequestResult.FAILURE:
            alert(header + "Failed to create user " + username + " with a generic failure");
        break;

        default:
            alert(header + "Failed to create user " + username + " with an unknown failure");
        break;
    }
}

function loginUser(username, password){
    //at this stage just checks that credentials are correct, in future this may retrieve a session token
    loginUserToServer(new User(username, password), loginUserResponse);
}

function loginUserResponse(response){
    let header = "(Login User): ";
    let username = response.headers.get("User");
    let password = response.headers.get("User-Password");
    switch(response.statusText){
        case ServerRequestResult.SUCCESS:
            alert(header + "User " + username + " logged in, switching to this user now");
            clientState.user = new User(username, password);
        break;

        case ServerRequestResult.FAILURE:
            alert(header + "User " + username + " not logged in due to authentication failure");
        break;

        case ServerRequestResult.USER_AUTHENTICATION_FAILURE:
            alert(header + "User " + username + " not logged in due to generic failure");
        break;

        default:
            alert(header + "User " + username + " not logged in due to unknown failure");
        break;
    }
}

function joinRoom(roomName, roomPassword){
    addRoomToUserToServer(clientState.user, new Room(roomName, null, null, roomPassword), joinRoomResponse);
}

function joinRoomResponse(response){
    let header = "(Join room): ";
    let userName = response.headers.get("User");
    let roomName = response.headers.get("Room");
    switch(response.statusText){
        case ServerRequestResult.SUCCESS:
            alert(header + "Successfully joined room " + roomName + " with user " + userName);
        break;

        case ServerRequestResult.ROOM_ALREADY_JOINED_BY_USER:
            alert(header + "User " + userName + " has already joined " + roomName, "switching to it now");
            clientState.currentRoom = roomName;
        break;

        case ServerRequestResult.USER_AUTHENTICATION_FAILURE:
            alert(header + "User " + userName + " cannot join " + roomName, "due to a user authentication failure");
        break;

        case ServerRequestResult.ROOM_ACCESS_DENIED:
            alert(header + "User " + userName + " cannot join room " + roomName + " as room access was denied");
        break;

        case ServerRequestResult.FAILURE:
            alert(header + "User " + userName + " cannot join room " + roomName + ", with generic failure");
        break;

        default:
            alert(header + "User " + userName + " cannot join room " + roomName + ", with unknown failure");
        break;
    }
}

function createRoom(roomName, roomPassword, accessByUrl, accessByPassword){
    createRoomToServer(clientState.user, new Room(roomName, accessByUrl, accessByPassword, roomPassword), createRoomResponse);
}

function createRoomResponse(response){
    let header = "(Create room): ";
    let roomName = response.headers.get("Room");
    let roomPassword = response.headers.get("Room-Password");
    let accessByUrl = response.headers.get("Room");
    let accessByPassword = response.headers.get("Room-Password");
    let user = response.headers.get("User");
    switch(response.statusText){
        case ServerRequestResult.SUCCESS:
            alert(header + "Room " + roomName + " created successfully, switching to it now");
            clientState.rooms[roomName] = new Room(roomName, accessByUrl=="true", accessByPassword=="true", roomPassword);
            clientState.currentRoom = roomName;
        break;

        case ServerRequestResult.ROOM_ALREADY_EXISTS:
            alert(header + "Room " + roomName + " already exists");
        break;

        case ServerRequestResult.ROOM_ALREADY_EXISTS:
            alert(header + "Room " + roomName + " already exists");
        break;

        case ServerRequestResult.USER_AUTHENTICATION_FAILURE:
            alert(header + "User " + user + " had an authentication failure, room " + roomName + " not created");
        break;

        case ServerRequestResult.FAILURE:
            alert(header + "Generic failure")
        break;

        default:
            alert(header + "Unknown failure");
        break;
    }
}

function addUserToRoom(roomName, allowedUser, newUserName){
    addUserToRoomToServer(roomName, allowedUser, newUserName, addUserToRoomResponse);
}

function addUserToRoomResponse(){
    let allowedUserName = response.headers.get("User");
    let newUserName = response.headers.get("New-User");
    let roomName = response.headers.get("Room");
    header = "(Add user to room): "

    switch(response.statusText){
        case ServerRequestResult.SUCCESS:
            alert(header + "Added user " + newUserName + " to room " + roomName);
            clientState.rooms[roomName].usersInRoom.push(newUserName);
        break;

        case ServerRequestResult.USER_ALREADY_IN_ROOM:
            alert(header + "User " + newUserName + " is already in room " + roomName);
        break;

        case ServerRequestResult.ROOM_ACCESS_DENIED:
            alert(header + "Your user " + allowedUserName + " is not allowed to add people to room " + roomName);
        break;

        case ServerRequestResult.USER_AUTHENTICATION_FAILURE:
            alert(header + "Failed to authenticate your user " + allowedUserName);
        break;

        case ServerRequestResult.USER_NOT_FOUND:
            alert(header + "Failed to find new user " + newUserName);
        break;

        case ServerRequestResult.FAILURE:
            alert(header + "Generic failure");
        break;

        default:
            alert(header + "Unknown failure");
        break;
    }
}

function createMessage(text){
    message = new Message(clientState.currentRoom, null, text, null);
    createMessageToServer(clientState.user, clientState.rooms[clientState.currentRoom], message, createMessageResponse);
}

function createMessageResponse(response){
    switch(response.status){
        case ServerRequestResult.SUCCESS:
            console.log("Create Message successful");
        break;

        case ServerRequestResult.USER_AUTHENTICATION_FAILURE:
            console.log("Create Message failed due to user authentication error");
        break;

        case ServerRequestResult.ROOM_ACCESS_DENIED:
            console.log("Create Message failed due to room access denied");
        break;

        case ServerRequestResult.FAILURE:
            console.log("Create Message failed with an unknown failure");
        break;
        default:
            console.log("Create Message probably failed");
        break;
    }
}