var express = require('express');
var Promise = require('bluebird');
var retry = require('bluebird-retry');
var Sleep = require('sleep');
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
            console.log("Unable to send response via HTTP");
            Sleep.sleep(1);
            return retry(doScrape);
        })
    )
}


var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 10 11 * * *',
  onTick: function() {
    /*
     * Runs every day
     * at 11:10:00 AM. 
     */
    doScrape()
  },
  start: true,
  timeZone: 'America/Denver'
});
job.start();

module.exports = app;
