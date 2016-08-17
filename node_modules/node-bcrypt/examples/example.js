var bcrypt = require('../');
var password = '123456';
var salt = bcrypt.gensalt();
var hashed = bcrypt.hashpw(password, salt);
console.log(hashed);
var suc = bcrypt.checkpw(password, hashed);
console.log(suc);
if (suc) {
	console.log('bcrypt success');
} else {
	console.log('bcrypt fail');
}