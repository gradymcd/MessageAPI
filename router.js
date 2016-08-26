
var router = express.router();

router.get('/', function (req, res) {
	res.json({message: 'Wooooooo!!!!!!!!!! Through some sorcery, this actually worked and seems to still not be broken if you are seeing this message.'});
});

//Routes
router.route('/test').get(authController.isAuthenticated, function (req, res) {
	res.send(req.user._id);
});

//Room
router.route('/room/create')
	.post(authController.isAuthenticated, roomController.post_create);
router.route('/room/:room').get(authController.isAuthenticated, roomController.get);
router.route('/room/:room/message')
	.post(authController.isAuthenticated, roomController.post_message);
router.route('/room/:room/message/:message')
	.get(authController.isAuthenticated, roomController.get_message);
router.route('/room/:room/member/add')
	.post(authController.isAuthenticated, roomController.post_member_add);
router.route('/room/:room/member/:member')
	.get(authController.isAuthenticated, roomController.get_member);

//User
router.route('/user')
	.post(userController.post_users);
router.route('/account')
	.get(authController.isAuthenticated, userController.get_account)
	.post(authController.isAuthenticated, userController.post_account);