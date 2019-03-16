function loginUserToServer(user, resolveFunction){
    fetch(noFileString, 
        {method: "POST", 
        body: "", 
        headers: {
        "Content-Type": "text/plain",
        "Command":"loginUser",
        "User":user.username,
        "User-Password":user.password,
        }
        }
        ).then(loginUserToServerResponse.bind(null, resolveFunction));
}

function loginUserToServerResponse(resolveFunction, response){
    resolveFunction(response);
}