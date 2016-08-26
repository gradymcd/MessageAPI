var mongoose = require('mongoose');
var router = require('express').Router();

var Room = new require('../models/Room');
var User = new require('../models/User');
var response = require('./response');
var utils = require('../utils');
var auth = require('./auth');

router.get('/:room', auth.isAuthenticated, function (req, res) {
	verifyUser(res, req.params.room, req.user._id, '', function (member, room) {
		response.respond(res, true, 200, 'Found room', room);
	});
});

router.post('/create', auth.isAuthenticated, function (req, res) {
	var room = new Room();
	if (req.body.message == '' || req.body.message == undefined) {
		room.messages.push({
			message: 'Room created',
			sender: utils.toObjectId(res, req.user._id),
			mime: 'text/plain'
		});
	} else {
		room.messages.push({
			message: req.body.message,
			sender: utils.toObjectId(res, req.user._id),
			mime: req.body.mime
		});
	}
	room.members.push({
		id: utils.toObjectId(res, req.user._id),
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
					response.respond(res, false, 500, null, null, err);
				} else {
					user.rooms.push(room._id);
					user.save(function (err) {
						if (err) {
							response.respond(res, false, 500, null, null, err);
						} else {
							response.respond(res, true, 200, 'Created room', {'id': room._id});
						}
					});
				}
			});
		}
	});
});

router.post('/message', auth.isAuthenticated, function (req, res) {
	verifyUser(res, req.params.room, req.user._id, 'sendMessage', function (member, room) {
		room.messages.push({
			message: req.body.message,
			sender: utils.toObjectId(res, req.user._id),
			mime: req.body.mime
		});
		room.save(function (err) {
			if (err) {
				response.respond(res, false, 500, null, null, err);
			}
			else {
				response.respond(res, true, 200, 'Sent message', {'id': room.messages[room.messages.length - 1]._id})
			}
		});
	});
});

router.get('/message', auth.isAuthenticated, function (req, res) {
	verifyUser(res, req.params.room, req.user._id, '', function (member, room) {
		response.respond(res, true, 200, 'Found message', {'message': room.messages.id(req.params.message)});
	});
});

router.post('/member/add', auth.isAuthenticated, function (req, res) {
	verifyUser(res, req.params.room, req.user._id, 'addUser', function (member, room) {
		utils.toObjectId(res, req.body.id, function (id) {
			User.findById(id, function (err, user) {
				if (!user) {
					response.respond(res, false, 404, 'User not found', {'extended': 'A user with the ID, \'' + id + '\' does not exist'});
				} else if (room.hasUser(id)) {
					response.respond(res, false, 400, 'User already in room', {'extended': 'A user with the ID, \'' + id + '\' is already in the room'});
				} else {
					// There should probably be checks for the permissions, but I didn't really feel like adding them
					if (req.body.permissions)
						room.members.push({'id': id, 'permissions': req.body.permissions});
					else
						room.members.push({'id': id});
					room.save(function (err) {
						if (err)
							response.respond(res, false, 500, null, null, err);
						else
							response.respond(res, true, 200, 'User added', {'id': id});
					});
				}
			});
		});
	});
});

router.get('/member', auth.isAuthenticated, function (req, res) {
	verifyUser(res, req.params.room, req.user._id, '', function (member, room) {
		
	});
});

var verifyUser = function (res, roomIdStr, userIdStr, permission, callback) {
	utils.toObjectId(res, roomIdStr, function (roomId) {
		Room.findById(roomId, function (err, room) {
			if (err) {
				response.respond(res, false, 500, null, null, err);
			} else {
				if (!room) {
					response.respond(res, false, 404, 'Room not found', {'extended': 'A room with the ID, \'' + roomId + '\' was not found on the server. Maybe it was deleted?'});
				} else {
					utils.toObjectId(res, userIdStr, function (userId) {
						room.findMemberById(userId, function (member) {
							if (!member) {
								response.respond(res, false, 403, 'User not in room', {'extended': 'A user with the ID, \'' + userId + '\' was not found in the room. It is possible the user was previously in the room, but was removed'});
							}
							else if (member.permissions[permission] == false) {
								response.respond(res, false, 403, 'No permission', {'extended': 'The permission \'' + permission + '\' is required to do that.'});
							} else {
								callback(member, room);
							}
						});
					});
				}
			}
		});
	});
};

module.exports = router;
