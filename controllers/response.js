exports.respond = function (res, success, code, message, data, err) {
	if (err)
		console.log(err);
	if (code == 500) {
		if (!success)
			success = false;
		if (!message)
			message = 'Internal server error';
		if (!data)
			data = {'extended': 'A bug seems to have crawled into the server. This is not your fault.'};
	}
	res
		.status(code)
		.type('application/json')
		.send(JSON.stringify({
			'success': success,
			'statusCode': code,
			'message': message,
			'data': data || null
		}))
	;
};