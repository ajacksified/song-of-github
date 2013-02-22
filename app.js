
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    https = require('https'),
    path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  if(req.query.username){
    https.get('https://github.com/users/' + req.query.username + '/contributions_calendar_data', function(response) {
      response.on('data', function(d){
        try{
          JSON.parse(d);
        }catch(e){
          d = null;
        }

        res.render('index', { calendarData: d, name: req.query.username });
      });
    });
  }else{
    res.render('index');
  }

});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
