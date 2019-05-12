//consts

let noFileString = "nofile";

let NUM_MESSAGES_SHOWN = 20;

//DOM
let usernameDisplayId = "user_menu_username_display";

let userCreateNameId = "user_create_username";
let userCreatePasswordId = "user_create_password";

let userLoginNameId = "user_login_username";
let userLoginPasswordId = "user_login_password";

let roomJoinNameId = "room_join_name";
let roomJoinPasswordId = "room_join_password";

let roomCreateNameId = "room_create_name";
let roomCreatePasswordId = "room_create_password";
let roomCreateAccessByUrlId = "access_by_url";
let roomCreateAccessByPasswordId = "access_by_password";
let roomCreateEnterId = "room_create_enter";

let addUserToRoomNameId = "room_add_user";

let messageContainerId = "messages_container2";

let inputTextFieldId = "input_text_field";

class Message{
    constructor(room, index, text, audioPath) {
        this.room = room;
        this.index = index;
        this.text = text;
        this.audioPath = audioPath;
    }
    key(){
        return Message.key(this.room, this.index);
    }
    static key(room, index){
        return "Index:"+index+";Room:"+room+";";
    }
}

class Room{
    constructor(name, accessByUrl, accessByPassword, password){
        this.name = name;
        this.accessByUrl = accessByUrl;
        this.accessByPassword = accessByPassword;
        this.password = password;
    }
    key(){
        return Room.key(this.name);
    }
    static key(name){
        return name;
    }
}

class User{
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
    key(){
        return User.key(this.username);
    }
    static key(username){
        return username;
    }
}

//enum
let ServerRequestResult = {SUCCESS:"success", USER_AUTHENTICATION_FAILURE: "user authentication failure", USER_ALREADY_EXISTS:"user already exists", USER_ALREADY_IN_ROOM:"user already in room", ROOM_ALREADY_JOINED_BY_USER:"room already joined by user", USER_NOT_FOUND:"user not found",  ROOM_ACCESS_DENIED: "room access denied", ROOM_ALREADY_EXISTS: "room already exists", FAILURE:"failure"};

/*
//enum
let CreateRoomResult = {SUCCESS:"success", ROOM_ALREADY_EXISTS: "room already exists", FAILURE:"failure"};
Object.freeze(CreateRoomResult);

//enum
let AddUserToRoomResult =  {SUCCESS:"success", ROOM_ACCESS_DENIED: "room access denied", USER_AUTHENTICATION_FAILURE: "user authentication failure", USER_ALREADY_IN_ROOM:"user already in room", USER_NOT_FOUND:"user not found", FAILURE:"failure"};
Object.freeze(AddUserToRoomResult);

//enum
let CreateMessageResult = {SUCCESS:"success", ROOM_ACCESS_DENIED: "room access denied", USER_AUTHENTICATION_FAILURE: "user authentication failure", FAILURE:"failure"};
Object.freeze(CreateRoomResult);
*/