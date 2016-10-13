"use strict";

var parser = require('xml2json'),
	path = require('path'),
	fs = require('fs');

var apns = {
    "version": "8",
    "apn": []
};

var files = fs.readdirSync(path.join(__dirname, 'src'));

for (var i = 0, len = files.length; i < len; i++) {
	let file = path.join(__dirname,"src", files[i]);
	let apns_arr = JSON.parse(fs.readFileSync(file)).apns.apn;
	apns.apn = apns.apn.concat(apns_arr);
}

var LICENSE = fs.readFileSync(path.join(__dirname, 'LICENSE'));
var XMLdata = parser.toXml({apns: apns}, {sanitize: true});

var XML = `\
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<!--
${LICENSE}
-->\
<!-- use empty string to specify no proxy or port -->\
<!-- This version must agree with that in apps/common/res/apns.xml -->\
${XMLdata}\
`
	.replace(/(<apn .+?)><\/apn>/g, "	$1 />")
	.replace(/>(\s*)</g, ">\n$1<");

if(apns.apn.length > 0) {
	try {
		fs.mkdirSync(path.join(__dirname, "dist"));
	} catch (err) {};
	
	fs.writeFile(path.join(__dirname, "dist", "apns-conf.xml"), XML, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file " + path.join(__dirname, "dist", "apns-conf.xml") + " was saved!");
	});
}