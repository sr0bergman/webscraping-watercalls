var express = require('express');
var Promise = require('bluebird')
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


function doScrape(){
    var data
    return Promise.resolve(
        
        scraper.start()

        .then(function(){
            console.log('Getting Data')
            return scraper.getData()
        })
        .then(function(d){
            data = d
            console.log('Move Old Data')
            return scraper.moveData()
        })
        .then(function(){
            console.log('Save New Data')
            return scraper.saveData(data)
        })
        .then(function(){
            console.log('Completed Scrape')
            return 
        })
        .catch(function(err) {
            console.log('I CAUGHT YOU MOFO ' + err)
        })
    )
}

doScrape()

module.exports = app;
