var mongoose = require('mongoose');
var PostsService = require('../services/posts.service');


exports.getPosts = async function (req, res, next) {
  try {
    var Posts = await PostsService.getPosts();
    return res.status(200).json({status: 200, data: Posts, message: "Succesfully Posts Recieved"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.createPost = async function (req, res, next) {
  try {
    const newPostData = {
      authorId: req.body.authorId,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
    };
    var Post = await PostsService.createPost(newPostData);
    return res.status(200).json({status: 200, data: Post, message: "Succesfully Post Created"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.getPost = async function (req, res, next) {
  const postId = req.params.id;
  

  try {
    var Post = await PostsService.getPost(postId);
    return res.status(200).json({status: 200, data: Post, message: "Succesfully Post Recieved"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.removePost = async function (req, res, next) {
  const postId = req.params.id;

  try {
    var Post = await PostsService.removePost(postId);
    return res.status(200).json({status: 200, data: Post, message: "Succesfully Post deleted"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.updatePost = async function (req, res, next) {
  const postId = req.params.id;
  const newPostData = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
  };

  try {
    var Post = await PostsService.updatePost(postId, newPostData);
    return res.status(200).json({status: 200, data: Post, message: "Succesfully Post updated"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};


exports.createComment = async function (req, res, next) {
  const postId = req.params.id;
  try {
    const newCommentData = {
      _id: mongoose.Types.ObjectId(),
      userName: req.body.userName,
      authorId: req.body.authorId,
      message: req.body.message,
      createDate: new Date(),
    };

    var newComment = await PostsService.createComment(postId, newCommentData);
    return res.status(200).json({status: 200, data: newComment, message: "Succesfully Post Created"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.removeComment = async function (req, res, next) {
  const postId = req.params.id;
  const commentId = req.body.commentId;

  try {
    var updatedPost = await PostsService.removeComment(postId, commentId);
    return res.status(200).json({status: 200, data: updatedPost, message: "Succesfully Post Removed"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};


exports.changeComment = async function (req, res, next) {
  const postId = req.params.id;
  const newComment = req.body.comment;

  try {
    var updatedPost = await PostsService.changeComment(postId, newComment);
    return res.status(200).json({status: 200, data: updatedPost, message: "Succesfully Comment Changed"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};


