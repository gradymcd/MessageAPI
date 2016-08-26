var router = require('express').Router();

var User = new require('../models/User');
var response = new require('./response');
var auth = require('./auth');

// This is very insecure and should never be used except for testing
router.post('/new', auth.isAuthenticated, function (req, res) {
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
});

router.get('/me', auth.isAuthenticated, function (req, res) {
	User.findById(req.user._id, '-password', function (err, user) {
		if (err) {
			response.respond(res, false, 500, null, null, err);
		} else {
			response.respond(res, true, 200, 'Found user', user);
		}
	})
});

router.post('/account', auth.isAuthenticated, function (req, res) {
	User.findById(req.user._id, function (err, user) {
		if (err) {
			response.respond(res, false, 500, null, null, err);
		} else {
			for (var i in req.body.prefs) {
				if (i != password) {
					user[i] = req.body.prefs[i];
				}
			}
		}
	})
});

module.exports = router;