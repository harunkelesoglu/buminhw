var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var flash = require("connect-flash");
var hbs = require("express-handlebars");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require("express-validator");
var index = require("./routes/index");
var transactionsReport = require('./routes/transactionsReport')
var transaction = require("./routes/transaction");
var client = require("./routes/client")


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({
                      defaultLayout:'main',
                      extname: '.hbs',
                      helpers: {
                        section: function(name, options){
                          
                              if(!this._sections) this._sections = {};
                              this._sections[name] = options.fn(this);
                              return null;
                          },
                        json: function(context) {	
                                return JSON.stringify(context,null,50);
                            
                          }
                      }
                    })
                    )


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
	secret:'bumin',
	saveUninitialized:true,
	resave:true,
	cookie: { maxAge: 600000 } // Token is valid for 10 minute
}));

//Express validator middleware
app.use(expressValidator({
	errorFormatter:function(param,msg,value){
		var namespace=param.split('.'),
			root=namespace.shift(),
			formParam=root;

			while(namespace.length){
				formParam +=  '['+namespace.shift()+']';
			}
			return {
				param : formParam,
				msg	  : msg,
				value : value
			};
	}
}));

//Connect flash for action notifications
app.use(flash());

//Global Vars
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.errors = req.flash('errors');
	res.locals.user=req.session.token || null;
	res.locals.email=req.session.email || null;
	res.locals.password=req.session.password || null;
	next();
});

//Routes
app.all("*",ensureAuthenticated); // Authentication control
app.use('/',index);
app.use('/transactions',transactionsReport);
app.use('/transaction',transaction);
app.use('/client',client);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};
 
   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

function ensureAuthenticated(req,res,next){

	if(req.url == '/login'){
		return next();

		}else if(req.session.token){
			return next();	
		
		}else{
		 	res.status(302).redirect('/login'); //302 Found is more fitting because the requested resource was found, there just is another page to go through before it can be accessed 
		}      
  }
  
  function sectionHelper(name, options){
                              
    if(!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);

    return null;
  }

  function jsonHelper(context) {	

    return JSON.stringify(context,null,50);
}
module.exports = app;
