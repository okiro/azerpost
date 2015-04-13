/*jslint node: true */
'use strict';
//Server create
var http = require('http');
var formatDate = require(__dirname + '/functions/formatDate');
var getContent = require(__dirname + '/functions/getContent');
var portNumber = parseInt(process.argv[2]);
if (isNaN(portNumber)) portNumber = 8080;

http.createServer(function(request, response) {
  if (request.method === 'GET') {
    getContent(request.url, response, __dirname);
  }
  request.on('end', function() {
    // console.log(formatDate(new Date()) + '\tReguest:\t' + request.method + ' URL:' + request.url);
  });
}).listen(portNumber);
console.log('Server running at http://', process.env.IP,':', portNumber);
// ----------------------------------------------

// Rates query
var ratesIba = require(__dirname + '/functions/getRates/ratesIba');
var ratesBanktechnique = require(__dirname + '/functions/getRates/ratesBankTechnique');
var ratesKapitalBank = require(__dirname + '/functions/getRates/ratesKapitalBank');
var ratesBankStandard = require(__dirname + '/functions/getRates/ratesBankStandard');
var ratesBankOfBaku = require(__dirname + '/functions/getRates/ratesBankOfBaku');
var ratesUniBank = require(__dirname + '/functions/getRates/ratesUniBank');
var ratesAzerTurkBank = require(__dirname + '/functions/getRates/ratesAzerTurkBank');

var concatenateRates = require(__dirname + '/functions/concatenateRates');

function GetRates() {
  var timestamp = formatDate(new Date());
  ratesBankOfBaku(timestamp);
  ratesKapitalBank(timestamp);
  ratesIba(timestamp);
  ratesBanktechnique(timestamp);
  ratesBankStandard(timestamp);
  ratesUniBank(timestamp);
  ratesAzerTurkBank(timestamp);
  concatenateRates();
}

GetRates();

setInterval(GetRates, 1000 * 60 * 10);