const pgPromise = require('pg-promise')
/* const config = {
    host: 'localhost',
    port: '5432',
    database: 'supermarket',
    user: 'postgres',
    password: ''
}
 */
const config = {
    host: 'ec2-18-214-195-34.compute-1.amazonaws.com',
    port: '5432',
    database: 'da0keclgv0oob3',
    user: 'fuagkvarykkvnv',
    password: ''
}
const pgp = pgPromise({})
const db = pgp(config)

exports.db = db