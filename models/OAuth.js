var mongoose = require('mongoose');
var uid = require('uid2');

var ApplicationSchema = new mongoose.Schema({
	title: {type: String, required: true},
	name: {type: String, required: true},
	secret: {
		type: String, unique: true, default: function () {
			return uid(42);
		}
	},
	redirect_uri: {type: String, required: true}
});
var Application = mongoose.model('Application', ApplicationSchema);

var GrantCodeSchema = new mongoose.Schema({
	code: {
		type: String, unique: true, default: function () {
			return uid(24);
		}
	},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	application: {type: mongoose.Schema.Types.ObjectId, ref: 'Application'},
	scope: [{type: String}],
	active: {type: Boolean, default: true}
});
var GrantCode = mongoose.model('GrantCode', GrantCodeSchema);

var AccessTokenSchema = new mongoose.Schema({
	token: {
		type: String, unique: true, default: function () {
			return uid(124);
		}
	},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	application: {type: mongoose.Schema.Types.ObjectId, ref: 'Application'},
	grant: {type: mongoose.Schema.Types.ObjectId, ref: 'GrantCode'},
	scope: [{type: String}],
	expires: {
		type: Date, default: function () {
			var today = new Date();
			var length = 60; // Length (in minutes) of our access token
			return new Date(today.getTime() + length * 60000);
		}
	},
	active: {
		type: Boolean, get: function (value) {
			if (this.expires < new Date() || !value) {
				return false;
			} else {
				return value;
			}
		}, default: true
	}
});
var AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = {
	Application: Application,
	GrantCode: GrantCode,
	AccessToken: AccessToken
};