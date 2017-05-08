var express = require('/home/shane/webscraping-watercalls/node_modules/express');
var Promise = require('/home/shane/webscraping-watercalls/node_modules/bluebird');
var scraper = require('./routes/scraper');
var MongoClient = require('/home/shane/webscraping-watercalls/node_modules/mongodb').MongoClient;
var assert = require('/home/shane/webscraping-watercalls/node_modules/assert');
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

doScrape()




module.exports = app;
