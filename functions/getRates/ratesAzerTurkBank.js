/*jslint node: true, asi:true */
'use strict';
var url = require('url');
module.exports = function ratesAzerTurkBank(timestamp, callback) {
	var http = require('http');
	var options = {
		hostname: 'azerturkbank.az',
		path: '/services/currency/',
		method: 'GET'
	};

	var req = http.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			try {
				var date = '';

				var string = data;
				string = string.match(/<aside class="currencys">(.|\s)*?<\/table>/);
				string = string[0].match(/\d{1,2}\.\d{2,4}/g);
				var rates = {
					'azerturkbank': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[0],
						'buy_eur': string[2],
						'buy_gbp': string[6],
						'buy_rub': 0,
						'sell_usd': string[1],
						'sell_eur': string[3],
						'sell_gbp': string[7],
						'sell_rub': 0,
					}]
				};

				var readFile = require(__dirname + '/ratesReadFile.js');
				readFile('azerturkbank', rates, timestamp, callback);
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tAzerTurkBank rates ERROR ' + err);
				callback();
			}
		});
	});

	req.on('error', function(e) {
		console.error(e);
		callback();
	});

	req.end();
};