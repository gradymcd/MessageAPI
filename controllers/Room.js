var mongoose = require('mongoose');

var Room = new require('../models/Room');

exports.get = function (req, res) {
	/*Room.find({'users._id': mongoose.Types.ObjectId(req.user._id)}, function (err, user) {
	 res.send(user);
	 });*/
	Room.findById(req.params.room, function (err, room) {
		if (room == null) {
			res.sendStatus(404);
		}
		else if (err) {
			res.send(err);
		}
		else {
			room.findMemberById(mongoose.Types.ObjectId(req.user._id), function (member) {
				if(req.user._id.toString() == member.id.toString()) {
					res.send(room);
				}
			});
		}
	});
};

exports.post_create = function (req, res) {
	console.warn("Warning: no checks have been implemented for creating a new Room. Shit could happen...");
	var room = new Room();
	
	room = new Room();
	room.messages.push({
		message: req.body.message,
		sender: mongoose.Types.ObjectId(req.user._id),
		mime: req.body.mime,
	});
	room.members.push({
		id: mongoose.Types.ObjectId(req.user._id),
		permissions: {
			operator: true,
			addUser: true,
			removeUser: true,
			sendMessage: true,
			sendPriorityMessage: true,
			changeTopic: true
		}
	});
	//if(req.body.)
	room.save(function (err) {
		if (err) {
			res.send(err);
		}
		else {
			res.send("yayyyy");
		}
	});
};

exports.post_message = function (req, res) {
	Room.findById(req.params.room, function (err, room) {
		if (err) {
			res.send(err);
		}
		else {
			room.findMemberById(req.user._id, function (member) {
				console.log(member);
				if (!member || !member.permissions.sendMessage) {
					res.sendStatus(403);
				} else {
					room.messages.push({
						message: req.body.message,
						sender: mongoose.Types.ObjectId(req.user._id),
						mime: req.body.mime
					});
					
					room.save(function (err) {
						if (err) {
							res.send(err);
						}
						else {
							res.json(room.messages[room.messages.length - 1]);
						}
					});
				}
			});
		}
	});
};

exports.get_message = function (req, res) {
	Room.findById(req.params.room, function (err, room) {
		if (err) {
			res.send(err);
		} else {
			res.json(room.messages.id(req.params.message));
		}
	});
};