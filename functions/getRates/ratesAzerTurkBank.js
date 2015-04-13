/*jslint node: true, asi:true */
'use strict';
module.exports = function ratesAzerTurkBank(timestamp) {
	var http = require('http');
	var options = {
		hostname: 'www.azerturkbank.biz',
		path: '/default.html',
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
				string = string.match(/<table class="currency-table(.|\s)*?<\/table>/);
				string = string[0].match(/\d{1,2}\.\d{2,4}/g);
				var rates = {
					'azerturkbank': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[4],
						'buy_eur': string[6],
						'buy_gbp': 0,
						'buy_rub': 0,
						'sell_usd': string[5],
						'sell_eur': string[7],
						'sell_gbp': 0,
						'sell_rub': 0,
					}]
				};

				require('fs').readFile(__dirname + '/../data/azerturkbank_rates.json', function(err, data) {
					if (!err) {
						var fileContent = JSON.parse(data.toString());
						var oldData = JSON.stringify(fileContent.azerturkbank[1]);
						var newData = JSON.stringify(rates.azerturkbank[1]);
						if (oldData != newData) {
							require('fs').writeFile(__dirname + '/../data/azerturkbank_rates.json', JSON.stringify(rates), function(err) {
								if (err) throw err;
								console.log(timestamp + '\tGetRates:\tAzerTurkBank rates are saved!');
							});
						}
						else {
							console.log(timestamp + '\tGetRates:\tAzerTurkBank rates has not been changed.');
						}
					}
					else {
						console.log(err);
					}
				});
			} catch (err) {
				console.log(timestamp + '\tGetRates:\tAzerTurkBank rates ERROR ' + err);
				require('fs').unlink(__dirname + '/../data/azerturkbank_rates.json', function(err){
					if (err) if (err.code !== 'ENOENT') console.log(err);
				});
			}
		});
	});

	req.on('error', function(e) {
		console.error(e);
	});

	req.end();
};