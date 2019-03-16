function createRoomToServer(user, room, resolveFunction){
    fetch(noFileString, 
    {method: "POST", 
    body: "", 
    headers: {
    "Content-Type": "text/plain",
    "Command":"createRoom",
    "Room":room.name,
    "Room-Access-By-URL":room.accessByUrl,
    "Room-Access-By-Password":room.accessByPassword,
    "Room-Password":room.password,
    "User":clientState.user.username,
    "User-Password":clientState.user.password
    }
    }
    ).then(createRoomToServerResponse.bind(null, resolveFunction));
}

function createRoomToServerResponse(resolveFunction, response){
    resolveFunction(response);
}