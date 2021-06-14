const { db } = require('../cnn')


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
  where  c.cab_imp=false or c.cab_imp=null
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
    //console.log(num)
    const num2=parseInt(String(num.length),10)
    //console.log(num2)
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
    //console.log(this.numeroIDCompleto)
    return this.numeroIDCompleto
}

const getNumeroID2 = async (req, res) => {
  const response = await db.any(`select max(cab_id) from ajustes_cabecera;`)
  const num = String(response[0].max+1)
  //console.log(num)
  const num2=parseInt(String(num.length),10)
  //console.log(num2)
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
  //console.log(this.numeroIDCompleto)
  res.json(this.numeroIDCompleto)
}


const postCreateAjusteCabecera = async (req, res) => {
    
    const { cab_descripcion} = req.query;
    const sql = `INSERT INTO public.ajustes_cabecera(
        cab_num, cab_descripcion, cab_fecha, cab_imp)
        VALUES ($1, $2, current_timestamp, false);`;
    const resp =getNumeroID();
    const valores=(await resp).match().input;
    const idCabecera =parseInt( valores.toString().split('-')[1]);
    try {
        const response = await db.any(sql, [String(valores), cab_descripcion]);
        res.json({
            message: "Cabecera creada con exito",
            body: {
            cabecera: { cab_descripcion,idCabecera},
            },
        });
    } catch (error) {
      res.json({
        error,
      });
    }
};



const postCreateAjusteDetalle = async (req, res) => {
    const { det_cantidad, cab_id, pro_id,det_stock_registro} = req.query;
    const sql = `INSERT INTO public.ajustes_detalle(
      det_cantidad, cab_id, pro_id, det_stock_registro)
      VALUES ($1, $2, $3, $4);`;
    try {
      const response = await db.any(sql, [det_cantidad, cab_id, pro_id, det_stock_registro]);
      res.json({
        message: "Detalle creado con exito",
        body: {
          detalle: { det_cantidad, cab_id, pro_id,det_stock_registro },
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
    deleteDetalle
}

