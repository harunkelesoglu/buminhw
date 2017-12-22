var express=require("express");
var router=express.Router();
var getAccessToken = require("../getFromAPI");


router.get('/',function(req,res){
	res.render('index',{active_index:"active"});
});

router.get('/login',function(req,res){
	if(req.session.token)
		res.redirect('/')
	else
		res.render('login')
});

router.post('/login',function(req,res){

		var email = req.body.email,
		pass=req.body.password;

		
		req.checkBody('email','Email is required').notEmpty();
		req.checkBody('email','Not valid email').isEmail();
		req.checkBody('password','Password is required').notEmpty();

		var errors=req.validationErrors();
		if(errors){
			res.render('login',{errors:errors})
			
		}else{
		var options = {
			hostname: 'sandbox-reporting.rpdpymnt.com',
			port: 443,
			method: 'POST',
			path: '/api/v3/merchant/user/login?email='+email+'&password='+pass
			};
		
		
			
			getAccessToken(options,function(err,result){

				if(err){
					req.flash('error_msg',"Username or password is failed");
					res.status(302).redirect('/login');

				}else{
					req.session.token = result.token;
					req.session.email = email; 
					req.session.password = pass;
					req.session.cookie.maxAge+=600000   //session is extend 10 minute
					req.flash('success_msg',"Authentication is success");
					res.status(200).redirect('/');
				}
			});
		}
});

router.post('/logout',function(req,res){

	req.session.destroy();
	res.redirect('/login');
	
});



module.exports=router;
