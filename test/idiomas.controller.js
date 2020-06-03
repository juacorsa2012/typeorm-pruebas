const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { URL_API, cleanDB, fillIdiomas } = require('./config')

chai.use(chaiHttp);

describe('API /Idiomas', () => {    
    before(function() {          
        cleanDB()
        fillIdiomas()
    }) 
    
    it("debe devolver todos los idiomas", function (done) {
        chai.request(URL_API).get('/idiomas').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            expect(res.body).to.have.property('data')               
            done();
        });
    });

    it("debe devolver un idioma", function (done) {
        chai.request(URL_API).get('/idiomas/1').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('data')  
            expect(res.body).to.have.property('data').property('id').to.be.equal(1)
            expect(res.body).to.have.property('data').property('nombre').to.be.equal('Idioma 1')
            done();
        });
    });
    
    it("debe devolver un error 404 al buscar un idioma que no existe", function (done) {
        chai.request(URL_API).get('/idiomas/99').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
    
    it("debe devolver el total de idiomas registrados", function (done) {
        chai.request(URL_API).get('/idiomas/count').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            done();
        });
    });
    
    it("debe insertar un nuevo idioma", function (done) {
        const nombre = 'Idioma 5'
        chai.request(URL_API).post('/idiomas').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
    });
      
    it("debe devolver un error 400 si insertamos un idioma sin nombre", function (done) {
        const nombre = ''
        chai.request(URL_API).post('/idiomas').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
    
    it("debe devolver un error 400 si insertamos un idioma con un nombre superior a 40 caracteres", function (done) {
        const nombre = Array(50).join("a")
        chai.request(URL_API).post('/idiomas').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });

    it("debe devolver un error 400 si insertamos un idioma ya existente", function (done) {
        const nombre = 'Idioma 1'
        chai.request(URL_API).post('/idiomas').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(409)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
    
    it("debe actualizar un idioma", function (done) {
        const nombre = 'Idioma 99'    
        chai.request(URL_API).put('/idiomas/1').send({ nombre }).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
    });
    
    it("debe devolver un error 404 si no existe el idioma a actualizar", function (done) {
        const nombre = 'Idioma 99'    
        chai.request(URL_API).put('/idiomas/1000').send({ nombre }).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
    
    it("debe devolver un error 400 si intentamos actualizar un idioma sin nombre", function (done) {
        const nombre = ''    
        chai.request(URL_API).put('/idiomas/1').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
    
    it("debe devolver un error 400 si intentamos actualizar un idioma con nombre existente", function (done) {
        const nombre = 'Idioma 2'    
        chai.request(URL_API).put('/idiomas/1').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
    
    it("debe devolver un error 400 si intentamos actualizar un idioma con nombre superior a 40 caracteres", function (done) {
        const nombre = Array(50).join("a") 
        chai.request(URL_API).put('/idiomas/1').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    }); 
})