const { response } = require('express');
const chai = require('chai');
chai.use(require('chai-http'))
const expect = require('chai').expect;
const api = 'http://localhost:3000';
const server = require('../server');

describe("get operations", function(){

    before(function(){
        server.start();
    });

    after(function(){
        server.stop();
    });

    describe("Get items", function(){

        it("GET /items: Should respond with an array of items", async function(){
            await chai.request(api)
            .get("/items")
            .then(response => {
                //console.log(response);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.a('array');
                //expect(response.body).to.have.a.property('userId');
                //expect(response.body.location).to.be.of.type('object');
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })

    describe("Get item", function(){

        it("GET /items/:id: Should respond with a single item object", async function(){
            await chai.request(api)
            .get("/items/a05a7af7-9017-4ead-8cd6-96b085463586")
            .then(response => {
                //console.log(response);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.a('object');
                //expect(response.body).to.have.a.property('userId');
                //expect(response.body.location).to.be.of.type('object');
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })

    describe("Post items", function(){

        it("POST /items: adds a new item. Requires auth", async function(){
            await chai.request(api)
            .post("/items")
            .auth('testi', 'testi')
            .send({
                "title": "New item",
                "description": "New and shiny",
                "category": "Stuff",
                "location": {
                    "street": "testitie",
                    "county": "testilääni",
                    "postalCode": "99999",
                    "city": "korvatunturi"
                },
                "price": 990.5,
                "date": "10.10.2020",
                "deliveryType": "Nouto"
            })
            .then(response => {
                //console.log(response);
                expect(response.status).to.equal(200);
                //expect(response.body).to.be.a('array');
                //expect(response.body).to.have.a.property('userId');
                //expect(response.body.location).to.be.of.type('object');
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })

    describe("Modify item", function(){

        it("PUT /items/:id: Should allow user to update a field after auth", async function(){
            await chai.request(api)
            .put("/items/a05a7af7-9017-4ead-8cd6-96b085463586")
            .auth('testi', 'testi')
            .send({
                "title":"titletest"
            })
            .then(response => {
                expect(response.status).to.equal(200);
                return chai.request(api).get("/items/a05a7af7-9017-4ead-8cd6-96b085463586")
            })
            .then(readResponse => {
                expect(readResponse.status).to.equal(200);
                expect(readResponse.body.title).to.equal("titletest");
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })

    describe("delete item", function(){

        it("DELETE /items/:Id: Should allow user to delete users own item after auth", async function(){
            await chai.request(api)
            .delete("/items/a05a7af7-9017-4ead-8cd6-96b085463586")
            .auth('testi', 'testi')
            .then(response => {
                expect(response.status).to.equal(200);
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })

    describe("delete someone elses item", function(){

        it("DELETE /items/:Id: Should prevent user from deleting someone elses item", async function(){
            await chai.request(api)
            .delete("/items/df40e9e3f95d-15c31ab9-7ee7-41c4-be7c")
            .auth('testi', 'testi')
            .then(response => {
                expect(response.status).to.equal(401); // UNAUTHORIZED
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })

    describe("Register a new user", function() {
        it("POST /register: Should create a new user", async function() {
            await chai.request(api)
            .post('/register')
            .send({
                "username": "username",
                "name": "XXX XXX",
                "phone": "040 1234567",
                "email": "a@b.com",
                "birthdate": "1900-01-01",
                "password": "password",
                "street": "katu",
                "county": "Lääni",
                "postalcode": 90000,
                "city": "kaupunki"
            })
            .then(response => {
                expect(response).to.have.property('status');
                expect(response.status).to.equal(201);
            })
            .catch(error => {
                expect.fail(error);
            });
        });
    });

    describe("Try to register a username that already exists", function() {
        it("POST /register: Should prevent you from creating a new user", async function() {
            await chai.request(api)
            .post('/register')
            .send({
                "username": "testi", // username testi already exists
                "name": "XXX XXX",
                "phone": "040 1234567",
                "email": "a@b.com",
                "birthdate": "1900-01-01",
                "password": "password",
                "street": "katu",
                "county": "Lääni",
                "postalcode": 90000,
                "city": "kaupunki"
            })
            .then(response => {
                expect(response).to.have.property('status');
                expect(response.status).to.equal(409); // username taken.
            })
            .catch(error => {
                expect.fail(error);
            });
        });
    });


    describe("Search matching items", function(){
            // Cheat sheet for testing
            // http://localhost:3000/search?category=Valokuvaus
            // http://localhost:3000/search?date=10.10.2020
            // http://localhost:3000/search?location.city=Tornio

        it("GET /search? : Should respond with an item array or an object matching query param", async function(){
            await chai.request(api)
            .get("/search?category=Valokuvaus")
            .then(response => {
                //console.log(response);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.a('array');
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })


    describe("Get users", function(){

        it("GET /users: Should return an array with all users. For testing purposes", async function(){
            await chai.request(api)
            .get("/users")
            .then(response => {
                //console.log(response);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.a('array');
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })

    describe("Get user", function(){

        it("GET /users/:id: Should return single object with the requested user. For testing purposes", async function(){
            await chai.request(api)
            .get("/users/15c31ab9-7ee7-41c4-be7c-df40e9e3f95d")
            .then(response => {
                //console.log(response);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.a('object');
            })
            .catch(error =>{
                expect.fail(error)
            })
        })
    })
});