function addRoomToUserToServer(user, room, resolveFunction){
    console.log(user);
    console.log(room);
    fetch(noFileString, 
        {method: "POST", 
        body: "", 
        headers: {
        "Content-Type": "text/plain",
        "Command":"addRoomToUser",
        "Room":room.name,
        "Room-Password":room.password,
        "User":user.username,
        "User-Password":user.password,
        }
        }
        ).then(addRoomToUserToServerResponse.bind(null, resolveFunction));
}

function addRoomToUserToServerResponse(resolveFunction, response){
    resolveFunction(response);
}