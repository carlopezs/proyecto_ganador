const { db } = require('../cnn')

const getDatos = async (req, res) => {
    const response = await db.any(`select * from inscripciones;`)
    res.json(response)
}


module.exports = {
    getDatos
}

