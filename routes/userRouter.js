const router = require('express').Router()
const passport = require('passport')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const User = require('../models/user')
const Profile = require('../models/profile')
const createHttpError = require('http-errors')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
    },
})

const mailOptions = (url, email) => ({
    from: '"MERN Blog" <sadafkhan@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Cofirm your email address', // subject line
    html: `<p>Please verify your account by clicking <a href="${url}">this link</a>. If you are unable to do so, copy and paste the following link into your browser:</p><p>${url}</p>`,
    text:
        'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${url}',
})
router.post('/signup', (req, res, next) => {
    const { email, password } = req.body
    const origin = req.headers.origin
    let existingUser
    let savedUser
    User.findOne({ email })
        .then((user) => {
            if (user && !user.active) {
                existingUser = user
                throw createHttpError(
                    400,
                    'Registration Initiated But Email Not Verified'
                )
            } else if (user) {
                existingUser = user
                throw createHttpError(400, 'Email Already Registered')
            } else {
                return User.register(new User({ email }), password)
            }
        })
        .then((user) => {
            savedUser = user
            return jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
                expiresIn: '5m',
            })
        })
        .then((emailToken) => {
            //use this when hosting frontend to netlify
            //const url = `${origin}/confirm/${emailToken}`
            
            //use this when hosting frontend to github pages
            const url = `${origin}/${process.env.GITHUB_REPO_NAME}/#/confirm/${emailToken}`
            console.log(url)
            // send mail with defined transport object & mailOptions
            transporter.sendMail(mailOptions(url, email), (err, info) => {
                if (err) {
                    console.log('Error Sending Mail...\n' + err.stack)
                } else {
                    console.log('Mail Send Successfuly...')
                    console.log(info)
                }
            })
            res.status(201).json({
                success: true,
                message: 'A mail has been sent to you!',
                user: savedUser,
            })
        })
        .catch((err) => {
            if (existingUser) {
                res.status(err.status).json({
                    success: false,
                    message: err.message,
                    user: existingUser,
                })
            } else {
                console.log('Error Creating User...\n' + err.stack)
                next(createHttpError('Registration Failed'))
            }
        })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('Error Authenticating User...\n' + err.stack)
            next(createHttpError('Error Authenticating User'))
        } else if (!user) {
            let message
            if (info.name === 'IncorrectPasswordError')
                message = 'Password is incorrect'
            if (info.name === 'IncorrectUsernameError')
                message = 'Email not registered'
            res.status(401).json({
                success: false,
                message,
            })
        } else {
            Profile.findOne({ creator: user._id }, (err, profile) => {
                if (err) {
                    console.log('Error Authenticating User...\n' + err.stack)
                    next(createHttpError('Error Authenticating User'))
                } else {
                    const token = auth.getToken({ _id: user._id })
                    res.status(200).json({
                        success: true,
                        message: 'Login Successful!!',
                        token,
                        user,
                        profile,
                        expiresIn: 3600,
                    })
                }
            })
        }
    })(req, res, next)
})

router.get('/confirmEmail/:token', async (req, res, next) => {
    try {
        const payload = await jwt.verify(
            req.params.token,
            process.env.JWT_SECRET
        )
        User.findById(payload.user)
            .then((user) => {
                if (user) {
                    user.active = true
                    return user.save()
                } else {
                    throw createHttpError(400, 'User Not Registered')
                }
            })
            .then((user) => {
                res.status(200).json({
                    success: true,
                    status: 'Verification Successful!',
                })
            })
            .catch((err) => {
                console.log('Error Verifying Token...\n' + err.stack)
                next(createHttpError(err.message))
            })
    } catch (err) {
        console.log('Error Verifying Token...\n' + err.stack)
        next(createHttpError(400, 'Conformation link expired'))
    }
})

router.post('/resendEmail', (req, res, next) => {
    const origin = req.headers.origin
    const { _id, email } = req.body
    User.findById(_id)
        .then((user) => {
            if (user)
                return jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '5m',
                })
            else throw createHttpError(400, 'User Does Not Exist')
        })
        .then((emailToken) => {
            //use this when hosting frontend to netlify
            //const url = `${origin}/confirm/${emailToken}`
            
            //use this when hosting frontend to github pages
            const url = `${origin}/${process.env.GITHUB_REPO_NAME}/#/confirm/${emailToken}`
            console.log(url)
            // send mail with defined transport object & mailOptions
            return transporter.sendMail(mailOptions(url, email))
        })
        .then((info) => {
            console.log('Mail Send Successfuly...')
            console.log(info)
            res.status(200).json({
                success: true,
                status: 'Mail Sent Successfully!',
            })
        })
        .catch((err) => {
            if (err.status) {
                console.log('User Does Not Exist...\n')
                next(err)
            } else {
                console.log('Error Resending Mail...\n' + err.stack)
                next(createHttpError('Error Resending Mail'))
            }
        })
})
module.exports = router
