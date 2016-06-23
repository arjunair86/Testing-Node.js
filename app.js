var express = require ('express');
var path = require('path');
var fs = require ('fs');
var bodyParser = require('body-parser');


var router = express.Router();

var app = express();
var data = '';

app.use(bodyParser());


router.route('/')

		.get(function(req, res){
		  res.sendFile(path.join(__dirname + '/route.html'));
		})
		.post(function(req, res){
		  res.json({user: req.body.user});
		});

router.post('/inside_route', function(req, res){
  res.send("Requested user: " + req.body.user);
});


app.use('/route', router);

app.use(express.static(__dirname + '/View'));

app.get('/', function(req, res){
  res.sendFile('/index.html');
});

app.get('/about', function(req, res){
  res.sendFile(path.join(__dirname + '/about.html'));
});

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


app.listen(3000);