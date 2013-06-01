var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("player13");
    db.collection('players', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'players' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});

var voicejs   = require('../lib/voice/voice.js');
var client = new voicejs.Client({
	email: 'brett.michaelis@gmail.com',
	password: 'MIch@0076!',
	tokens: require('../lib/voice/tokens.json')
});

client.on('status', function(status){
	console.log('UPDATED ACCOUNT STATUS:')
	console.log(status);
});

exports.sendMsg = function(req, res) {
	var res2 = res;
	var text = typeof req.query["msg"] != 'undefined' ? req.query["msg"] : 'This is a test sms from Brett';
	var to	 = typeof req.query["number"] != 'undefined' ? req.query["number"] : '8013102818';

	client.sms({ to: to, text: text}, function(err, res, data){
		if(err){
            return res2.send(500);
 		}
		console.log('SMS "' +text+ '" sent to', to + '. Conversation id: ', data.send_sms_response.conversation_id);
		return res2.send(200);
	});
};

exports.teamMsg = function(req, res) {
	var res2 = res;
   	var msg = typeof req.query["msg"] != 'undefined' ? req.query["msg"] : 'This is a test sms from Brett';
    console.log('teamMsg: ' + msg);
    db.collection('players', function(err, collection) {
        collection.find({ $or: [ {'firstName': 'Brett'}, {'firstName': 'Nikki'},{'firstName': 'Kendrick'} ] }).each(function(err, item) {
        	if(item != null)
        	{
	        	console.log(item);
	        	console.log(typeof item);
	        	res.send(200);
			 	client.sms({ to: item.cellPhone, text: msg}, function(err, res, data){
					if(err){
			            return res2.send(500);
			 		}
		 			console.log('SMS "' +msg+ '" sent to', item.cellPhone + '. Conversation id: ', data.send_sms_response.conversation_id);
		       	});
			 }
    	});
	   	res2.send(200, "Message Sent");
	});
};