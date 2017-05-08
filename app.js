var express = require('express');
var Promise = require('bluebird')
var routes = require('./routes/index');
var scraper = require('./routes/scraper');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();
var options = {
    mongos: {
        ssl: true,
        sslValidate: false,
    }
}

app.use('/', routes);

function doScrape(){
    var data
    return Promise.resolve(
        
        scraper.getCollection()

        .then(function(){
            console.log('In First Then')
            return scraper.getData()
        })
        .then(function(d){
            data = d
            console.log('in Second Then')
            return scraper.moveData()
        })
        .then(function(){
            console.log('in Forth Then')
            return scraper.saveData(data)
        })
        
        .catch(function(err) {
            console.log('I CAUGHT YOU MOFO ' + err)
        })
    )
}

doScrape()

module.exports = app;
