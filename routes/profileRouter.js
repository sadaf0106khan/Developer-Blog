const router = require('express').Router()

const multer = require('multer')
const { verifyUser } = require('../middlewares/auth')
const Profile = require('../models/profile')
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

router.options((req, res) => res.sendStatus(200))
router.post(
    '/',
    verifyUser,
    multer({ storage: storage }).single('image'),
    (req, res, next) => {
        const url = 'https://' + req.hostname
        const { username, bio } = req.body
        const imageUrl = url + '/images/' + req.file.filename
        const creator = req.user._id
        const profile = new Profile({ username, bio, imageUrl, creator })
        Profile.findOne({ creator })
            .then((user) => {
                if (user) next(createHttpError(401, 'Profile Already Exist'))
                else return profile.save()
            })
            .then((profile) =>
                res.status(201).json({
                    success: true,
                    message: 'Profile created successfully',
                    profile,
                })
            )
            .catch((err) => {
                console.log('Error Creating Profile...\n' + err.stack)
                next(createHttpError('Error Creating Profile'))
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
        const { username, bio } = req.body
        const creator = req.user._id
        const profile = new Profile({
            _id,
            username,
            bio,
            imageUrl,
            creator,
        })

        Profile.updateOne({ _id, creator }, profile)
            .then((doc) => {
                if (doc)
                    res.status(200).json({
                        success: true,
                        message: 'Profile Updated Successfully!',
                        profile,
                    })
                else next(createHttpError('Error Upating Profile'))
            })
            .catch((err) => {
                console.log('Error Upating Profile...\n' + err.stack)
                next(createHttpError('Error Upating Profile'))
            })
    }
)

router.get('/', (req, res, next) => {
    Profile.find()
        .then((profiles) => {
            if (profiles)
                res.status(200).json({
                    success: true,
                    message: 'Profiles Fetched Successfully!',
                    profiles,
                })
            else next(createHttpError(404, 'No Profile Found'))
        })
        .catch((err) => {
            console.log('Error Fetching Profiles...\n' + err.stack)
            next(createHttpError('Error Fetching Profiles'))
        })
})
module.exports = router
