var express = require('express'),
    players = require('./routes/player'),
    voice   = require('./routes/voice'),
    winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });

var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/players/:id/reports', players.findByManager);
app.get('/players/:id', players.findById);
app.get('/players', players.findAll);
app.get('/voice/sms', voice.sendMsg);
app.get('/voice/team', voice.teamMsg);

app.post('/players', players.addPlayer);
app.put('/players/:id', players.updatePlayer);
app.delete('/players/:id', players.deletePlayer);


app.listen(3000);
console.log('Listening on port 3000...');