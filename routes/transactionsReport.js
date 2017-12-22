var express = require("express");
var router = express.Router();
var getTransactionsReport = require("../getFromAPI");
var data;


router.get('/report',function(req,res){
    res.render("transactionsReport",{data,active_transactionReport:"active"});

})

router.post('/report',function(req,res){

    var date = req.body.date,
        merchant = req.body.merchant,
        acquirer = req.body.acquirer,
        date=date.split('-');
    
     
    var fromDate =date[0].replace(/\//g,'-').trim();    //it would be better to do these things on the client side 
    var toDate = date[1].replace(/\//g,'-').trim();    
    var query ="?fromDate="+fromDate+"&toDate="+toDate;

    if(merchant)
        query+="&merchant="+merchant;

    if(acquirer)
        query+="&acquirer="+acquirer;

    var options = {
        hostname: 'sandbox-reporting.rpdpymnt.com',
        port: 443,
        method: 'POST',
        headers:{
            Authorization : req.session.token
        },
        path: '/api/v3/transactions/report'+query
        };

    getTransactionsReport(options,function(err,result){
        data=result;
        if(err){
            req.flash('error_msg',err);
            res.redirect('/transactions/report')
        }else{
            req.flash('success_msg',"Received data");
            res.redirect('/transactions/report');
        }
    })
})

module.exports=router;