var express = require('express');
var router = express.Router();

"use strict"

// Import dependencies
const req = require("tinyreq")

req("https://data.colorado.gov/api/views/sjpy-y3gm/rows.json?accessType=DOWNLOAD", function (err, body) {
    //console.log(err || body); // Print out the HTML
    var json = JSON.parse(body)
    
    console.log(json.data[8])
});

module.exports = router;