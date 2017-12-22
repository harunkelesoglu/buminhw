var express = require("express");
var router = express.Router();
var getClient = require("../getFromAPI");
var data;

router.get('/',function(req,res){
  
    res.render('client',{data,active_client:"active"})
})

router.post('/',function(req,res){
   
    var transactionId= req.body.transactionId;
    req.checkBody('transactionId','Transaction ID is not empty').notEmpty();
    var errors = req.validationErrors();

    if(errors){
        req.flash('errors',errors);
        res.redirect('/client')

    }else{
       
        var options = {
                    hostname: 'sandbox-reporting.rpdpymnt.com',
                    port: 443,
                    method: 'POST',
                    headers:{
                        Authorization : req.session.token
                    },
                    path: '/api/v3/client?transactionId='+transactionId
            };
            
        getClient(options,function(err,result){

                data=result;
                
                if(err){
                    req.flash('error_msg',err);
                    res.redirect('/client')
                    
                }else{
                    req.flash('success_msg',"Recevied data");
                    res.redirect('/client');
                }
        })
    }
});

module.exports=router;