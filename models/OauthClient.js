// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var ClientSchema = new mongoose.Schema({
	name: {type: String, unique: true, required: true},
	id: {type: String, required: true},
	secret: {type: String, required: true},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('OauthClient', ClientSchema);
