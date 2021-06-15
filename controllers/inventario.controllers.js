const { db } = require('../cnn')
const fetch = require("node-fetch");
const { put } = require('../routes');

const getProducts = async (req, res) => {
    const a1 = await putUpdateMoreStock()
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
  /*const a1 =await getVentasByProduct(pro_id) 
  const a2 =await getComprasByProduct(pro_id) 
  const a3 =await getDetallesByProduct(pro_id) 
  const a4 =await getCantProducts()
  console.log("Respuesta: "+(a1+a2+a3))*/
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


  const getStockById = async (pro_id,req, res) => {
    const response = await db.any(`select p.pro_stock from product p where p.pro_id=$1;`,[pro_id])
    const num = response
    return num
  }

  const putUpdateMoreStock = async () => {

    /*const ventas =await getVentasByProduct(pro_id) 
    const compras =await getComprasByProduct(pro_id) 
    const detalles =await getDetallesByProduct(pro_id) */
    const cantidad =await getCantProducts()

    const sql = `UPDATE public.product  set pro_stock=$2 WHERE pro_id=$1;`;

    try {

      for(var i = 1; i <=cantidad; i++ ){
        const ventas =await getVentasByProduct(i)
        const compras =await getComprasByProduct(i) 
        const detalles =await getDetallesByProduct(i) 
        console.log("Respuesta: "+(ventas+compras+detalles)+" Del producto: "+i)
        const response = await db.any(sql, [i, (ventas+compras+detalles) ]);
      }

    } catch (error) {
      console.log(error)
    }
  };


  
  const getVentasByProduct = async (pro_id) => {
    const url = `https://api-facturacion.herokuapp.com/facturacion/bills/byProductId?bd_product_id=${pro_id}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(typeof data)
    //console.log(data.billPayments)
    let sum = 0
    data.billPayments.map(({bills_details})=>{
      bills_details.map(({bd_amount})=>{
        //console.log(bd_amount)
        sum = sum + bd_amount
      })
    })
    sum = sum * -1
    console.log("Venta: "+sum)
    return sum;
  };

  const getComprasByProduct = async (pro_id) => {
    const url = `https://app-mod-com.herokuapp.com/compras/facturaByProduct/${pro_id}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(typeof data)
    //console.log(data)
    let sum = 0
    data.map(({inv_productos})=>{
      inv_productos.map(({det_pro_cantidad})=>{
        //console.log(det_pro_cantidad)
        sum = sum + det_pro_cantidad
      })
    })
    console.log("Compra: "+sum)
    return sum;
  };

  const getDetallesByProduct = async (pro_id) => {
    const response = await db.any(
      `select sum(det_cantidad) from ajustes_detalle where pro_id=1;`,
      [pro_id]
    );
    const sum =  response[0]
    const res = parseInt(sum.sum)
    console.log("Detalle:"+res)
    return res;
  }

  const getCantProducts = async () => {
    const response = await db.any(
      `select max(pro_id) from product;;`
    );
    const res = response[0].max
    console.log("Cantidad:"+res)
    return res;
  }


module.exports = {
    getProducts,
    getProductsById,
    postCreateProduct,
    putUpdateProduct,
    putUpdateProductSinStock,
    deleteDeleteProducto,
    getProductsWithStock,
    putUpdateMoreStock
}

