const mysql  = require('mysql');

const URL_API = 'http://localhost:3000/api'
const DB_HOST = 'localhost'
const DB_USER = 'root'
const DB_PASSWORD = ''
const DB_NAME = 'typeorm'

const connection = mysql.createConnection({
  host     : DB_HOST,
  user     : DB_USER,
  password : DB_PASSWORD,
  database : DB_NAME
});

module.exports = {
  URL_API,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  connection
}
