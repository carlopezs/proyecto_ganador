const {Router} = require('express')
const { getDatos } = require('../controllers/datos.controllers')

const route = Router()

route.get('/',(req,res) => {
    res.send('Welcome API-REST Inventario!!!!')})

route.get('/datos',getDatos)


module.exports = route