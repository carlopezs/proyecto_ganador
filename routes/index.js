const {Router} = require('express')
const { getProducts, getProductsById, postCreateProduct, putUpdateProduct, putUpdateProductSinStock, deleteDeleteProducto, getProductsWithStock, putUpdateMoreStock } = require('../controllers/inventario.controllers')
const { getAjustes, getAjustesByProd, postCreateAjusteCabecera, postCreateAjusteDetalle, getAjustesWithOutImp, getNumeroID2, getDetallesByCab, putUpdateCabecera, putUpdateDetalle, deleteDetalle, getCabeceraById, putUpdateCabeceraImp, getKardexByProduct } = require('../controllers/ajustes.controllers')
const route = Router()

route.get('/',(req,res) => {
    res.send('Welcome API-REST Inventario!!!!')})

route.get('/productos',getProducts)
route.get('/kardex',getKardexByProduct)
route.put('/stock', putUpdateMoreStock)
route.get('/productos/stock',getProductsWithStock)
route.get('/productos/:pro_id', getProductsById)
route.post('/productos', postCreateProduct)
route.put('/productos', putUpdateProduct)
route.put('/productos/st', putUpdateProductSinStock)
route.delete('/productos', deleteDeleteProducto)

route.get('/ajustes', getAjustes)
route.get('/ajustes/cab/:cab_id', getCabeceraById)
route.get('/ajustes/woimp', getAjustesWithOutImp)
route.get('/ajustes/id', getNumeroID2)
route.get('/ajustes/:pro_id', getAjustesByProd)
route.get('/ajustes/det/:cab_id', getDetallesByCab)
route.post('/ajustes/cab', postCreateAjusteCabecera)
route.post('/ajustes/det', postCreateAjusteDetalle)
route.put('/ajustes/cab', putUpdateCabecera)
route.put('/ajustes/cab/imp', putUpdateCabeceraImp)
route.put('/ajustes/det', putUpdateDetalle)
route.delete('/ajustes/det', deleteDetalle)




module.exports = route