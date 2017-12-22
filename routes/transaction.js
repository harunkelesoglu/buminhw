var express = require("express");
var router = express.Router();
var getTransaction = require("../getFromAPI");
var getTransactionList=require("../getFromAPI");
var transactionData,transactionList;
router.get('/',function(req,res){

    res.render('transaction',{transactionData,active_transactionIndex:"active"});
})

router.post('/',function(req,res){
    
    var transactionId= req.body.transactionId;
    req.checkBody('transactionId','Transaction ID is not empty').notEmpty();
    var errors = req.validationErrors();

    if(errors){
        req.flash('errors',errors);
        res.redirect('/transaction')

    }else{
    
        var options = {
                hostname: 'sandbox-reporting.rpdpymnt.com',
                port: 443,
                method: 'POST',
                headers:{
                    Authorization : req.session.token
                },
                path: '/api/v3/transaction?transactionId='+transactionId
            };
            
        getTransaction(options,function(err,result){
                transactionData=result;
                if(err){
                    req.flash('error_msg',err);
                    res.redirect('/transaction')
                }else{
                    req.flash('success_msg',"Recevied data");
                    res.redirect('/transaction');
                }
        });
    }

});

router.get('/list',function(req,res){
    res.render('transactionList',{transactionList,active_transactionList:"active"});
});

router.post('/list',function(req,res){
    var query = req.body.query
  
    var options = {
        hostname: 'sandbox-reporting.rpdpymnt.com',
        port: 443,
        method: 'POST',
        headers:{
            Authorization : req.session.token
        },
        path: '/api/v3/transaction/list?'+query
        };
     
 getTransactionList(options,function(err,result){
    transactionList=result

         if(err){
             req.flash('error_msg',err);
             res.redirect('/transaction/list')
         }else{
             req.flash('success_msg',"Received data");
             res.send(true)
         }
 })
})

module.exports=router;