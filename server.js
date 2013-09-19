/**
 * Module dependencies
 */

var express = require('express'),
    players = require('./routes/player'),
    voice   = require('./routes/voice'),
	http = require('http'),
    winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });

var app = express();
var server = http.createServer(app);
//io = require('socket.io').listen(server);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.set('view options', { pretty: true });

//app.get('/', players.index);
app.get('/players/:id/reports', players.findByManager);
app.get('/players/:id', players.findById);
app.get('/players', players.findAll);
app.get('/schedule/:team', players.getSchedule);
app.get('/voice/sms', voice.sendMsg);
app.get('/voice/team', voice.teamMsg);

app.post('/players', players.addPlayer);
app.put('/players/:id', players.updatePlayer);
app.delete('/players/:id', players.deletePlayer);

setInterval(voice.processQueue, 5000);
// // Socket.io Communication
// io.sockets.on('connection', function (socket) {
//   io.sockets.emit('Welcome!!');

//   socket.on('send', function (from, msg) {
//     io.sockets.emit(from, " says ", msg);
//     logger.log('I received a private message by ', from, ' saying ', msg);
//   });

//   socket.on('disconnect', function () {
//     io.sockets.emit('user disconnected');
//   });
// });

// setInterval(function() {
// 	voice.processQueue(io);
// }, 5000);

app.listen(3001);
logger.log('Listening on port 3000...');