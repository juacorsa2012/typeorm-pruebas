const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const mysql  = require('mysql');
const config = require('./config')

chai.use(chaiHttp);

const url= config.URL_API

const connection = mysql.createConnection({
  host     : config.DB_HOST,
  user     : config.DB_USER,
  password : config.DB_PASSWORD,
  database : config.DB_NAME
});

describe('API /Temas', () => {    
  before(function() {          
    connection.query('DELETE FROM temas', () => {})                          
    connection.query('ALTER TABLE temas AUTO_INCREMENT = 1', () => {})
    connection.query('INSERT INTO temas SET ?', { nombre: "Tema 1" }, () => {})       
    connection.query('INSERT INTO temas SET ?', { nombre: "Tema 2" }, () => {})       
    connection.query('INSERT INTO temas SET ?', { nombre: "Tema 3" }, () => {})       
    connection.query('INSERT INTO temas SET ?', { nombre: "Tema 4" }, () => {})            
  }) 

  it("debe devolver todos los temas", function (done) {
    chai.request(url).get('/temas').end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success').to.be.equal(true)
        expect(res.body).to.have.property('count')
        expect(res.body).to.have.property('data')               
        done();
    });
  });

  it("debe devolver un tema", function (done) {
    chai.request(url).get('/temas/1').end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success').to.be.equal(true)
        expect(res.body).to.have.property('data')  
        expect(res.body).to.have.property('data').property('id').to.be.equal(1)
        expect(res.body).to.have.property('data').property('nombre').to.be.equal('Tema 1')
        done();
    });
  });

  it("debe devolver un error 404 al buscar un tema que no existe", function (done) {
    chai.request(url).get('/temas/99').end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(404)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });

  it("debe devolver el total de temas registrados", function (done) {
    chai.request(url).get('/temas/count').end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success').to.be.equal(true)
        expect(res.body).to.have.property('count')
        done();
    });
  });
  
  it("debe insertar un nuevo tema", function (done) {
    const nombre = 'Tema 5'
    chai.request(url).post('/temas').send({nombre}).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('success').to.be.equal(true)      
        done();
    });
  });
  
  it("debe devolver un error 400 si insertamos un tema sin nombre", function (done) {
    const nombre = ''
    chai.request(url).post('/temas').send({nombre}).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });

  it("debe devolver un error 400 si insertamos un tema con un nombre superior a 40 caracteres", function (done) {
    const nombre = Array(50).join("a")
    chai.request(url).post('/temas').send({nombre}).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });

  it("debe devolver un error 400 si insertamos un tema ya existente", function (done) {
    const nombre = 'Tema 1'
    chai.request(url).post('/temas').send({nombre}).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(409)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });

  it("debe actualizar un tema", function (done) {
    const nombre = 'Tema 99'    
    chai.request(url).put('/temas/1').send({ nombre }).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('success').to.be.equal(true)      
        done();
    });
  });

  it("debe devolver un error 404 si no existe el tema a actualizar", function (done) {
    const nombre = 'Tema 99'    
    chai.request(url).put('/temas/1000').send({ nombre }).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(404)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });

  it("debe devolver un error 400 si intentamos actualizar un tema sin nombre", function (done) {
    const nombre = ''    
    chai.request(url).put('/temas/1').send({nombre}).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });

  it("debe devolver un error 400 si intentamos actualizar un tema con nombre existente", function (done) {
    const nombre = 'Tema 2'    
    chai.request(url).put('/temas/1').send({nombre}).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });

  it("debe devolver un error 400 si intentamos actualizar un tema con nombre superior a 40 caracteres", function (done) {
    const nombre = Array(50).join("a") 
    chai.request(url).put('/temas/1').send({nombre}).end((err, res) => {  
        if (err) done(err);      
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('success').to.be.equal(false)      
        done();
    });
  });
})