var express = require('express');
var Promise = require('bluebird');
var scraper = require('./routes/scraper');
var schedule = require('node-schedule');
var app = express();

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
            console.log('Move and Delete Old Data')
            return scraper.moveAndDeleteData()
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


//Schedule Scrape to Run Every Morning at 6:05 AM
var j = schedule.scheduleJob('05 6 * * *', function(){
  console.log('The answer to life, the universe, and everything!');
  doScrape()
});





module.exports = app;
