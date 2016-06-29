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
    getContent(request, response, __dirname);
  }
  request.on('end', function() {
    //console.log(formatDate(new Date()) + '\tReguest:\t' + request.method + ' URL:' + request.url);
  });
}).listen(portNumber);
console.log('Server running at http://', process.env.IP, ':', portNumber);
// ----------------------------------------------

// Rates query
var ratesIba = require(__dirname + '/functions/getRates/ratesIba');
// var ratesBanktechnique = require(__dirname + '/functions/getRates/ratesBankTechnique');
var ratesKapitalBank = require(__dirname + '/functions/getRates/ratesKapitalBank');
var ratesBankStandard = require(__dirname + '/functions/getRates/ratesBankStandard');
var ratesBankOfBaku = require(__dirname + '/functions/getRates/ratesBankOfBaku');
var ratesUniBank = require(__dirname + '/functions/getRates/ratesUniBank');
var ratesAzerTurkBank = require(__dirname + '/functions/getRates/ratesAzerTurkBank');

var concatenateRates = require(__dirname + '/functions/concatenateRates');


function getRates() {
  
  var timestamp = formatDate(new Date());
  ratesIba(timestamp, next2);
  
  // function next1(){
  //   var timestamp = formatDate(new Date());
  //   ratesBanktechnique(timestamp, next2);
  // }
  
  function next2(){
    var timestamp = formatDate(new Date());
    ratesKapitalBank(timestamp, next3);
  }
  
  function next3(){
    var timestamp = formatDate(new Date());
    ratesBankStandard(timestamp, next4);
  }  
  
  function next4() {
    var timestamp = formatDate(new Date());
    ratesBankOfBaku(timestamp, next5);    
  }
  
  function next5() {
    var timestamp = formatDate(new Date());
    ratesUniBank(timestamp, next6);    
  }
  
  function next6() {
    var timestamp = formatDate(new Date());
    ratesAzerTurkBank(timestamp, concatenate);    
  }  
  
  function concatenate(){
     var timestamp = formatDate(new Date());
    concatenateRates(timestamp);
  }


}

getRates();
setInterval(getRates, 1000 * 60 * 10);