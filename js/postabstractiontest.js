console.log(window.location.hostname);
console.log(window.location.port);


var createMessageTest = "";
createMessageTest += "createMessage\n";
createMessageTest += "line1\n";
createMessageTest += "line2\n";


fetch("command", 
{method: "POST", 
body: createMessageTest, 
headers: {
  "Content-Type": "text/plain"
}
}
).then(response => {
  console.log(response.status);
});