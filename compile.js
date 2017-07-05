"use strict";

const
	path = require('path'),
	fs = require('fs'),
	apns = require('./index.js');

if(apns.apn.length > 0) {
	try {
		fs.mkdirSync(path.join(__dirname, "dist"));
	} catch (err) {};
	
	fs.writeFile(path.join(__dirname, "dist", "apns-conf.json"), apns.toJSON(), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file " + path.join(__dirname, "dist", "apns-conf.json") + " was saved!");
	});

	fs.writeFile(path.join(__dirname, "dist", "apns-conf.xml"), apns.toXML(), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file " + path.join(__dirname, "dist", "apns-conf.xml") + " was saved!");
	});
}