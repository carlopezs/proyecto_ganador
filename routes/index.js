const {Router} = require('express')
const { getProducts, getProductsById, postCreateProduct, putUpdateProduct, deleteDeleteProducto} = require('../controllers/inventario.controllers')
const route = Router()

route.get('/',(req,res) => {
    res.send('Welcome API-REST Inventario!!!!')})

route.get('/productos',getProducts)
route.get('/productos/:id', getProductsById)
route.post('/productos', postCreateProduct)
route.put('/productos', putUpdateProduct)
route.delete('/productos', deleteDeleteProducto)


module.exports = route