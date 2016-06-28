/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesBankTechnique(timestamp, callback) {
	var http = require('http');
	var options = {
		hostname: 'banktechnique.az',
		path: '/new/',
		method: 'GET'
	}
	var req = http.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			try {
				var string = data;
				string = string.match(/<div class="date">.*<\/div>/);
				string = string[0].match(/\d.*\d/g);
				var date = string[0];

				string = data;
				string = string.match(/<div id="first"(.|\s)*?<\/div>/);
				string = string[0].match(/\d\.\d{4}/g);
				var rates = {
					'banktechnique': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[0],
						'buy_eur': string[1],
						'buy_gbp': string[2],
						'buy_rub': 0,
						'sell_usd': string[3],
						'sell_eur': string[4],
						'sell_gbp': string[5],
						'sell_rub': 0
					}]
				}

				var readFile = require(__dirname + '/ratesReadFile.js');
				readFile('banktechnique', rates, timestamp, callback);
				
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tBankTechnique rates ERROR ' + err);
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