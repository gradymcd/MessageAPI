var User = new require('../models/User');
var response = new require('./response');

// This is very insecure and should never be used except for testing
exports.post_users = function (req, res) {
	var user = new User({
		username: req.body.username,
		password: req.body.password,
		rooms: []
	});
	
	user.save(function (err) {
		if (err)
			res.send(err);
		
		res.json({message: user._id});
	});
};

exports.get_account = function (req, res) {
	User.findById(req.user._id, '-password', function (err, user) {
		if (err) {
			response.respond(res, false, 500, null, null, err);
		} else {
			response.respond(res, true, 200, 'Found user', user);
		}
	})
};

exports.post_account = function (req, res) {
	User.findById(req.user._id, function (err, user) {
		if (err) {
			response.respond(res, false, 500, null, null, err);
		} else {
			for (var i in req.body.prefs) {
				if (i != password) {
					user[i] = prefs[i];
				}
			}
		}
		
	})
};