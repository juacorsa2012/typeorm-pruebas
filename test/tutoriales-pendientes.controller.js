const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const config = require('./config')

chai.use(chaiHttp);

const url = config.URL_API

describe('API /TutorialesPendientes', () => {    
    before(function() {           
        config.connection.query('DELETE FROM tutoriales_pendientes', () => {})
        config.connection.query('DELETE FROM fabricantes', () => {})                          
        config.connection.query('INSERT INTO fabricantes SET ?', {id: 1, nombre: "Fabricante 1" }, () => {})       
        config.connection.query('INSERT INTO fabricantes SET ?', {id: 2, nombre: "Fabricante 2" }, () => {})      
        config.connection.query('INSERT INTO tutoriales_pendientes SET ?', { 
            id: 1, titulo: "Titulo 1", observaciones: "Observaciones 1", fabricanteId: 1  }, () => {}
        )       
        config.connection.query('INSERT INTO tutoriales_pendientes SET ?', { 
            id: 2, titulo: "Titulo 2", observaciones: "Observaciones 2", fabricanteId: 2  }, () => {}
        )                
    }) 

    it("debe devolver todos los tutoriales pendientes", function (done) {
        chai.request(url).get('/tutoriales-pendientes').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            expect(res.body).to.have.property('data')               
            done();
        });
    });

    it("debe devolver todos los tutoriales pendientes filtrado por un fabricante", function (done) {
        chai.request(url).get('/tutoriales-pendientes').query({fabricante: 1}).end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            expect(res.body).to.have.property('data')               
            done();
        });
    });

    it("debe devolver un tutorial", function (done) {
        chai.request(url).get('/tutoriales-pendientes/1').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('data')  
            expect(res.body).to.have.property('data').property('id').to.be.equal(1)
            expect(res.body).to.have.property('data').property('titulo').to.be.equal('Titulo 1')
            expect(res.body).to.have.property('data').property('observaciones').to.be.equal('Observaciones 1')
            expect(res.body).to.have.property('data').property('fabricante')
            done();
        });
    });

    it("debe devolver un error 404 al buscar un tutorial que no existe", function (done) {
        chai.request(url).get('/tutoriales-pendientes/99').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)   
            expect(res.body).to.have.property('message').to.be.equal('El tutorial no existe en la base de datos')   
            done();
        });
    });  

    it("debe devolver el total de tutoriales registrados", function (done) {
        chai.request(url).get('/tutoriales-pendientes/count').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            done();
        });
    });

    it("debe insertar un nuevo tutorial", function (done) {
        const tutorial = { titulo: 'Titulo 1', observaciones: 'Observaciones', fabricante: 1 }

        chai.request(url).post('/tutoriales-pendientes').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
    });

    it("debe insertar un nuevo tutorial aunque no indiquemos las observaciones", function (done) {
        const tutorial = { titulo: 'Titulo 1', observaciones: '', fabricante: 1 }

        chai.request(url).post('/tutoriales-pendientes').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
      });

    it("debe devolver un error 400 si intentamos insertar un tutorial sin título", function (done) {
        const tutorial = { titulo: '', observaciones: 'Observaciones', fabricante: 1 }

        chai.request(url).post('/tutoriales-pendientes').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });

    it("debe devolver un error 400 si intentamos insertar un tutorial sin fabricante", function (done) {
        const tutorial = { titulo: 'Titulo 1', observaciones: '', fabricante: '' }

        chai.request(url).post('/tutoriales-pendientes').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)   
            expect(res.body).to.have.property('message').to.be.equal('El fabricante no existe en la base de datos')     
            done();
        });
    });

    it("debe actualizar un tutorial existente", function (done) {
        const tutorial = { titulo: 'Titulo 1', observaciones: 'Observaciones', fabricante: 1 }

        chai.request(url).put('/tutoriales-pendientes/1').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
    });

    it("debe devolver un error 400 al intentar actualizar un tutorial sin título", function (done) {
        const tutorial = { titulo: '', observaciones: 'Observaciones', fabricante: 1 }

        chai.request(url).put('/tutoriales-pendientes/1').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)    
            done();
        });
    });

    it("debe devolver un error 400 al intentar actualizar un tutorial sin fabricante", function (done) {
        const tutorial = { titulo: 'Titulo 1', observaciones: 'Observaciones', fabricante: '' }

        chai.request(url).put('/tutoriales-pendientes/1').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)    
            done();
        });
    });

    it("debe devolver un error 404 al intentar actualizar un tutorial inexistente", function (done) {
        const tutorial = { titulo: 'Titulo 1', observaciones: 'Observaciones', fabricante: 1 }

        chai.request(url).put('/tutoriales-pendientes/99').send(tutorial).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)  
            expect(res.body).to.have.property('message').to.be.equal('El tutorial no existe en la base de datos')
            done();
        });
      });

      it("debe borrar un tutorial", function (done) {        
        chai.request(url).delete('/tutoriales-pendientes/1').end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)  
            expect(res.body).to.have.property('message').to.be.equal('El tutorial se ha borrado de la base de datos correctamente')
            done();
        });
      });

      it("debe borrar un tutorial", function (done) {        
        chai.request(url).delete('/tutoriales-pendientes/9999').end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)  
            expect(res.body).to.have.property('message').to.be.equal('El tutorial no existe en la base de datos')
            done();
        });
      });         

})
