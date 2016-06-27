var express = require ('express');
var registerRouter = express.Router();
var crypto = require('crypto'); 

var User = require('/home/user/intern_project/models/bear');

registerRouter.route('/')
	.get(function(req, res){
		res.sendFile('/home/user/intern_project/View/register.html');	
	})
	.post(function(req, res){
		var passhash = crypto.createHmac('sha256', req.body.password).update('salt').digest('hex');
		var user = new User();
		console.log('created new instance');
		user.name = req.body.name;
		user.email = req.body.email;
		user.encryp_pass = passhash;
		console.log('assigned the variables');

		//save it
		user.save(function(err){
			console.log('Entered save function');
			if(err)
				res.send(err);
			res.send("User registered with email "+ req.body.email);
		});
});

module.exports = registerRouter;