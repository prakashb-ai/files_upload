const express = require('express');
const app = express();
const path = require('path');
const port = 8000;
const multer = require('multer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

var mysql = require('mysql');

const DIR = 'public/uploads';
//database connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.password,
  database: "test_db"
});

//multer
  let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DIR);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});
// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public/upload')));

message =''
app.get('/', function(req, res) {
    res.render('index', message);
});
//Middleware
app.post('/api/v1/upload',upload.single('profile'), function (req, res) {
  message : "Error! in image upload."
    if (!req.file) {
        console.log("No file received");
          message = "Error! in image upload."
        res.render('index',{message: message, status:'danger'});
    
      } else {
        console.log('file received');
        console.log(req);
        var sql = "INSERT INTO `posts`(id`,`user_id`,`filename) VALUES ('" + req.file.size + "', '"+req.file.mimetype+"', '"+req.file.filename+"')";
                var query = con.query(sql, function(err, result) {
                   console.log('inserted data');
                });
        message = "Successfully! uploaded";
        res.render('index',{message: message, status:'success'});
      }
});
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
})