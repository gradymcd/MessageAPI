var passport = new require('passport');
var BasicStrategy = new require('passport-http').BasicStrategy;
var User = new require('../models/User');
var OAuth = require('../models/OAuth');

passport.use(new BasicStrategy(
	function (username, password, callback) {
		User.findOne({username: username}, function (err, user) {
			if (err) {
				return callback(err);
			}
			
			// No user found with that username
			if (!user) {
				return callback(null, false);
			}
			
			// Make sure the password is correct
			user.verifyPassword(password, function (err, isMatch) {
				if (err) {
					return callback(err);
				}
				
				// Password did not match
				if (!isMatch) {
					return callback(null, false);
				}
				
				// Success
				return callback(null, user);
			});
		});
	}
));

var PassportOAuthBearer = require('passport-http-bearer');

passport.use(new PassportOAuthBearer(
	function (token, done) {
		OAuth.AccessToken.findOne({token: token}).populate('user').populate('grant').exec(function (error, token) {
			if (token && token.active && token.grant.active && token.user) {
				done(null, token.user, {scope: token.scope});
			} else if (!error) {
				done(null, false);
			} else {
				done(error);
			}
		});
	})
);

passport.use('client-basic', new BasicStrategy(
	function (name, secret, callback) {
		OAuth.Application.findOne({name: name}, function (err, application) {
			if (err) {
				return callback(err);
			}
			
			// No client found with that id or bad password
			if (!application || application.secret !== secret) {
				return callback(null, false);
			}
			
			// Success
			return callback(null, application);
		});
	}
));

exports.isClientAuthenticated = passport.authenticate('client-basic', {session: false});
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], {session: false});

