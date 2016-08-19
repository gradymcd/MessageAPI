var User = new require('../models/User');
var response = new require('./response');

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
			response.respond(res, false, 500, 'Internal server error', null, err);
		} else {
			response.respond(res, true, 200, 'Found user', user);
		}
	})
};
