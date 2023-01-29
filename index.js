var express = require('express');
var cors = require('cors');
require('dotenv').config()

// add body parser
const bodyParser = require('body-parser');

// to handle the file upload I use the code in
// https://pqina.nl/blog/upload-image-with-nodejs/
// handle file upload
const fileUpload = require('express-fileupload');

var app = express();

// Use the express-fileupload middleware
app.use(fileUpload());
// bodyParser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/fileanalyse', (req, res) => {
  // Get the file that was set to our field named "image"
  const image  = req.files.upfile;
  // console.log(image);
  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // If does not have image mime type prevent from uploading
  // if (/^image/.test(image.mimetype)) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  image.mv(__dirname + '/upload/' + image.name);
  res.json(
    {
      name: req.files.upfile.name,
      type: req.files.upfile.mimetype,
      size: req.files.upfile.size
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
