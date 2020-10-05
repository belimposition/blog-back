var express = require('express')
var router = express.Router()
var UsersController = require('../../controllers/users.controller');

router.post('/registration', UsersController.createUser);
router.post('/login', UsersController.loginUser);
router.post('/logout', UsersController.logoutUser);
router.post('/auth', UsersController.authUser);

module.exports = router;
