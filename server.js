var express = require('express'),
    players = require('./routes/player');
 
var app = express();

app.get('/players/:id/reports', players.findByManager);
app.get('/players/:id', players.findById);
app.get('/players', players.findAll);
app.post('/players', players.addPlayer);
app.put('/players/:id', players.updatePlayer);
app.delete('/players/:id', players.deletePlayer);

app.listen(3000);
console.log('Listening on port 3000...');