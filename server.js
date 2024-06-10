const express = require('express')
const morgan = require('morgan')
const api = require('./api')
const app = express()
const {rateLimiting } = require('./lib/tokenBucket')

const { connectToDb } = require('./lib/mongo')  

const port = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(express.json())

app.use(rateLimiting);
app.use('/', api)

app.use('*', function (req, res, next) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    })
})

connectToDb(function() {
    app.listen(port, function () {
        console.log("== Server is running on port", port)
    })
})
