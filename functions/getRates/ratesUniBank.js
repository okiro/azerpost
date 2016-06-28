/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesUniBank(timestamp, callback) {
	var http = require('http');
	var options = {
		hostname: 'www.unibank.az',
		path: '/libraries/includes/site/tab/tab.currency.php?action=true&lang=az',
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
				string = string.match(/<div id="rate" (.|\s)*?<\/div>/);
				string = string[0].match(/\d{1,2}\.\d{2,4}/g);
				var rates = {
					'unibank': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[0],
						'buy_eur': string[2],
						'buy_gbp': string[4],
						'buy_rub': string[6],
						'sell_usd': string[1],
						'sell_eur': string[3],
						'sell_gbp': string[5],
						'sell_rub': string[7],
					}]
				};

				var readFile = require(__dirname + '/ratesReadFile.js');
				readFile('unibank', rates, timestamp, callback);
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tUniBank rates ERROR ' + err);
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