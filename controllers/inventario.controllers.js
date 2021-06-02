const { db } = require('../cnn')

const getProducts = async (req, res) => {
    const response = await db.any(`select p.pro_id, p.pro_nombre, p.pro_descripcion,p.pro_iva, 
    p.pro_costo,p.pro_pvp, p.pro_activo, p.pro_stock 
    from product p order by p.pro_id;`)
    res.json(response)
}

module.exports = {
    getProducts
}