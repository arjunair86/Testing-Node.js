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

app.use('/users', function(req, res){
	res.header('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname + '/View/users.html'));
});


app.use('/login',  require('./routers/loginRouter'));
app.use('/register',  require('./routers/registerRouter'))


////////**********************END**************************////////////////
app.listen(3000);
console.log("\nServer listening to port 3000\n");