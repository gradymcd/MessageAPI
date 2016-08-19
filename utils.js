exports.toObjectId = function (res, idStr, callback) { // Converts string to ObjectId
	if (idStr) { // To prevent error if idStr is null
		idStr = idStr.toString();
		if (idStr.length == 24 && idStr.match('[0-9A-Za-z]{24}')) {
			var idObj = require('mongoose').Types.ObjectId(idStr);
			if (callback)
				callback(idObj);
			else
				return idObj;
		}
		else if (res) {
			require('./controllers/response').respond(res, false, 400, 'Invalid ID', {'extended': 'The ID, \'' + idStr + '\' is invalid. Expected format is a MongoDB ObjectID'});
			return null;
		}
	}
};