var request = require('supertest'),
    should = require('chai').should(),
    server = require("../app");

    describe("GET /",function(){

        it("should authentication when visit all routes except login",function(done){

            request(server)
            .get('/')
            .set('Accept', 'application/json')
            .expect(302)
            .end(function(err, res){
              if (err) return done(err);
              done()
            });
        });       
    })