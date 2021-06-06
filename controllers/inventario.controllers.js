const { db } = require('../cnn')


const getProducts = async (req, res) => {
    const response = await db.any(`select p.pro_id, p.pro_nombre, p.pro_descripcion,p.pro_iva, p.pro_costo,p.pro_pvp, p.pro_activo, p.pro_stock 
    from product p order by p.pro_id;`)
    res.json(response)
}

const getProductsWithStock = async (req, res) => {
  const response = await db.any(`select p.pro_id, p.pro_nombre, p.pro_descripcion,p.pro_iva, p.pro_costo,p.pro_pvp, p.pro_activo, p.pro_stock 
  from product p where p.pro_stock>0  order by p.pro_id;`)
  res.json(response)
}

const getProductsById = async (req, res) => {
  const pro_id = req.params.pro_id;
  const response = await db.any(
    `select p.pro_id, p.pro_nombre, p.pro_descripcion,p.pro_iva, p.pro_costo,p.pro_pvp, p.pro_activo, p.pro_stock
    from product p WHERE pro_id=$1;`,
    [pro_id]
  );
  res.json(response);
};

  
  const postCreateProduct = async (req, res) => {
    const { pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo, pro_stock } = req.query;
    const sql = `INSERT INTO public.product(pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo, pro_stock)
	VALUES ($1, $2, $3, $4, $5, $6, $7);`;
    try {
      const response = await db.any(sql, [pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo, pro_stock]);
      res.json({
        message: "Producto creado con exito",
        body: {
          producto: { pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo, pro_stock },
        },
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  };
  
  const putUpdateProduct = async (req, res) => {
    const {pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo, pro_stock } = req.query;
  
    const sql = `UPDATE public.product SET pro_nombre=$2, pro_descripcion=$3, pro_iva=$4, pro_costo=$5, 
    pro_pvp=$6, pro_activo=$7, pro_stock=$8
	WHERE pro_id=$1;`;
    try {
      const response = await db.any(sql, [pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo, pro_stock ]);
      res.json({
        message: "Producto actualizado con exito!!",
        body: {
          producto: { pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo, pro_stock  },
        },
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  };


  const putUpdateProductSinStock = async (req, res) => {
    const {pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo} = req.query;
  
    const sql = `UPDATE public.product SET pro_nombre=$2, pro_descripcion=$3, pro_iva=$4, pro_costo=$5, 
    pro_pvp=$6, pro_activo=$7
	WHERE pro_id=$1;`;
    try {
      const response = await db.any(sql, [pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo]);
      res.json({
        message: "Producto actualizado con exito!!",
        body: {
          producto: { pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_activo},
        },
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  };
  
  const deleteDeleteProducto = async (req, res) => {
    const {pro_id} = req.query;
  
    const sql = `DELETE FROM public.product
	WHERE pro_id=$1;`;
    try {
      const response = await db.any(sql, [pro_id]);
      res.json({
        message: "Producto eliminado con exito!!",
        body: {
          producto: { pro_id},
        },
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  };

module.exports = {
    getProducts,
    getProductsById,
    postCreateProduct,
    putUpdateProduct,
    putUpdateProductSinStock,
    deleteDeleteProducto,
    getProductsWithStock
}

