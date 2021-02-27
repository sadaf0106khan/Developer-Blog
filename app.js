const express = require('express')
const http = require('http')
const cors = require('cors')
const path = require('path')
const createHttpError = require('http-errors')
const mongoose = require('mongoose')
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')
const profileRouter = require('./routes/profileRouter')
const passport = require('passport')
require('./middlewares/auth')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
}
app.options('*', cors(corsOptions))
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
})
app.use(passport.initialize())
app.use('/', userRouter)
app.use('/post', postRouter)
app.use('/profile', profileRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createHttpError(404))
})

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.json({ success: false, message: err.message })
})
const url = process.env.MONGODB_URL
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
}
mongoose.connect(url, dbOptions).then(
    (db) => {
        console.log('Connected to server')
    },
    (err) => {
        console.log(err)
    }
)
const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`listening on ${port}`)
})
