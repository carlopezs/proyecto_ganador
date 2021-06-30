const pgPromise = require("pg-promise");

/* const config = {
    host: 'localhost',
    port: '5432',
    database: 'stock',
    user: 'postgres',
    password: ''
} */

const config = {
  host: 'databasejg.cjdcw0u0axpy.us-east-2.rds.amazonaws.com',
  port: '5432',
  database: 'ecuador_bdd',
  user: 'postgres',
  password: '12345678'
}



/* const config = {
  connectionString:
    "postgres://fuagkvarykkvnv:19991ee6e0785925a0e0a92e4c6f41413f040b98127659738d0f5684cec09706@ec2-18-214-195-34.compute-1.amazonaws.com:5432/da0keclgv0oob3",
}; */



const pgp = pgPromise({});
const db = pgp(config);
exports.db = db;
