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

const cleanDB = () => {
  connection.query('DELETE FROM libros_pendientes', () => {})
  connection.query('DELETE FROM tutoriales_pendientes', () => {})
  connection.query('DELETE FROM editoriales', () => {})
  connection.query('DELETE FROM idiomas', () => {})
  connection.query('DELETE FROM temas', () => {})
  connection.query('DELETE FROM fabricantes', () => {})
}

const fillEditoriales = () => {
  connection.query('INSERT INTO editoriales SET ?', { id: 1, nombre: "Editorial 1" }, () => { })       
  connection.query('INSERT INTO editoriales SET ?', { id: 2, nombre: "Editorial 2" }, () => { })       
  connection.query('INSERT INTO editoriales SET ?', { id: 3, nombre: "Editorial 3" }, () => { })       
  connection.query('INSERT INTO editoriales SET ?', { id: 4, nombre: "Editorial 4" }, () => { })            
}

module.exports = {
  URL_API,  
  connection,
  cleanDB,
  fillEditoriales
}
