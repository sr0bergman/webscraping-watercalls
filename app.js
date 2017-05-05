process.env['MONGODB_URL'] ="mongodb://admin2:GISmaster1@aws-us-east-1-portal.25.dblayer.com:19056/Colorado?ssl=true"

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/user');
var scraper = require('./routes/scraper');

var app = express();

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
app.use('/user', users);
app.use('/scraper', scraper)

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


//var MongoClient = require('mongodb').MongoClient;
//var assert = require('assert');


var mongoose = require('mongoose');
var assert = require('assert');
var fs = require('fs');

var options = {
    mongos: {
        ssl: true,
        sslValidate: false,
    }
}
// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('open', function (err) {
    assert.equal(null, err);
    mongoose.connection.db.listCollections().toArray(function(err, collections) {
        assert.equal(null, err);
        collections.forEach(function(collection) {
            console.log(collection);
        });

        //mongoose.connection.db.close();
        //process.exit(0);
    })
});

// Let's open that connection
mongoose.connect(process.env.MONGODB_URL, options);


/*

MongoClient.connect(process.env.MONGODB_URL, options, function(err, db) {
    assert.equal(null, err);
    db.listCollections({}).toArray(function(err, collections) {
        assert.equal(null, err);
        collections.forEach(function(collection) {
            console.log(collection);
        });
        db.close();
        process.exit(0);
    })
});
*/

//CONNECT TO MONGODB PROCESS.ENV.THEASSETMAP
/*
var dbCol = require('./dbCollectionsConnection.js')
  dbCol.connect(process.env.theAssetMap, function(err) {
    if (err) {
      console.log('Unable to connect to Mongo DB.')
      //process.exit(1)
    } else {
      console.log("Mongo DB Connected")
    }
  })
*/
module.exports = app;
