const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { URL_API, cleanDB, fillEditoriales, fillLibrosPendientes } = require('./config')

chai.use(chaiHttp);

describe('API /LibrosPendientes', () => {    
    before(function() {          
      cleanDB()
      fillEditoriales()
      fillLibrosPendientes()
    }) 

    it("debe devolver todos los libros pendientes", function (done) {
        chai.request(URL_API).get('/libros-pendientes').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            expect(res.body).to.have.property('data')               
            done();
        });
    });

    it("debe devolver todos los libros pendientes filtrado por una editorial", function (done) {
      chai.request(URL_API).get('/libros-pendientes').query({editorial: 1}).end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('success').to.be.equal(true)
          expect(res.body).to.have.property('count')
          expect(res.body).to.have.property('data')               
          done();
      });
    });


    it("debe devolver un libro", function (done) {
        chai.request(URL_API).get('/libros-pendientes/1').end((err, res) => {
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

    it("debe devolver un error 404 al buscar un libro que no existe", function (done) {
        chai.request(URL_API).get('/libros-pendientes/99').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)   
            expect(res.body).to.have.property('message').to.be.equal('El libro no existe en la base de datos')   
            done();
        });
    });  
    
    it("debe devolver el total de libros registrados", function (done) {
        chai.request(URL_API).get('/libros-pendientes/count').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            done();
        });
    }); 
    
    it("debe insertar un nuevo libro", function (done) {
        const libro = { titulo: 'Titulo 1', observaciones: 'Observaciones', editorial: 1 }

        chai.request(URL_API).post('/libros-pendientes').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
    });

      it("debe insertar un nuevo libro aunque no indiquemos las observaciones", function (done) {
        const libro = { titulo: 'Titulo 1', observaciones: '', editorial: 1 }

        chai.request(URL_API).post('/libros-pendientes').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
      });

      it("debe devolver un error 400 si intentamos insertar un libro sin título", function (done) {
        const libro = { titulo: '', observaciones: '', editorial: 1 }

        chai.request(URL_API).post('/libros-pendientes').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
      });

      it("debe devolver un error 400 si intentamos insertar un libro sin editorial", function (done) {
        const libro = { titulo: 'Titulo 1', observaciones: '', editorial: '' }

        chai.request(URL_API).post('/libros-pendientes').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)   
            expect(res.body).to.have.property('message').to.be.equal('La editorial no existe en la base de datos')     
            done();
        });
      });

      it("debe actualizar un libro existente", function (done) {
        const libro = { titulo: 'Titulo 1', observaciones: 'Observaciones', editorial: 1 }

        chai.request(URL_API).put('/libros-pendientes/1').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
      });

      it("debe devolver un error 400 al intentar actualizar un libro sin título", function (done) {
        const libro = { titulo: '', observaciones: 'Observaciones', editorial: 1 }

        chai.request(URL_API).put('/libros-pendientes/1').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)    
            done();
        });
      });

      it("debe devolver un error 400 al intentar actualizar un libro sin editorial", function (done) {
        const libro = { titulo: '', observaciones: 'Observaciones', editorial: '' }

        chai.request(URL_API).put('/libros-pendientes/1').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)    
            done();
        });
      });

      it("debe devolver un error 404 al intentar actualizar un libro inexistente", function (done) {
        const libro = { titulo: 'Titulo 1', observaciones: 'Observaciones', editorial: 1 }

        chai.request(URL_API).put('/libros-pendientes/99').send(libro).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)  
            expect(res.body).to.have.property('message').to.be.equal('El libro no existe en la base de datos')
            done();
        });
      });

      it("debe borrar un libro", function (done) {        
        chai.request(URL_API).delete('/libros-pendientes/1').end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)  
            expect(res.body).to.have.property('message').to.be.equal('El libro se ha borrado de la base de datos correctamente')
            done();
        });
      });

      it("debe devolver un error 404 si queremos borrar un libro que no existe", function (done) {        
        chai.request(URL_API).delete('/libros-pendientes/9999').end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)  
            expect(res.body).to.have.property('message').to.be.equal('El libro no existe en la base de datos')
            done();
        });
      });      
})
