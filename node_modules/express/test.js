
/**
 * Module dependencies.
 */

var express = require('./')
  , app = express();

app.use(express.bodyParser());

app.get('/', function(req, res){
  res.send('<form method="post"><input type="file" name="image"><input type="submit" value="upload"></form>');
});

app.post('/', function(req, res){
  console.log(req.files);
});

app.listen(3000)