const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        },
    },
    {
        timestamps: true,
    }
)
const likeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})
const Post = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comments: [commentSchema],
        likes: [likeSchema],
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Post', Post)
