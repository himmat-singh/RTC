var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];
var colors = [];


server.listen(process.env.PORT || 9090,'127.0.0.1');
console.log('Server running...');

app.get('/',function(req,res){

	res.sendFile(__dirname+'/index.html');

});

io.sockets.on('connection', function(socket){

connections.push(socket);
console.log('Connected: %s sockets connected', connections.length);



// Disconnect

socket.on('disconnect', function(data){
	users.splice(users.indexOf(socket.username), 1);
	connections.splice(connections.indexOf(socket),1);
	console.log('Disconnected: %s sockets connect', connections.length);
});

socket.on('sendMessage', function(data){
	io.sockets.emit('newMessage', {msg:data, user: socket.username})
});

socket.on('newUser', function(data,callback){
	callback(true);
	socket.username = data;
	users.push(socket.username);
	//colors.push();
	updateUserList();
});


function updateUserList(){
	io.sockets.emit('getUsers', users);
}

});