const express = require('express')
const pgPromise = require('pg-promise')
const app = express()

//middlewears
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//routes
app.use(require('./routes/index'))

//Excecution
app.listen(3000)
console.log("Server running in http://localhost:3000")