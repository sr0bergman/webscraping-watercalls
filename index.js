'use strict';

process.env['theAssetMap'] ='mongodb://admin2:GISmaster1@candidate.60.mongolayer.com:10797,candidate.4.mongolayer.com:11032/assetData?replicaSet=set-57043443bb5871bac4000dfe'
var env           = process.env.NODE_ENV || 'development'

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var webhookLeftHandWater = require('./routes/webhook.lefthandwater')
var webhookGreatRock = require('./routes/webhook.greatrock')
var webhookPinnacle = require('./routes/webhook.pinnacle')
var webhookTamarack = require('./routes/webhook.tamarack')

var app = express();


var dbCol = require('./dbCollectionsConnection.js')
  dbCol.connect(process.env.theAssetMap, function(err) {
    if (err) {
      console.log('Unable to connect to Mongo DB.')
      process.exit(1)
    } else {
      console.log("Mongo DB Connected")
    }
  })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', webhookGreatRock);
app.use('/', webhookLeftHandWater);
app.use('/', webhookPinnacle);
app.use('/', webhookTamarack);







// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 5000;

app.set('port', port);
app.set('ipaddress', ipaddress);

var server = app.listen(app.get('port'), app.get('ipaddress'), function() {
  console.log('Map running at http://%s:%d ',app.get('ipaddress'), app.get('port'));
});

process.once('SIGUSR2', function() {
  shutdown();
});

process.on('SIGINT', function() {
  shutdown();
});

process.on('SIGTERM', function() {
  shutdown(); 
});

//process.on('exit', function() {
  //shutdown();
//});

function shutdown(){
  server._connections=0 
  server.close(function () {
        console.log("Closed out remaining connections.");
        dbCol.close();
        console.log("Production DB Closed")
        process.exit();
    });
  setTimeout( function () {
        console.error("Could not close connections in time, forcing shut down");
        process.exit(1);
    }, 30*1000);
}
