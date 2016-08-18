// Load required packages
var User = require('../models/User');

// Create endpoint /api/users for POST
exports.post_users = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    rooms: []
  });

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: user._id });
  });
};