var mongoose = require('mongoose');

var Room = new require('../models/Room');
var User = new require('../models/User');
var response = new require('./response');

exports.get = function (req, res) {
	verifyUser(res, req.params.room, req.user._id, '', function (member, room) {
		response.respond(res, true, 200, 'Found room', room);
	});
};

exports.post_create = function (req, res) {
	var room = new Room();
	if (req.body.message == '' || req.body.message == undefined) {
		room.messages.push({
			message: 'Room created',
			sender: mongoose.Types.ObjectId(req.user._id),
			mime: 'text/plain'
		});
	} else {
		room.messages.push({
			message: req.body.message,
			sender: mongoose.Types.ObjectId(req.user._id),
			mime: req.body.mime,
		});
	}
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
	room.save(function (err) {
		if (err) {
			response.respond(res, false, 500, 'Internal server error', null, err);
		}
		else {
			User.findById(req.user._id, function (err, user) {
				if (err) {
					response.respond(res, false, 500, 'Internal server error', null, err);
				} else {
					user.rooms.push(room._id);
					user.save(function (err) {
						if (err) {
							response.respond(res, false, 500, 'Internal server error', null, err);
						} else {
							response.respond(res, true, 200, 'Created room', {'id': room._id});
						}
					});
				}
			});
		}
	});
};

exports.post_message = function (req, res) {
	verifyUser(res, req.params.room, req.user._id, 'sendMessage', function (member, room) {
		room.messages.push({
			message: req.body.message,
			sender: mongoose.Types.ObjectId(req.user._id),
			mime: req.body.mime
		});
		
		room.save(function (err) {
			if (err) {
				response.respond(res, false, 500, 'Internal server error', null, err);
			}
			else {
				response.respond(res, true, 200, 'Sent message', {'id': room.messages[room.messages.length - 1]._id})
			}
		});
	});
};

exports.get_message = function (req, res) {
	verifyUser(res, req.params.room, req.user._id, null, function (member, room) {
		response.respond(res, true, 200, 'Found message', {'message': room.messages.id(req.params.message)});
	});
};

var verifyUser = function (res, roomId, userId, permission, callback) {
	Room.findById(roomId, function (err, room) {
		if (err) {
			response.respond(res, false, 500, 'Internal server error', null, err);
		} else {
			if (!room) {
				response.respond(res, false, 404, 'Room not found');
			} else {
				room.findMemberById(userId, function (member) {
					if (!member) {
						response.respond(res, false, 403, 'User not in room');
					}
					else if (member.permissions[permission] == false) {
						response.respond(res, false, 403, 'No permission');
					} else {
						callback(member, room);
					}
				});
			}
		}
	})
};