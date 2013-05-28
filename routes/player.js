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
 
exports.findById = function(req, res) {
    console.log(req.params);
    var id = parseInt(req.params.id);
    console.log('findById: ' + id);
    db.collection('players', function(err, collection) {
        collection.findOne({'id': id}, function(err, item) {
            console.log(item);
            res.jsonp(item);
        });
    });
};

exports.findByManager = function(req, res) {
    var id = parseInt(req.params.id);
    console.log('findByManager: ' + id);
    db.collection('players', function(err, collection) {
        collection.find({'managerId': id}).toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('players', function(err, collection) {
        if (name) {
            collection.find({ $or: [ {"firstName": new RegExp(name, "i")}, { "lastName": new RegExp(name, "i") } ]}).toArray(function(err, items) {
                res.jsonp(items);
            });
        } else {
            collection.find().toArray(function(err, items) {
                res.jsonp(items);
            });
        }
    });
};

exports.addPlayer = function(req, res) {
    var player = req.body;
//    console.log('Displaying req: ' + player.firstName);
    console.log('Displaying body: ' + req.body);
    console.log('Adding player: ' + JSON.stringify(player));
    db.collection('players', function(err, collection) {
        collection.insert(player, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}; 

exports.updatePlayer = function(req, res) {
    var id = req.params.id;
    var player = req.body;
    console.log('Updating player: ' + id);
    console.log(JSON.stringify(player));
    db.collection('players', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, player, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating player: ' + err);
            res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(player);
            }
        });
    });
};
 
exports.deletePlayer = function(req, res) {
    var id = req.params.id;
    console.log('Deleting player: ' + id);
    db.collection('players', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    console.log("Populating player database...");
    var players = [
            {"id": 1, "firstName": "Brett", "lastName": "Michaelis", "cellPhone":"8013102818", "disabled": false},
            {"id": 2, "firstName": "Nikki", "lastName": "Michaelis", "cellPhone":"8013674188", "disabled": false},
            {"id": 3, "firstName": "Trevor", "lastName": "Michaelis", "cellPhone":"8013618283", "disabled": false},
            {"id": 4, "firstName": "Heather", "lastName": "Michaelis", "cellPhone":"8016232763", "disabled": false},
            {"id": 5, "firstName": "Holly", "lastName": "Smith", "cellPhone":"8014735827", "disabled": false},
            {"id": 6, "firstName": "Kirt", "lastName": "Michaelis", "cellPhone":"8013628293", "disabled": false},
            {"id": 7, "firstName": "Gilbert", "lastName": "Mena", "cellPhone":"8012287558", "disabled": false},
            {"id": 8, "firstName": "Kirk", "lastName": "Goodwin", "cellPhone":"8013194802", "disabled": false},
            {"id": 9, "firstName": "Steven", "lastName": "Newsome", "cellPhone":"8014720489", "disabled": false},
            {"id": 10, "firstName": "Katie", "lastName": "Olive", "cellPhone":"8013184021", "disabled": false},
            {"id": 11, "firstName": "Sam", "lastName": "Olive", "cellPhone":"8013613787", "disabled": false},
            {"id": 12, "firstName": "Scott", "lastName": "Spjut", "cellPhone":"8013180587", "disabled": false},
            {"id": 13, "firstName": "Kari", "lastName": "Sunderland", "cellPhone":"8014276007", "disabled": false},
            {"id": 14, "firstName": "Joel", "lastName": "Robbins", "cellPhone":"8013903844", "disabled": false},
            {"id": 15, "firstName": "Jeff", "lastName": "Spear", "cellPhone":"8016696128", "disabled": false},
            {"id": 16, "firstName": "Skye", "lastName": "Larsen", "cellPhone":"8018570093", "disabled": false},
            {"id": 17, "firstName": "Tree", "lastName": "Crowe", "cellPhone":"8013188876", "disabled": false},
            {"id": 18, "firstName": "Thomas", "lastName": "Cutler", "cellPhone":"8019951120", "disabled": false},
            {"id": 19, "firstName": "Jenny", "lastName": "Ljung", "cellPhone":"6503025473", "disabled": false},
            {"id": 20, "firstName": "Trent", "lastName": "Staggs", "cellPhone":"8014037001", "disabled": false},
            {"id": 21, "firstName": "Jordan", "lastName": "O'Brien", "cellPhone":"2083511989", "disabled": false},
            {"id": 22, "firstName": "Taylor", "lastName": "Pennock", "cellPhone":"8019952198", "disabled": false},
            {"id": 23, "firstName": "Cory", "lastName": "Baker", "cellPhone":"5306872515", "disabled": false},
            {"id": 24, "firstName": "Kevin", "lastName": "Doyle", "cellPhone":"8015924985", "disabled": false},
            {"id": 25, "firstName": "Lindsay", "lastName": "Curtin", "cellPhone":"7143253533", "disabled": false},
            {"id": 26, "firstName": "Nicole", "lastName": "Sheahan", "cellPhone":"4063814661", "disabled": false},
            {"id": 27, "firstName": "Trista", "lastName": "Harrison", "cellPhone":"8016747310", "disabled": false},
            {"id": 28, "firstName": "Jake", "lastName": "Larson", "cellPhone":"8017353312", "disabled": false},
            {"id": 29, "firstName": "Lisa", "lastName": "Wieboldt", "cellPhone":"8012449977", "disabled": true},
            {"id": 30, "firstName": "Kevin", "lastName": "Doyle", "cellPhone":"8015924985", "disabled": true},
            {"id": 31, "firstName": "Aaron", "lastName": "Michaelis", "cellPhone":"8014738587", "disabled": true},
            {"id": 32, "firstName": "Steve", "lastName": "Stott", "cellPhone":"9086166652", "disabled": true},
            {"id": 33, "firstName": "Joseph", "lastName": "Mena", "cellPhone":"4355749483", "disabled": true},
            {"id": 34, "firstName": "Andrew", "lastName": "Morrill", "cellPhone":"8013694480", "disabled": true},
            {"id": 35, "firstName": "Caitlin", "lastName": "Shurtleff ", "cellPhone":"5303860618", "disabled": true},
            {"id": 36, "firstName": "Kristen", "lastName": "Montgomery", "cellPhone":"8014731024", "disabled": true},
            {"id": 37, "firstName": "Jarom", "lastName": "Bridges", "cellPhone":"8016361232", "disabled": true},
            {"id": 38, "firstName": "Casey", "lastName": "Meyer", "cellPhone":"8019952198", "disabled": true},
            {"id": 39, "firstName": "Tania", "lastName": "Van Orden ", "cellPhone":"2174543736", "disabled": true},
            {"id": 40, "firstName": "Nelson", "lastName": "Villegas", "cellPhone":"8014046928", "disabled": true},
            {"id": 41, "firstName": "Anthony", "lastName": "Lopez", "cellPhone":"8012288012", "disabled": true},
            {"id": 42, "firstName": "Rose", "lastName": "Stanek", "cellPhone":"3602712875", "disabled": true},
            {"id": 43, "firstName": "Becca", "lastName": "Batty", "cellPhone":"8014723439", "disabled": true},
            {"id": 44, "firstName": "Liz", "lastName": "Batty", "cellPhone":"3852082117", "disabled": true},
            {"id": 45, "firstName": "Jessica", "lastName": "Sipherd", "cellPhone":"8014949155", "disabled": true},
            {"id": 46, "firstName": "Thomas", "lastName": "Doggett", "cellPhone":"8017090019", "disabled": true},
            {"id": 47, "firstName": "Edgar", "lastName": "Vasquez", "cellPhone":"8013199277", "disabled": true},
    ];
 
    db.collection('players', function(err, collection) {
        collection.insert(players, {safe:true}, function(err, result) {});
    });
 
};