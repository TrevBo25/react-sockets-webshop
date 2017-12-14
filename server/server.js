const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      socket = require('socket.io');

const app = express();
app.use(bodyParser.json());
app.use(cors());

messages = [];

const PORT = 3535;

const io = socket(app.listen(PORT, () => console.log(`We be listnin on port ${PORT} mon.`)));

io.on('connection', onConnect)

function onConnect(socket){
    socket.join('chat room')
    console.log('A user joined the chatroom')
    
    socket.on('sendMessage', message => {
        // console.log('new message ', message);
        messages.push(message);
        // console.log('new array of messages', messages)
        io.in('chat room').emit('getMessage', messages)
    })

    socket.on('roomChange', room => {
        // console.log(room)
        socket.emit('getMessage', messages)
    })

    socket.on('typing', name => {
        // console.log(name)
        socket.broadcast.emit('newTyper', name)
    })

    socket.on('stopTyping', name => {
        // console.log(name + ' stopped typing')
        socket.broadcast.emit('oldTyper', name)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
}