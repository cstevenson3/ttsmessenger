function getMessageFromServer(room, messageIndex, resolveFunction){
    //fetch message
    fetch(noFileString, 
    {method: "POST",
    headers: {
    "Content-Type": "text/plain",
    "Command": "getMessage",
    "Room": room,
    "Message-Index":messageIndex,
    "Room-Password":clientState.rooms[room].password,
    "User":clientState.user.username,
    "User-Password":clientState.user.password
    }
    }
    ).then(getMessageFromServerResponse.bind(null, resolveFunction));
}

function getMessageFromServerResponse(resolveFunction, response){
    resolveFunction(response);
}
