const express = require('express')
const pgPromise = require('pg-promise')
const app = express()
const cors = require('cors')

//middlewears
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//core
app.use(cors())
//routes
app.use(require('./routes/index'))

//Excecution
/* app.listen(3000) */
app.listen(process.env.PORT || 3000)