// scraper.js
// =======================================
var express = require('express');
var router = express.Router();
var Promise = require('bluebird')
var objectId = require("mongodb").ObjectId

const req = require("tinyreq")
"use strict"

process.env['theAssetMap'] ='mongodb://admin2:GISmaster1@candidate.60.mongolayer.com:10797,candidate.4.mongolayer.com:11032/assetData?replicaSet=set-57043443bb5871bac4000dfe'

//CONNECT TO MONGODB PROCESS.ENV.THEASSETMAP
var dbCol = require('../dbCollectionsConnection.js')
  

module.exports = {
	start: function (){
		return new Promise(function(resolve, reject){
			console.log('=======STARTING SCRAPE========')
			dbCol.connect(process.env.theAssetMap, function(err) {
			    if (err) {
			      console.log('Unable to connect to Mongo DB.')
			      reject(err)
			    } else {
			      console.log("Mongo DB Connected")
			      resolve()
			    }
			  })
			
		})
	},
	getData: function (){
		return new Promise(function(resolve, reject){
			req("https://data.colorado.gov/api/views/sjpy-y3gm/rows.json?accessType=DOWNLOAD", function (err, body) {
				if(err){
					return reject(err)
				}
			    var json = JSON.parse(body)
			    var data = json.data
			    if(!data.length){
			    	return reject(err)
			    } else {
			    	resolve(data)
			    }
		    	
			});
		})

	},
	moveAndDeleteData: function(data){

		return new Promise(function(resolve, reject){

			    var collection = dbCol.get().collection('toddcreek_water_calls');
			    	console.log('Got Water Calls Collection')
			    //var collection2 = dbCol.get().collection('toddcreek_water_calls_historic');
			    //	console.log('Got Water Calls HISTORIC Collection')

					collection.find({}, function(err, resultCursor) {
					  function processItem(err, item) {
					    if(item === null) {
					    	console.log('ADD DONE')
					    	
					      	return resolve(); // All done!
					    } else {
					    	console.log('DELETING... ')
					    	//collection2.insert(item)
					    	collection.deleteOne({ "_id": objectId(item._id) })
					    	resultCursor.nextObject(processItem);
					    }

					  }

					  resultCursor.nextObject(processItem);
					})  


			
			  
		})


	},

	saveData: function (data){
		
		return new Promise(function(resolve, reject){
				

				var collection = dbCol.get().collection('toddcreek_water_calls');
			    	console.log('SAVE COLLECTION ' + collection)
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
				                if(data.length){
					         		console.log(data.length)
					         		update(data)
					         	} else {
					         		dbCol.close()
					         		console.log('Mongo Closed')
						      		return resolve(); // All done!
					         	}
					            
				            })
				            .catch(function(err) {
				                console.error("Error Inserting Mongo Data")
				                reject()
				            });
				         	
			        }
	        	update(data)


			  
			
	        
						
		})


	},
};



