var express = require ('express');
var path = require('path');
var fs = require ('fs');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();
var data = '';

app.use(bodyParser.urlencoded({
	extended :true
}));


///////////**************ROUTE TEST************//////////////////
router.route('/')

		.get(function(req, res){
		  res.sendFile(path.join(__dirname + '/View/route.html'));
		})
		.post(function(req, res){
		  res.json({user: req.body.user});
		});

router.post('/inside_route', function(req, res){
  res.send("Requested user: " + req.body.user);
});


app.use('/route', router);


//////////************DEFAULT PAGE*******************//////////////////
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/View/index.html'));
});


//////////***************ABOUT PAGE*******************/////////////////
app.get('/about', function(req, res){
  res.sendFile(path.join(__dirname + '/View/about.html'));
});


///////////***************STREAM TEST***************/////////////////////
var readStream = fs.createReadStream('test.txt', {highWaterMark: 0.5 * 1024});

// readStream.on('data', function(chunk){
//  data += chunk;
// });

// readStream.on('end', function(){
//  console.log(data.toString());
// })

var writeStream = fs.createWriteStream('output.txt');

// readStream.on('data', function(chunk){
//  writeStream.write(chunk);
// })

readStream.pipe(writeStream);



app.get('/html', function(req, res){
  res.header('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname + '/output.txt'));
});



////////*************USER LOGIN AND REGISTER***************/////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testdb');
console.log('Connected to databse');
var User = require('/home/user/intern_project/models/bear');
var loginRouter = express.Router();
var registerRouter = express.Router();
var crypto = require('crypto');


app.use('/users', function(req, res){
	res.header('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname + '/View/users.html'));
});

loginRouter.route('/')
	.get(function(req, res, next){
		res.header('Content-Type', 'text/html');
		res.sendFile(path.join(__dirname + '/View/login.html'));	
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


registerRouter.route('/')
	.get(function(req, res){
		res.sendFile(path.join(__dirname + '/View/register.html'));	
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


app.use('/login', loginRouter);
app.use('/register', registerRouter)


////////**********************END**************************////////////////
app.listen(3000);
console.log("\nServer listening to port 3000\n");