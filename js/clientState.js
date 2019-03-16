let clientState = {
    user: {username: "no-user", password: ""},
    rooms: {"welcome":{name:"welcome", password:""}},
    currentRoom: "welcome",
    latestMessageIndex: 0
}

let cache = {}; //for message cache

class MessageCache{
    
    constructor(){
    }
    static getMessage(room, messageIndex){
        if(messageIndex < 0){
            return null;
        }
        if (cache.hasOwnProperty(Message.key(room, messageIndex))){
            return cache[Message.key(room, messageIndex)];
        }else{
            getMessageFromServer(room, messageIndex, getMessageFromServerResponse);
            return null;
            function getMessageFromServerResponse(response){
                switch(response.statusText){
                    case ServerRequestResult.SUCCESS:
                        response.text().then(getMessageFromServerTextResponse)
                        return null;
                        function getMessageFromServerTextResponse(text){
                            
                            let messageText = text;
                            let messageAudioPath = response.headers.get("Audio");
                            let messageIndexReturned = response.headers.get("Message-Index");
                            let roomName = response.headers.get("Room");
    
                            let message = new Message(room, messageIndexReturned, messageText, messageAudioPath);
                            MessageCache.addMessage(message);
    
                            if (messageIndex > clientState.latestMessageIndex){
                                clientState.latestMessageIndex = messageIndex;
                            }
                        }
                    break;

                    default:
                    break;
                }
            }
        }
    }
    static addMessage(message){
        cache[message.key()] = message;
    }
}