var https=require("https");

 module.exports=function (options, cb){

                https.request(options, function (response) {

                                var data = '';
                                
                                response.on('data', function(chunk){
                                        data += chunk;
                                });

                                response.on('end', function () {

                                       while(typeof data == "string"){
                                                data  = JSON.parse(data);    
                                        }

                                        err = data.message;
                                        cb(err,data)

                                });
                        }).end();
        }
