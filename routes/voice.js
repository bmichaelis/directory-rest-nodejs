var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("player13");
    db.collection('players', {strict:true}, function(err, collection) {
        if (err) {
            logger.info("The 'players' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});
var winston = require('winston'),
    logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });

var voicejs   = require('voice');
var client = new voicejs.Client({
    email: 'brett.michaelis@gmail.com',
    password: 'MIch@0076!',
	tokens: require('voice/tokens.json')
});

client.on('status', function(status){
	logger.info('UPDATED ACCOUNT STATUS:')
	logger.info(status);
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
		logger.info('SMS "' +text+ '" sent to', to + '. Conversation id: ', data.send_sms_response.conversation_id);
		return res2.send(200);
	});
};

exports.teamMsg = function(req, res) {
	var res2 = res;
   	var msg = typeof req.query["msg"] != 'undefined' ? req.query["msg"] : 'This is a test sms from Brett';
    logger.info('teamMsg: ' + msg);
    db.collection('players', function(err, collection) {
    	collection.find({ 'disabled': false }).each(function(err, item) {
        	if(item != null && item != undefined)
        	{
			   delete item._id;
        		item.msg = msg;
        		logger.info("Added to Queue:");
        		logger.info(item);
				db.collection('messages', function(err, collection) {
			    	collection.insert(item, {w:1},function(err, result) {
						if(err != null) {
							logger.info("Error:");
							logger.info(err);
						}
						logger.info("Result:");
						logger.info(result);
			    	});
			    });
			}
    	});
	   	res2.send(200, "Message Queued");
	});
};

exports.processQueue = function() {
	db.collection('messages', function(err, collection) {
    	collection.findAndModify({id: {$gt: 0}},[['_id','asc']],{ remove: true }, function(err, item){
        	if(item != null && item != undefined)
        	{
			 	client.sms({ to: item.cellPhone, text: item.cellPhone + ": " + item.firstName + " " + item.lastName + "::\n" + item.msg}, function(err, res, data){
			    	logger.info("Message Sent:");
			    	logger.info(item);
		       	});
		    }
	   	});
	});
};