var request = require('supertest'),
    should = require('chai').should(),
    getFromAPI=require("../getFromAPI");

    //required variable for test
    var token;
    var transactionId = "1-1444392550-1";
    var credentials = {
      email:"demo@bumin.com.tr",
      password:"cjaiU8CV"
    };

    var options = {
        hostname: 'sandbox-reporting.rpdpymnt.com',
        port: 443,
        method: 'POST'
    }

    describe("getFromAPI()",function(){
      
      it("should return an access token",function(done){ 

        options.path='/api/v3/merchant/user/login?email='+credentials.email+'&password='+credentials.password;

          getFromAPI(options,function(err,result){

            if(err) done(err);
            else token=result.token;
            should.exist(result.token);
              
            done();

          })
      });

      it("should return client, transaction",function(done){

        options.headers = { Authorization: token }
        options.path = '/api/v3/client?transactionId='+transactionId

          getFromAPI(options,function(err,result){

            if(err) done(err);
            should.equal(typeof result,"object");
              
            done();

          })
       });

    });
 
    
