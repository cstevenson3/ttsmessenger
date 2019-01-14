var IP = "192.168.1.68";
var PORT = 80;

function handleResponse(value, done){
    if (!done) {
        // Response received, log it:
        console.log("Data received from server:" + value);
    }

    // Close the TCP connection
    mySocket.close();
}

function afterSending(){
    console.log("Data has been sent to server");
    mySocket.readable.getReader().read().then(handleResponse);
}

function TCPallowed(){
    // Permission was granted
    // Create a new TCP client socket and connect to remote host
    var mySocket = new TCPSocket(IP, PORT);
    // Send data to server
    mySocket.writeable.write("Hello World").then(afterSending);
}

navigator.tcpPermission.requestPermission({remoteAddress:IP, remotePort:PORT}).then(TCPallowed);