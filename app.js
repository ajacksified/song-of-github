
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    async = require('async');

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

getGitHubData = function(name) {
  return function(callback) {
    url = 'https://github.com/users/' + name + '/contributions_calendar_data';
    https.get(url, function(response) {
      response.on('data', function(d) {
        callback(null, d);
      });
    });
  }
}

app.get('/', function(req, res) {
  if(req.query.username){
    var names = req.query.username.split(','),
        allQueries = [];
    for (i in names) {
      allQueries.push(getGitHubData(names[i]));
    }
    async.parallel(allQueries, function(err, results) {
      var returning = [];
      for (i = 0; i < names.length; i++) {
        returning.push({'key' : names[i], 'value' : results[i] });
      }
      res.render('index', { calendarData: returning, names: names, namesString: names.join(',')});
    });
  } else {
    res.render('index');
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
