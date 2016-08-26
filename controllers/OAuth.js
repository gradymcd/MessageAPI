var oauth2orize = require('oauth2orize');
var url = require('url');
var router = require('express').Router();
var passport = new require('passport');
var utils = require('../utils');
var auth = require('./auth');

var OAuth = require('../models/OAuth');

var server = oauth2orize.createServer();

server.grant(oauth2orize.grant.code(function (application, redirectURI, user, ares, done) {
	var grant = new OAuth.GrantCode({
		application: application,
		user: user,
		scope: ares.scope
	});
	grant.save(function (error) {
		done(error, error ? null : grant.code);
	});
}));

server.exchange(oauth2orize.exchange.code(function (application, code, redirectURI, done) {
	OAuth.GrantCode.findOne({code: code}, function (error, grant) {
		if (grant && grant.active && grant.application == application.id) {
			var token = new OAuth.AccessToken({
				client: grant.client,
				user: grant.user,
				grant: grant,
				scope: grant.scope
			});
			token.save(function (error) {
				done(error, error ? null : token.token, null, error ? null : {token_type: 'standard'});
			});
		} else {
			done(error, false);
		}
	});
}));

server.serializeClient(function (client, done) {
	return done(null, client.id);
});

server.deserializeClient(function (id, done) {
	OAuth.Application.findById(id, function (err, client) {
		if (err) {
			return done(err);
		}
		return done(null, client);
	});
});

router.get('/dialog/authorize', auth.isAuthenticated, server.authorize(function (clientID, redirect_uri, done) {
		OAuth.Application.findById(clientID, function (err, application) {
			console.log(clientID);
			if (err) {
				return done(err);
			}
			if (!application) {
				return done(null, false);
			}
			if (application.redirect_uri != redirect_uri) {
				return done(null, false);
			}
			return done(null, application, application.redirect_uri);
		});
	}),
	function (req, res) {
		res.render('oauth', {
			transactionID: req.oauth2.transactionID,
			user: req.user, client: req.oauth2.client
		});
	}
);

router.post('/dialog/authorize/decision', auth.isAuthenticated, server.decision());

router.post('/token', auth.isClientAuthenticated, server.token(), server.errorHandler());

module.exports = router;