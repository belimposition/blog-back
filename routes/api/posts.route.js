var express = require('express')
var router = express.Router()
var PostsController = require('../../controllers/posts.controller');
var Authorization = require('../../auth/authorization');

router.get('/', PostsController.getPosts);
router.post('/create', Authorization, PostsController.createPost);
router.get('/:id', PostsController.getPost);
router.delete('/:id', Authorization, PostsController.removePost);
router.put('/:id', Authorization, PostsController.updatePost);
router.put('/comment/:id', Authorization, PostsController.createComment);
router.put('/comment/:id/remove', Authorization, PostsController.removeComment);
router.put('/comment/:id/change', Authorization, PostsController.changeComment);

module.exports = router;
