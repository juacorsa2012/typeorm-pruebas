const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { URL_API, cleanDB, fillFabricantes } = require('./config')

chai.use(chaiHttp);

describe('API /Fabricantes', () => {    
      before(function() {                                              
        cleanDB()
        fillFabricantes()                               
      }) 

      it("debe devolver todos los fabricantes", function (done) {
        chai.request(URL_API).get('/fabricantes').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            expect(res.body).to.have.property('data')               
            done();
        });
      });
    
      it("debe devolver un fabricante", function (done) {
        chai.request(URL_API).get('/fabricantes/1').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('data')  
            expect(res.body).to.have.property('data').property('id').to.be.equal(1)
            expect(res.body).to.have.property('data').property('nombre').to.be.equal('Fabricante 1')
            done();
        });
      });

      it("debe devolver un error 404 al buscar un fabricante que no existe", function (done) {
        chai.request(URL_API).get('/fabricantes/99').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });
    
      it("debe devolver el total de fabricantes registrados", function (done) {
        chai.request(URL_API).get('/fabricantes/count').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            done();
        });
      });
    
      it("debe insertar un nuevo fabricante", function (done) {
        const nombre = 'Fabricante 5'
        chai.request(URL_API).post('/fabricantes').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
      });

      it("debe devolver un error 400 si insertamos un fabricante sin nombre", function (done) {
        const nombre = ''
        chai.request(URL_API).post('/fabricantes').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });

      it("debe devolver un error 400 si insertamos un fabricante con un nombre superior a 40 caracteres", function (done) {
        const nombre = Array(50).join("a")
        chai.request(URL_API).post('/fabricantes').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });
    
      it("debe devolver un error 400 si insertamos un fabricante ya existente", function (done) {
        const nombre = 'Fabricante 1'
        chai.request(URL_API).post('/fabricantes').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(409)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });

      it("debe actualizar un fabricante", function (done) {
        const nombre = 'Fabricante 99'    
        chai.request(URL_API).put('/fabricantes/1').send({ nombre }).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
      });
    
      it("debe devolver un error 404 si no existe el fabricante a actualizar", function (done) {
        const nombre = 'Fabricante 99'    
        chai.request(URL_API).put('/fabricantes/1000').send({ nombre }).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });

      it("debe devolver un error 400 si intentamos actualizar un fabricante sin nombre", function (done) {
        const nombre = ''    
        chai.request(URL_API).put('/fabricantes/1').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });
    
      it("debe devolver un error 400 si intentamos actualizar un tema con nombre existente", function (done) {
        const nombre = 'Fabricante 2'    
        chai.request(URL_API).put('/fabricantes/1').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });

      it("debe devolver un error 400 si intentamos actualizar un fabricante con nombre superior a 40 caracteres", function (done) {
        const nombre = Array(50).join("a") 
        chai.request(URL_API).put('/fabricantes/1').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      }); 
})
