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

const fillTemas = () => {
  connection.query('INSERT INTO temas SET ?', { id: 1, nombre: "Tema 1" }, () => { })       
  connection.query('INSERT INTO temas SET ?', { id: 2, nombre: "Tema 2" }, () => { })       
  connection.query('INSERT INTO temas SET ?', { id: 3, nombre: "Tema 3" }, () => { })       
  connection.query('INSERT INTO temas SET ?', { id: 4, nombre: "Tema 4" }, () => { })            
}

const fillIdiomas = () => {  
  connection.query('INSERT INTO idiomas SET ?', { id: 1, nombre: "Idioma 1" }, () => {})       
  connection.query('INSERT INTO idiomas SET ?', { id: 2, nombre: "Idioma 2" }, () => {})       
  connection.query('INSERT INTO idiomas SET ?', { id: 3, nombre: "Idioma 3" }, () => {})       
  connection.query('INSERT INTO idiomas SET ?', { id: 4, nombre: "Idioma 4" }, () => {})            
}

const fillFabricantes = () => {  
  connection.query('INSERT INTO fabricantes SET ?', { id: 1, nombre: "Fabricante 1" }, () => {})       
  connection.query('INSERT INTO fabricantes SET ?', { id: 2, nombre: "Fabricante 2" }, () => {})       
  connection.query('INSERT INTO fabricantes SET ?', { id: 3, nombre: "Fabricante 3" }, () => {})       
  connection.query('INSERT INTO fabricantes SET ?', { id: 4, nombre: "Fabricante 4" }, () => {})        
}

const fillLibrosPendientes = () => {  
  connection.query('INSERT INTO libros_pendientes SET ?', { 
    id: 1, titulo: "Titulo 1", observaciones: "Observaciones 1", editorialId: 1  }, () => {}  
  )       
  connection.query('INSERT INTO libros_pendientes SET ?', { 
    id: 2, titulo: "Titulo 2", observaciones: "Observaciones 2", editorialId: 2  }, () => {}
  )       
}

const fillTutorialesPendientes = () => {  
  connection.query('INSERT INTO tutoriales_pendientes SET ?', { 
      id: 1, titulo: "Titulo 1", observaciones: "Observaciones 1", fabricanteId: 1  }, () => {}
  )       
  connection.query('INSERT INTO tutoriales_pendientes SET ?', { 
      id: 2, titulo: "Titulo 2", observaciones: "Observaciones 2", fabricanteId: 2  }, () => {}
  )                
}

module.exports = {
  URL_API,  
  connection,
  cleanDB,
  fillEditoriales,
  fillTemas,
  fillIdiomas,
  fillFabricantes,
  fillLibrosPendientes,
  fillTutorialesPendientes
}
