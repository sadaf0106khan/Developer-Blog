const router = require('express').Router()
const Post = require('../models/post')
const { verifyUser } = require('../middlewares/auth')
const multer = require('multer')
const createHttpError = require('http-errors')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]

        let error = new Error('Invalid mime type')
        if (isValid) {
            error = null
        }
        cb(error, 'public/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-')

        console.log(name)
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + ext)
    },
})

router.post(
    '/',
    verifyUser,
    multer({ storage: storage }).single('image'),
    (req, res, next) => {
        const url = 'https://' + req.hostname
        const { title, content, postDate } = req.body
        const creator = req.user._id
        const imageUrl = url + '/images/' + req.file.filename
        const post = new Post({ title, content, imageUrl, creator })
        post.save()
            .then((post) =>
                res
                    .status(201)
                    .json({
                        success: true,
                        message: 'Post added successfully',
                        post,
                    })
            )
            .catch((err) => {
                console.log('Error Adding Post...\n' + err.stack)
                next(createHttpError('Error Adding Post'))
            })
    }
)
router.put(
    '/:id',
    verifyUser,
    multer({ storage: storage }).single('image'),
    (req, res, next) => {
        let imageUrl = req.body.imageUrl
        if (req.file) {
            const url = 'https://' + req.hostname
            imageUrl = url + '/images/' + req.file.filename
        }
        const _id = req.params.id
        const creator = req.user._id
        const { title, content, postDate } = req.body
        const post = new Post({
            _id,
            title,
            content,
            imageUrl,
            creator,
        })

        Post.updateOne({ _id, creator }, post)
            .then((doc) => {
                if (doc)
                    res.status(200).json({
                        success: true,
                        message: 'Post Updated Successfully!',
                        post,
                    })
                else next(createHttpError('Error Upating Post'))
            })
            .catch((err) => {
                console.log('Error Upating Post...\n' + err.stack)
                next(createHttpError('Error Upating Post'))
            })
    }
)
router.get('/', (req, res, next) => {
    Post.find({})
        .populate('comments.author')
        .then((posts) => {
            if (posts)
                res.status(200).json({
                    success: true,
                    message: 'Posts Fetched Successfully',
                    posts,
                })
            else next(createHttpError(404, 'No Posts found'))
        })
        .catch((err) => {
            console.log('Error Fetching Posts...\n' + err.stack)
            next(createHttpError('Error Fetching Posts'))
        })
})
router.post(
    '/:id/comment',
    verifyUser,
    multer({ storage: storage }).single('image'),
    (req, res, next) => {
        const { comment, author } = req.body
        Post.findById(req.params.id)
            .then((post) => {
                if (post != null) {
                    post.comments.push({ comment, author })
                    return post.save()
                } else {
                    throw createHttpError(400, 'Post not found with given id')
                }
            })
            .then((post) => {
                return Post.findById(post._id).populate('comments.author')
            })
            .then((post) => {
                res.status(201).json({
                    success: true,
                    message: 'Comment added successfully',
                    post,
                })
            })
            .catch((err) => {
                if (err.status) {
                    next(err)
                } else {
                    console.log('Error adding comment...\n' + err.stack)
                    next(createHttpError('Error adding comment'))
                }
            })
    }
)
router.get('/:id/like', verifyUser, (req, res, next) => {
    let message
    const author = req.user._id
    Post.findById(req.params.id)
        .then((post) => {
            if (post != null) {
                const like = post.likes.filter(
                    (e) => e.author.toString() === author.toString()
                )
                if (like.length === 0) {
                    post.likes.push({ author })
                    message = 'Post liked successfully'
                } else {
                    post.likes.id(like[0]._id).remove()
                    message = 'Post unliked successfully'
                }
                return post.save()
            } else {
                throw createHttpError(400, 'Post not found with given id')
            }
        })
        .then((post) => {
            return Post.findById(post._id).populate('comments.author')
        })
        .then((post) => {
            res.status(201).json({
                success: true,
                message,
                post,
            })
        })
        .catch((err) => {
            if (err.status) {
                next(err)
            } else {
                console.log('Error liking post...\n' + err.stack)
                next(createHttpError('Error liking post'))
            }
        })
})
module.exports = router
