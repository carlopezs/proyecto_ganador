const { db } = require('../cnn')
const fetch = require("node-fetch");


const getAjustes = async (req, res) => {
    const response = await db.any(`SELECT c.cab_id, c.cab_num, c.cab_descripcion, c.cab_fecha, c.cab_imp,d.det_cantidad, d.det_stock_registro
    from ajustes_cabecera c inner join ajustes_detalle d on c.cab_id=d.cab_id
    group by  c.cab_id, c.cab_num, c.cab_descripcion, c.cab_fecha, d.det_cantidad, d.det_stock_registro 
    order by c.cab_id;`)
    res.json(response)
}


const getAjustesWithOutImp = async (req, res) => {
  const response = await db.any(`SELECT c.cab_id, c.cab_num, c.cab_descripcion, c.cab_fecha, c.cab_imp
  from ajustes_cabecera c 
  order by c.cab_id;`)
  res.json(response)
}

const getAjustesByProd = async (req, res) => {
    const pro_id = req.params.pro_id
    const response = await db.any(`SELECT c.cab_num, c.cab_descripcion, c.cab_fecha, d.det_cantidad, d.det_stock_registro, d.pro_id ,p.pro_nombre
    from ajustes_cabecera c 
    inner join ajustes_detalle d on c.cab_id=d.cab_id
    inner join product p on d.pro_id=p.pro_id
    where p.pro_id=$1
    group by  c.cab_num, c.cab_descripcion, c.cab_fecha, d.det_cantidad, d.det_stock_registro, d.pro_id ,p.pro_nombre;`, [pro_id])
    res.json(response)
}

const getKardexByProduct = async (req,res) =>{
  const pro = req.params.pro_id;
  let kardexCompras = [];
  let kardexVentas = [];
  let kardexAjustes = [];
  let stock = 0
  let sum = 0
  const ajustes = await getAjustesByProd2(pro)
  ajustes.map(({cab_num, cab_descripcion, cab_fecha, det_cantidad})=>{
    kardexAjustes.push({
      cab_id_ajustes:cab_num, 
      cab_descripcion, 
      cab_fecha_factura:cab_fecha, 
      det_pro_cantidad:det_cantidad,
      stock
    })
  })

  const compras = await getComprasByProduct(pro)
  compras.map(({cab_id, cab_fecha_factura, inv_productos})=>{
    const detComp = inv_productos.filter(({det_pro_codigo})=>det_pro_codigo==pro)
    detComp.map(({det_pro_cantidad})=>{
      kardexCompras.push({
        cab_id_compras:cab_id,
        cab_fecha_factura,
        det_pro_cantidad,
        stock
      })
    })
    
  })

  const ventas = await getVentasByProduct(pro)
  ventas.billPayments.map(({bh_id, bh_date,bills_details})=>{
    const detVent = bills_details.filter(({bd_product_id})=>bd_product_id==pro)
    detVent.map(({bd_amount})=>{
      kardexVentas.push({
        cab_id_ventas:bh_id,
        cab_fecha_factura:bh_date,
        det_pro_cantidad:(bd_amount*-1),
        stock
      })
    })
    
  })
  const kardex = [...kardexAjustes,...kardexCompras,...kardexVentas]
  kardex.sort((a, b) => a.cab_fecha_factura > b.cab_fecha_factura)
  

  const kardexStock = kardex.map((res)=>{
    sum = sum + res.det_pro_cantidad
    res.stock = sum
  })
  console.log(kardex)
  res.json(kardex)
}

const getAjustesByProd2 = async (pro_id) => {
  const response = await db.any(`SELECT c.cab_num, c.cab_descripcion, c.cab_fecha, d.det_cantidad, d.det_stock_registro, d.pro_id ,p.pro_nombre
  from ajustes_cabecera c 
  inner join ajustes_detalle d on c.cab_id=d.cab_id
  inner join product p on d.pro_id=p.pro_id
  where p.pro_id=$1
  group by  c.cab_num, c.cab_descripcion, c.cab_fecha, d.det_cantidad, d.det_stock_registro, d.pro_id ,p.pro_nombre;`, [pro_id])
  return response;
}

const getVentasByProduct = async (pro_id) => {
  const url = `https://api-facturacion.herokuapp.com/facturacion/bills/byProductId?bd_product_id=${pro_id}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getComprasByProduct = async (pro_id) => {
  const url = `https://app-mod-com.herokuapp.com/compras/facturaByProduct/${pro_id}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getCabeceraById = async (req, res) => {
  const cab_id = req.params.cab_id
  const response = await db.any(`select * from ajustes_cabecera where cab_id=$1;`, [cab_id])
  res.json(response)
}

const getDetallesByCab = async (req, res) => {
  const cab_id = req.params.cab_id
  const response = await db.any(`select d.det_id, d.det_cantidad, d.cab_id, d.pro_id, p.pro_nombre, d.det_stock_registro
  from ajustes_detalle d 
  inner join product p on p.pro_id=d.pro_id
  where cab_id=$1
  group by d.det_id, p.pro_id;`, [cab_id])
  res.json(response)
}



