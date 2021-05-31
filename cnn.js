const pgPromise = require("pg-promise");
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
  password: '19991ee6e0785925a0e0a92e4c6f41413f040b98127659738d0f5684cec09706'
}

/* const config = {
  connectionString:
    "postgres://fuagkvarykkvnv:19991ee6e0785925a0e0a92e4c6f41413f040b98127659738d0f5684cec09706@ec2-18-214-195-34.compute-1.amazonaws.com:5432/da0keclgv0oob3",
}; */



const pgp = pgPromise({});
const db = pgp(config);
exports.db = db;
