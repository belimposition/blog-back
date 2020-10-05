var express = require('express');

var router = express.Router();
var users = require('./api/users.route');
var posts = require('./api/posts.route');

router.use('/users', users);
router.use('/posts', posts);

module.exports = router;
