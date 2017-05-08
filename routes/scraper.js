// scraper.js
// =======================================
var express = require('express');
var router = express.Router();
var Promise = require('bluebird')
var objectId = require("mongodb").ObjectId
var collection
var collection2
const req = require("tinyreq")
"use strict"

var MongoClient = require("mongodb").MongoClient;
 
var MONGO_CONNECTION_STRING = 'mongodb://admin2:GISmaster1@aws-us-east-1-portal.25.dblayer.com:19056/Colorado?ssl=true';
 


module.exports = {

	getData: function (){
		return new Promise(function(resolve, reject){
			req("https://data.colorado.gov/api/views/sjpy-y3gm/rows.json?accessType=DOWNLOAD", function (err, body) {
				if(err){
					return reject()
				}
			    var json = JSON.parse(body)
			    var data = json.data
			    if(!data.length){
			    	return reject()
			    } else {
			    	resolve(data)
			    }
		    	
			});
		})

	},
	moveData: function(data){

		return new Promise(function(resolve, reject){
			MongoClient
			  .connect(MONGO_CONNECTION_STRING)
			  .then((db) => {

			    var collection = db.collection('water_calls');
			    var collection2 = db.collection('water_calls_historic');


					collection.find({}, function(err, resultCursor) {
					  function processItem(err, item) {
					    if(item === null) {
					    	console.log('ADD DINE')
					    	db.close()
					      	return resolve(); // All done!
					    } else {
					    	collection2.insert(item)
					    	collection.deleteOne({ "_id": objectId(item._id) })
					    	resultCursor.nextObject(processItem);
					    }

			
					   
					  }

					  resultCursor.nextObject(processItem);
					})  


			  })
			  .catch((error) => {
			    // error handle the connection
			  });
		})
		



	},

	saveData: function (data){
		console.log('IN SAVE')
		console.log(data)
		return new Promise(function(resolve, reject){
			MongoClient
			  .connect(MONGO_CONNECTION_STRING)
			  .then((db) => {

			    var collection = db.collection('water_calls');
			    
			    	function update(data){
						var doc = data.pop()
						var dataDateTime = doc[9].split('T')
						var priorityDate = doc[14].split('T')
						var date = new Date().toISOString().split('T')
						
						var obj = {}
							obj['type'] = 'Feature'
							obj['properties'] = {}
							obj['properties']['Scrape Date'] = date
							obj['properties']['Admin Scenario'] = doc[8]
							obj['properties']['Date'] = dataDateTime[0]
							obj['properties']['Time'] = dataDateTime[1]
							obj['properties']['Location Structure Name'] = doc[11]
							obj['properties']['Priority Structure Name'] = doc[12]
							obj['properties']['Priority Admin No'] = doc[13]
							obj['properties']['Priority Date'] = priorityDate[0]
							obj['properties']['Priority No'] = doc[15]
							obj['properties']['Priority Amount'] = doc[16]
							obj['properties']['Priority Units'] = doc[17]
							obj['properties']['IDKey19735'] = doc[18]
							obj['geometry'] = {}
							obj['geometry']['type'] = 'Point'
							obj['geometry']['coordinates'] = [ doc[19][2],doc[19][1]	]

							collection.insert(obj)
				            .then(function() {
				                console.log("Doc Inserted")
				            })
				            .catch(function(err) {
				                console.error("Error Inserting Mongo Data")
				                reject()
				            });
				         	if(data.length > 0){
				         		update(data)
				         	} else {
				         		db.close()
					      		return resolve(); // All done!
				         	}
			        }
	        	update(data)


			  })
			  .catch((error) => {
			    // error handle the connection
			  });
			
	        
						
		})

	},
};



