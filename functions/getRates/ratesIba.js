/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesIba(timestamp) {
	var http = require('http');
	var options = {
		hostname: 'www.ibar.az',
		path: '/',
		method: 'GET'
	};

	var req = http.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			var string = data;
			try {
				// Rate date
				string = string.match(/<div class="title">Əsas valyuta m.*<\/div>/);
				string = string[0].match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/);
				var date = string[0];

				// Rates table
				string = data;
				string = string.match(/<div class="rates">((.|\s)*?<\/div>){30}/);
				string = string[0].match(/\d\.\d{2,4}/g);
				var rates = {
					'iba': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[11],
						'buy_eur': string[2],
						'buy_gbp': string[5],
						'buy_rub': string[8],
						'sell_usd': string[12],
						'sell_eur': string[3],
						'sell_gbp': string[6],
						'sell_rub': string[9]
					}]
				};

				require('fs').readFile(__dirname + '/../data/iba_rates.json', function(err, data) {
					if (!err) {
						var fileContent = JSON.parse(data.toString());
						var oldData = JSON.stringify(fileContent.iba[1]);
						var newData = JSON.stringify(rates.iba[1]);
						if (oldData != newData) {
							require('fs').writeFile(__dirname + '/../data/iba_rates.json', JSON.stringify(rates), function(err) {
								if (err) throw err;
								console.log(timestamp + '\tGetRates:\tIBA rates are saved!');
							});
						}
						else {
							console.log(timestamp + '\tGetRates:\tIBA rates has not been changed.');
						}
					}
					else {
						require('fs').writeFile(__dirname + '/../data/iba_rates.json', JSON.stringify(rates), function(err) {
							if (err) throw err;
							console.log(timestamp + '\tGetRates:\tIBA rates are saved!');
						});
					}
				});
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tIBA rates ERROR ' + err);
				require('fs').unlink(__dirname + '/../data/iba_rates.json', function(err) {
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
}