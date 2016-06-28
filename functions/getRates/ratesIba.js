/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesIba(timestamp, callback) {
	var https = require('https');
	var options = {
		hostname: 'www.ibar.az',
		path: '/',
		method: 'GET'
	};

	var req = https.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			var string = data;
			try {
				// Rate date
				string = string.match(/<div id="exchange">(.|\s)*?<\/time>/);
				string = string[0].match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/);
				var date = string[0];

				// Rates table
				string = data;
				string = string.match(/<li class="first">((.|\s)*?<\/li>){30}/);
				string = string[0].match(/\d\.\d{2,4}/g);
				var rates = {
					'iba': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[1],
						'buy_eur': string[4],
						'buy_gbp': string[7],
						'buy_rub': string[10],
						'sell_usd': string[2],
						'sell_eur': string[5],
						'sell_gbp': string[8],
						'sell_rub': string[11]
					}]
				};

				var readFile = require(__dirname + '/ratesReadFile.js');
				readFile('iba', rates, timestamp, callback);
				
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tIBA rates ERROR ' + err);
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