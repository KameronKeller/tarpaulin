const express = require('express')
const morgan = require('morgan')
const api = require('./api')
const app = express()

const port = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(express.json())
app.use('/', api)

app.listen(port, function () {
    console.log("== Server is running on port", port)
})