function addUserToRoomToServer(roomName, allowedUser, newUserName, resolveFunction){
    fetch(noFileString, 
        {method: "POST", 
        body: "", 
        headers: {
        "Content-Type": "text/plain",
        "Command":"addUserToRoom",
        "Room":roomName,
        "User":allowedUser.username,
        "User-Password":allowedUser.password,
        "New-User": newUserName
        }
        }
        ).then(addUserToRoomToServerResponse.bind(null, resolveFunction));
}

function addUserToRoomToServerResponse(resolveFunction, response){
    resolveFunction(response);
}