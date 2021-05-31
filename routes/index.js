const {Router} = require('express')
const { getProducts } = require('../controllers/inventario.controllers')
const route = Router()

route.get('/',(req,res) => {
    res.send('Welcome API-REST Inventario!!!!')})

route.get('/productos',getProducts)


module.exports = route