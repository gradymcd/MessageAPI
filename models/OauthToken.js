// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema = new mongoose.Schema({
	value: {type: String, required: true},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	clientId: {type: String, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);
