var express = require('express'),
    players = require('./routes/player'),
    voice   = require('./routes/voice');

var app = express();
app.use(express.bodyParser());

app.get('/players/:id/reports', players.findByManager);
app.get('/players/:id', players.findById);
app.get('/players', players.findAll);
app.get('/voice/sms', voice.sendSms);

app.post('/players', players.addPlayer);
app.put('/players/:id', players.updatePlayer);
app.delete('/players/:id', players.deletePlayer);


app.listen(3000);
console.log('Listening on port 3000...');