let express = require('express');
let app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var ver = require('./package.json').version;

const port=process.env.PORT || 4000;

app.use(express.static('public'))
app.use(express.static('bower_components'))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        version: ver
    });
});

app.get("/room", (req,res) => {
    res.render('room', {
        version: ver,
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

server.listen(port, function () {
    console.log('listening on *:' + port);
});