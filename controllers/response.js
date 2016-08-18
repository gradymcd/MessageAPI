exports.respond = function (res, success, code, message, data, err) {
	if (err)
		console.log(err);
	res
		.status(code)
		.type('application/json')
		.send(JSON.stringify({
			'success': success,
			'statusCode': code,
			'message': message,
			'data': data
		}))
	;
};