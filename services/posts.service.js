var Post = require('../models/Post.model');

exports.getPosts = async function () { 
  try {
    var Posts = await Post.find({}, { 'content': 0, 'comments': 0 }, {sort: {postDate: -1}}, (err, result) => {
      return result;
    });

    return Posts;
  } catch (e) {
    throw Error('Error getPosts');
  }
}

exports.getPost = async function (id) { 
  try {
    var fullPost = await Post.findOneAndUpdate({ _id: id}, { $inc: { view: 1 } }, { new: true }, (err, result) => {
      return result;
    });
    return fullPost;
  } catch (e) {
    throw Error('Error getPost');
  }
};

exports.updatePost = async function (id, newPostData = {}) { 
  try {
    var fullPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $inc: { view: 1 },
        ...newPostData
      },
      { new: true },
      (err, result) => {
        return result;
      }
    );
    return fullPost;
  } catch (e) {
    throw Error('Error getPost');
  }
};


exports.removePost = async function (id) { 
  try {
    var deleted = await Post.remove({ _id: id })
    if (deleted.n === 0 && deleted.ok === 1) {
        throw Error("Post Could not be deleted")
    }
    return deleted;
  } catch (e) {
    throw Error("Error Occured while Deleting the Post")
  }
};

exports.createPost = async function (post) {
  var newPost = new Post({
      authorId: post.authorId,
      title: post.title,
      description: post.description,
      content: post.content,
      comments: [],
      postDate: new Date(),
      view: 0,
  });

  try {
      var savedPost = await newPost.save();

      return savedPost;
  } catch (e) {   
      throw Error("Error while Creating Post")
  }
};

exports.createComment = async function (id, newComment = {}) { 
  try {
    var updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      { $addToSet: { comments: newComment } },
      { new: true },
      (err, result) => {
        return result;
      }
    );
    return updatedPost;
  } catch (e) {
    throw Error('Error createComment');
  }
};


exports.removeComment = async function (postId, commentId) {
  try {
    var updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } },
      { new: true },
      (err, result) => {
        return result;
      }
    );
    return updatedPost;
  } catch (e) {
    throw Error('Error removeComment');
  }
};


exports.changeComment = async function (postId, newComment) {
  try {
    var updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $set: {[`comments.$[element]`]: newComment } },
      {
        new: true,
        multi:true,
        arrayFilters: [{ "element._id" : newComment._id }],
      },
      (err, result) => {
        return result;
      }
    );
    return updatedPost;
  } catch (e) {
    throw Error('Error changeComment', e);
  }
};

