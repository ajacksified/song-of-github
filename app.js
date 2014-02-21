var express = require('express'),
    https = require('https'),
    Q = require('q');

var app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.static('./public'));
app.use(app.router);

app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(express.logger('dev'));
});

getGitHubData = function(name) {
  var deferred = Q.defer(),
      url = 'https://github.com/users/' + name + '/contributions_calendar_data';

  https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      deferred.resolve(body);
    });
  }).on('error', function(e) {
    deferred.reject(e.message)
  });

  return deferred.promise;
}

app.get('/', function(req, res) {
  if(req.query.username){
    var names = req.query.username.replace(/\s/g, '').split(','),
        promises = [],
        promise;

    names.forEach(function(name){
      promises.push(getGitHubData(name));
    });

    promise = Q.allSettled(promises);

    promise.then(function(results) {
      var returning = [],
          validNames = [];

      names.forEach(function(name, i){
        if (results[i] != 'invalid') {
          returning.push({ key: name, value: results[i].value });
          validNames.push(name);
        }
      });

      res.render('index', {
        calendarData: returning,
        names: validNames,
        anyValidNames: validNames.length > 0,
        namesString: validNames.join(','),
        embeddable: req.query.embeddable,
        playbutton: req.query.playbutton
      });
    }).fail(function(){
      res.render('index');
    });;
  } else {
    res.render('index');
  }
});

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));

