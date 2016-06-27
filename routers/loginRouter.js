var express = require ('express');
var loginRouter = express.Router();
var crypto = require('crypto'); 

var User = require('/home/user/intern_project/models/bear');

loginRouter.route('/')
	.get(function(req, res, next){
		res.header('Content-Type', 'text/html');
		res.sendFile('/home/user/intern_project/View/login.html');	
	})
	.post(function(req, res){
		var passhash = crypto.createHmac('sha256', req.body.password).update('salt').digest('hex');
		console.log('Password hashed');
		User.findOne({'email': req.body.email}, 'encryp_pass name', function(err, user){
			console.log('inside function');
			if(err){
				console.log(err);
			}
			if(user.encryp_pass === passhash)
				res.send('Login Success '+ user.name);
			else
				res.send('Login Failed');
		});
});

module.exports = loginRouter;
