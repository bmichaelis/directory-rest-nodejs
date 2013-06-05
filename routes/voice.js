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
var voicejs   = require('voice');
var client = new voicejs.Client({
	email: 'brett.michaelis@gmail.com',
	password: 'MIch@0076!',
	tokens: require('voice/tokens.json')
});

client.on('status', function(status){
	console.log('UPDATED ACCOUNT STATUS:')
	console.log(status);
});

var messages = [];
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
    	collection.find({ 'disabled': false }).each(function(err, item) {
        	if(item != null)
        	{
        		item.msg = msg;
        		messages.push(item);
        		console.log("Added to Queue:\n" + item);
			}
    	});
	   	res2.send(200, "Message Queued");
	});
};

setInterval(function() {
	if(messages.length > 0) {
		var message = messages.pop();
    	console.log(message);
	 	client.sms({ to: '8013102818', text: message.cellPhone + message.msg}, function(err, res, data){
			console.log('SMS "' + message.msg + '" sent to', message.cellPhone + '. Conversation id: ', data.send_sms_response.conversation_id);
       	});
	 }
}, 5000);