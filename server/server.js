const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      socket = require('socket.io');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3535;

const io = socket(app.listen(PORT, () => console.log(`We be listnin on port ${PORT} mon.`)));

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('sendMessage', message => {
        console.log(message);
        socket.emit('getMessage', message)
    })






    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})