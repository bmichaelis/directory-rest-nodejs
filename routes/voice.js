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

exports.sendSms = function(req, res) {
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