const getNumeroID = async (req, res) => {
    const response = await db.any(`select max(cab_id) from ajustes_cabecera;`)
    const num = String(response[0].max+1)
    const num2=parseInt(String(num.length),10)
    const numeroIDCompleto ="";
    if(num2<5){
        this.numeroIDCompleto = "AJUS-"+String(num);
    };
    if(num2<4){
        this.numeroIDCompleto = "AJUS-0"+String(num);
    };
    if(num2<3){
        this.numeroIDCompleto = "AJUS-00"+String(num);
    };
    if(num2<2){
        this.numeroIDCompleto = "AJUS-000"+String(num);
    };
    return this.numeroIDCompleto
}

const getNumeroID2 = async (req, res) => {
  const response = await db.any(`select max(cab_id) from ajustes_cabecera;`)
  const num = String(response[0].max+1)
  const num2=parseInt(String(num.length),10)

  const numeroIDCompleto ="";
  if(num2<5){
      this.numeroIDCompleto = "AJUS-"+String(num);
  };
  if(num2<4){
      this.numeroIDCompleto = "AJUS-0"+String(num);
  };
  if(num2<3){
      this.numeroIDCompleto = "AJUS-00"+String(num);
  };
  if(num2<2){
      this.numeroIDCompleto = "AJUS-000"+String(num);
  };

  res.json(this.numeroIDCompleto)
}


const postCreateAjusteCabecera = async (req, res) => {
    
    const { cab_descripcion} = req.query;
    const sql = `INSERT INTO public.ajustes_cabecera(
        cab_num, cab_descripcion, cab_fecha, cab_imp)
        VALUES ($1, $2, current_timestamp, false);`;
    const resp =getNumeroID();
    const valores=(await resp).match().input;
    console.log(valores);
    try {
        const response = await db.any(sql, [String(valores), cab_descripcion]);
        res.json({
            message: "Cabecera creada con exito",
            body: {
            cabecera: { cab_descripcion },
            },
        });
    } catch (error) {
      res.json({
        error,
      });
    }
};



const postCreateAjusteDetalle = async (req, res) => {
    const { det_cantidad, pro_id,det_stock_registro} = req.query;
    const sql = `INSERT INTO public.ajustes_detalle(
      det_cantidad, cab_id, pro_id, det_stock_registro)
      VALUES ($1, (select max(cab_id) from ajustes_cabecera), $2, $3);`;
    try {
      const response = await db.any(sql, [det_cantidad, pro_id, det_stock_registro]);
      res.json({
        message: "Detalle creado con exito",
        body: {
          detalle: { det_cantidad, pro_id,det_stock_registro },
        },
      });
    } catch (error) {
      res.json({
        error,
      });
    }
};


const putUpdateCabecera = async (req, res) => {
  const {cab_id, cab_descripcion } = req.query;
  const sql = `UPDATE public.ajustes_cabecera
                SET  cab_descripcion=$2
                WHERE cab_id=$1;`;
  try {
    const response = await db.any(sql, [cab_id, cab_descripcion ]);
    res.json({
      message: "Cabecera actualizada con exito!!",
      body: {
        cabecera: { cab_id, cab_descripcion   },
      },
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

const putUpdateCabeceraImp = async (req, res) => {
  const {cab_id } = req.query;
  const sql = `UPDATE public.ajustes_cabecera SET  cab_imp=true WHERE cab_id=$1;`;
  try {
    const response = await db.any(sql, [cab_id]);
    res.json({
      message: "Cabecera actualizada con exito!!",
      body: {
        cabecera: { cab_id  },
      },
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

const putUpdateDetalle = async (req, res) => {
  const {det_id, det_cantidad, det_stock_registro } = req.query;
  const sql = `UPDATE public.ajustes_detalle
                SET  det_cantidad=$2, det_stock_registro=$3
                WHERE det_id=$1;`;
  try {
    const response = await db.any(sql, [det_id, det_cantidad, det_stock_registro ]);
    res.json({
      message: "Detalle actualizado con exito!!",
      body: {
        detalle: { det_id, det_cantidad, det_stock_registro },
      },
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};


const deleteDetalle = async (req, res) => {
  const {det_id} = req.query;

  const sql = `DELETE FROM public.ajustes_detalle
	              WHERE det_id=$1;`;
  try {
    const response = await db.any(sql, [det_id]);
    res.json({
      message: "Detalle eliminado con exito!!",
      body: {
        detalle: { det_id},
      },
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

module.exports = {
    getAjustes,
    getCabeceraById,
    getAjustesWithOutImp,
    getAjustesByProd,
    postCreateAjusteDetalle,
    postCreateAjusteCabecera,
    getNumeroID2,
    getDetallesByCab,
    putUpdateCabecera,
    putUpdateCabeceraImp,
    putUpdateDetalle,
    deleteDetalle,
    getKardexByProduct
}

