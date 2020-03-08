let express = require('express');
let app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const port=process.env.PORT || 4000;

app.use(express.static('public'))
app.use(express.static('bower_components'))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get("/room", (req,res) => {
    res.render('room', {
        name: req.query.name
    });
})

io.on('connection', function (socket) {
    socket.on('join', function(data, fn) {
        console.log("join: " + data);
        socket.broadcast.emit("join", data);
        fn(data);
    });
    socket.on('msg-new', function(data, fn) {
        socket.broadcast.emit("msg-new", data);
        fn(data);
    });
    socket.on('leave', (name) => {
        console.log("leave: " + name);
        socket.broadcast.emit("leave", name);
    })
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});