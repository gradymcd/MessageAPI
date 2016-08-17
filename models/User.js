var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var gravatar = require('gravatar');

var User = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {type: String},
	rooms: [{type: mongoose.Schema.Types.ObjectId, ref: 'Room'}],
	blockedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	realName: {type: String, default: this.username},
	avatar: {type: String, default: gravatar.url(this.email) + '.png'}
	
});

User.methods.verifyPassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

User.pre('save', function (callback) {
	var user = this;
	
	if (!user.isModified('password')) return callback();
	
	bcrypt.genSalt(5, function (err, salt) {
		if (err) return callback(err);
		
		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

// Export the Mongoose model
module.exports = mongoose.model('User', User);
