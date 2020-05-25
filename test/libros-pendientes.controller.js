const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const mysql  = require('mysql');
const config = require('./config')

chai.use(chaiHttp);

const url = config.URL_API
const connection = mysql.createConnection({
    host     : config.DB_HOST,
    user     : config.DB_USER,
    password : config.DB_PASSWORD,
    database : config.DB_NAME
});
  
describe('API /LibrosPendientes', () => {    
    before(function() {          
        connection.query('TRUNCATE TABLE editoriales', () => {})
        connection.query('TRUNCATE TABLE libros_pendientes', () => {})
        connection.query('INSERT INTO editoriales SET ?', { nombre: "Editorial 1" }, () => {})       
        connection.query('INSERT INTO editoriales SET ?', { nombre: "Editorial 2" }, () => {})      
        connection.query('INSERT INTO libros_pendientes SET ?', { 
            titulo: "Titulo 1", observaciones: "Observaciones 1", editorialId: 1  }, () => {}
        )       
        connection.query('INSERT INTO libros_pendientes SET ?', { 
            titulo: "Titulo 2", observaciones: "Observaciones 2", editorialId: 2  }, () => {}
        )        
    }) 

    it("debe devolver todos los libros pendientes", function (done) {
        chai.request(url).get('/libros-pendientes').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            expect(res.body).to.have.property('data')               
            done();
        });
      });

    it("debe devolver un libro", function (done) {
        chai.request(url).get('/libros-pendientes/1').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('data')  
            expect(res.body).to.have.property('data').property('id').to.be.equal(1)
            expect(res.body).to.have.property('data').property('titulo').to.be.equal('Titulo 1')
            expect(res.body).to.have.property('data').property('observaciones').to.be.equal('Observaciones 1')
            done();
        });
    });
    
    
    

})
