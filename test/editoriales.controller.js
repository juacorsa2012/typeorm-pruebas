const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { URL_API, cleanDB, fillEditoriales } = require('./config')

chai.use(chaiHttp);

describe('API /Editoriales', () => {    
    before(function() {   
        cleanDB()    
        fillEditoriales()
    }) 

    it("debe devolver todos las editoriales", function (done) {
        chai.request(URL_API).get('/editoriales').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            expect(res.body).to.have.property('data')               
            done();
        });
    });
    
    it("debe devolver una editorial", function (done) {
        chai.request(URL_API).get('/editoriales/1').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('data')  
            expect(res.body).to.have.property('data').property('id').to.be.equal(1)
            expect(res.body).to.have.property('data').property('nombre').to.be.equal('Editorial 1')
            done();
        });
    });
    
    it("debe devolver un error 404 al buscar una editorial que no existe", function (done) {
        chai.request(URL_API).get('/editoriales/99').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });

    it("debe devolver el total de editoriales registradas", function (done) {
        chai.request(URL_API).get('/editoriales/count').end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('success').to.be.equal(true)
            expect(res.body).to.have.property('count')
            done();
        });
    });
    
    it("debe insertar una nueva editorial", function (done) {
        const nombre = 'Editorial 5'
        chai.request(URL_API).post('/editoriales').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('success').to.be.equal(true)      
            done();
        });
    });

    it("debe devolver un error 400 si insertamos una editorial sin nombre", function (done) {
        const nombre = ''
        chai.request(URL_API).post('/editoriales').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
    
    it("debe devolver un error 400 si insertamos una editorial con un nombre superior a 40 caracteres", function (done) {
        const nombre = Array(50).join("a")
        chai.request(URL_API).post('/editoriales').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });

    it("debe devolver un error 400 si insertamos una editorial ya existente", function (done) {
        const nombre = 'Editorial 1'
        chai.request(URL_API).post('/editoriales').send({nombre}).end((err, res) => {  
            if (err) done(err);      
            expect(res).to.have.status(409)
            expect(res.body).to.have.property('success').to.be.equal(false)      
            done();
        });
    });
})