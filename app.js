var express = require('express');
var Promise = require('bluebird');
var scraper = require('./routes/scraper');
var MongoClient = require('mongodb').MongoClient;
var schedule = require('node-schedule');
var app = express();
var options = {
    mongos: {
        ssl: true,
        sslValidate: false,
    }
}
console.log('Running')
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
            console.log('Delete Old Data')
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
            console.log("Unable to send response via HTTP");
            //Sleep.sleep(100);
            //return retry(doScrape);
        })
    )
}
var j = schedule.scheduleJob('30 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
  doScrape()
});





module.exports = app;
