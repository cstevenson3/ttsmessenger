function createMessageToServer(user, room, message, resolveFunction){
    bodyText = message.text;
    fetch(noFileString, 
    {method: "POST", 
    body: bodyText, 
    headers: {
    "Content-Type": "text/plain",
    "Command":"createMessage",
    "Room":room.name,
    "Room-Password":room.password,
    "User":user.username,
    "User-Password":user.password
    }
    }
    ).then(createMessageToServerResponse.bind(null, resolveFunction));
}

function createMessageToServerResponse(resolveFunction, response){
    resolveFunction(response);
}