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

module.exports = {
    getAjustes,
    getAjustesWithOutImp,
    getAjustesByProd,
    postCreateAjusteDetalle,
    postCreateAjusteCabecera,
    getNumeroID2
}

