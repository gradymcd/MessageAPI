var mongoose = require('mongoose');

var Message = new mongoose.Schema({
	message: String,
	sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	mime: {type: String, default: "text/plain"},
});


var Member = new mongoose.Schema({
	id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	permissions: {
		operator: {type: Boolean, default: false},
		addUser: {type: Boolean, default: false},
		removeUser: {type: Boolean, default: false},
		sendMessage: {type: Boolean, default: true},
		sendPriorityMessage: {type: Boolean, default: false},
		changeTopic: {type: Boolean, default: false}
	}
});

var Room = new mongoose.Schema({
		messages: [Message],
		members: [Member],
		topic: String,
		encryption: String
	},
	{timestamps: {createdAt: 'created_at'}}
);

Room.methods.findMemberById = function (id, callback) {
	for (var i = 0; i < this.members.length; i++) {
		var member = this.members[i];
		if (member.id.toString() == id.toString()) {
			callback(member);
		}
	}
};

module.exports = mongoose.model('Room', Room);
