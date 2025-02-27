const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())

mongoose.connect("mongodb+srv://admin:1234@cluster0.5ojwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
