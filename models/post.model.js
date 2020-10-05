var mongoose = require('mongoose')

var PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    authorId: String,
    comments: [{
        _id: String,
        userName: String,
        authorId: String,
        message: String,
        createDate: Date,
    }],
    postDate: Date,
    view: Number,
});

const Post = mongoose.model('Posts', PostSchema)

module.exports = Post;
