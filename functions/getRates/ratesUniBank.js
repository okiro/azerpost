/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesUniBank(timestamp) {
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
						'buy_gbp': string[6],
						'buy_rub': string[4],
						'sell_usd': string[1],
						'sell_eur': string[3],
						'sell_gbp': string[7],
						'sell_rub': string[5],
					}]
				};

				require('fs').readFile(__dirname + '/../data/unibank_rates.json', function(err, data) {
					if (!err) {
						var fileContent = JSON.parse(data.toString());
						var oldData = JSON.stringify(fileContent.unibank[1]);
						var newData = JSON.stringify(rates.unibank[1]);
						if (oldData != newData) {
							require('fs').writeFile(__dirname + '/../data/unibank_rates.json', JSON.stringify(rates), function(err) {
								if (err) throw err;
								console.log(timestamp + '\tGetRates:\tUniBank rates are saved!');
							});
						}
						else {
							console.log(timestamp + '\tGetRates:\tUniBank rates has not been changed.');
						}
					}
					else {
						console.log(err);
					}
				});
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tUniBank rates ERROR ' + err);
				require('fs').unlink(__dirname + '/../data/unibank_rates.json', function(err) {
					if (err)
						if (err.code !== 'ENOENT') console.log(err);
				});
			}
		});
	});

	req.on('error', function(e) {
		console.error(e);
	});

	req.end();
};