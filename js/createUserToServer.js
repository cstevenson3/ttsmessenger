function createUserToServer(user, resolveFunction){
    fetch(noFileString, 
        {method: "POST", 
        body: "", 
        headers: {
        "Content-Type": "text/plain",
        "Command":"createUser",
        "New-User":user.username,
        "User-Password":user.password
        }
        }
        ).then(createUserToServerResponse.bind(null, resolveFunction));
}

function createUserToServerResponse(resolveFunction, response){
    resolveFunction(response);
}