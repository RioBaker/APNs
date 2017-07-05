"use strict";

const
    parser = require('xml2json'),
    jsesc = require('jsesc'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    APNconfig = require('./package.json').apns;

module.exports = (function(global, undefined) {

    function APNs() {

        let apns = Object.create(Object);

        apns.version = APNconfig.version;

        apns.apn = [];

        let files = fs.readdirSync(path.join(__dirname, 'src'));

        for (let i = 0, len = files.length; i < len; i++) {
            let file = path.join(__dirname, "src", files[i]);
            let part_apns = JSON.parse(fs.readFileSync(file)).apns;
            if (parseInt(part_apns.version) === parseInt(APNconfig.version)) {
                apns.apn = apns.apn.concat(part_apns.apn);
            }
        }

        apns.prototype.toXML = function toXML() {
            let LICENSE = fs.readFileSync(path.join(__dirname, 'LICENSE'));
            let XMLdata = parser.toXml({ apns: this }, { sanitize: false });

            return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
                `<!--\n${LICENSE}\n-->\n` +
                '<!-- use empty string to specify no proxy or port -->\n' +
                '<!-- This version must agree with that in apps/common/res/apns.xml -->\n' +
                `${XMLdata}\n`
                .replace(/(<apn .+?)><\/apn>/g, "	$1 />")
                .replace(/>(\s*)</g, ">\n$1<");
        }

        apns.prototype.toJSON = function toJSON(indt) {

            return jsesc(this, {
                quotes: 'double',
                minimal: true,
                compact: !indt && true || false,
                indent: indt || '    '
            });
        }

        return apns;
    }

    return new APNs();

})(global);
