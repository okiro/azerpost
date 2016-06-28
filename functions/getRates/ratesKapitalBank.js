/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesKapitalBank(timestamp, callback) {
	var https = require('https');
	var options = {
		hostname: 'kapitalbank.az',
		path: '/az/currency-rates/',
		method: 'GET'
	}
	var req = https.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			var string = data;
			try {
				string = string.match(/<div class="dateDiv">(.|\s)*?<\/div>/);
				string = string[0].match(/\d{2}\.\d{2}\.\d{4}/);
				var date = string[0];

				string = data;
				string = string.match(/<div class="currency-body">(.|\s)*?<\/div>/);
				string = string[0].match(/\d{1}\.\d{4}/g);
				var rates = {
					'kapitalbank': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[0],
						'buy_eur': string[3],
						'buy_gbp': string[6],
						'buy_rub': 0,
						'sell_usd': string[1],
						'sell_eur': string[4],
						'sell_gbp': string[7],
						'sell_rub': 0
					}]
				}

				var readFile = require(__dirname + '/ratesReadFile.js');
				readFile('kapitalbank', rates, timestamp, callback);
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tKapitalBank rates ERROR ' + err);
				callback();
			}
		});
	});
	
	req.on('error', function(e) {
		console.error(e);
		callback();
	});


	req.end();
}