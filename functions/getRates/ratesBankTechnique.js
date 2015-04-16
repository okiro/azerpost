/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesBankTechnique(timestamp) {
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

				require('fs').readFile(__dirname + '/../data/banktechnique_rates.json', function(err, data) {
					if (!err) {
						var fileContent = JSON.parse(data.toString());
						var oldData = JSON.stringify(fileContent.banktechnique[1]);
						var newData = JSON.stringify(rates.banktechnique[1]);
						if (oldData != newData) {
							require('fs').writeFile(__dirname + '/../data/banktechnique_rates.json', JSON.stringify(rates), function(err) {
								if (err) throw err;
								console.log(timestamp + '\tGetRates:\tBankTechnique rates are saved!');
							});
						}
						else {
							console.log(timestamp + '\tGetRates:\tBankTechnique rates has not been changed.');
						}
					}
					else {
						require('fs').writeFile(__dirname + '/../data/banktechnique_rates.json', JSON.stringify(rates), function(err) {
							if (err) throw err;
							console.log(timestamp + '\tGetRates:\tBankTechnique rates are saved!');
						});
					}
				});
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tBankTechnique rates ERROR ' + err);
				// require('fs').unlink(__dirname + '/../data/banktechnique_rates.json', function(err) {
				// 	if (err)
				// 		if (err.code !== 'ENOENT') console.log(err);
				// });
			}
		});
	});

	req.on('error', function(e) {
		console.error(e);
	});

	req.end();
}