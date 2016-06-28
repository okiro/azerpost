/*jslint node: true, asi:true */
'use strict';
module.exports = function ratesBankStandard(timestamp, callback) {
	var https = require('https');
	var options = {
		hostname: 'bankstandard.com',
		path: '/az/',
		method: 'GET'
	}

	var req = https.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			try {
				var string = data;
				string = string.match(/currency_wrapper index((.|\s)*?<\/div>){5}/);
				string = string[0].match(/\d{2}\.\d{2}\.\d{4}/);
				var date = string[0];


				string = data;
				string = string.match(/currency_wrapper index((.|\s)*?<\/div>){5}/);
				string = string[0].match(/\d\.\d{4}/g);
				var rates = {
					'bankstandard': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[1],
						'buy_eur': string[3],
						'buy_gbp': string[5],
						'buy_rub': string[7],
						'sell_usd': string[2],
						'sell_eur': string[4],
						'sell_gbp': string[6],
						'sell_rub': string[8]
					}]
				}
				
				var readFile = require(__dirname + '/ratesReadFile.js');
				readFile('bankstandard', rates, timestamp, callback);
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tBank Standard rates ERROR ' + err);
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