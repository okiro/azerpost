/*jslint node: true, asi: true */
'use strict';
module.exports = function ratesKapitalBank(timestamp) {
	var http = require('http');
	var options = {
		hostname: 'www.kapitalbank.az',
		path: '/az/current-rates/',
		method: 'GET'
	}
	var req = http.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			var string = data;
			try {
				string = string.match(/<div class="table">(.|\s)*?<\/div>/);
				string = string[0].match(/\d{2}\.\d{2}\.\d{4}/);
				var date = string[0];

				string = data;
				string = string.match(/<div class="table">(.|\s)*?<\/div>/);				
				string = string[0].match(/\d{1}\.\d{4}/g);
				var rates = {
					'kapitalbank': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[1],
						'buy_eur': string[3],
						'buy_gbp': string[7],
						'buy_rub': string[5],
						'sell_usd': string[2],
						'sell_eur': string[4],
						'sell_gbp': string[8],
						'sell_rub': string[6]
					}]
				}

				require('fs').readFile(__dirname + '/../data/kapitalbank_rates.json', function(err, data) {
					if (!err) {
						var fileContent = JSON.parse(data.toString());
						var oldData = JSON.stringify(fileContent.kapitalbank[1]);
						var newData = JSON.stringify(rates.kapitalbank[1]);
						if (oldData != newData) {
							require('fs').writeFile(__dirname + '/../data/kapitalbank_rates.json', JSON.stringify(rates), function(err) {
								if (err) throw err;
								console.log(timestamp + '\tGetRates:\tKapitalBank rates are saved!');
							});
						}
						else {
							console.log(timestamp + '\tGetRates:\tKapitalBank rates has not been changed.');
						}
					}
					else {
						console.log(err);
					}
				});
			} catch (err) {
				console.log(timestamp + '\tGetRates:\tKapitalBank rates ERROR ' + err);
				require('fs').unlink(__dirname + '/../data/kapitalbank_rates.json', function(err){
					if (err) if (err.code !== 'ENOENT') console.log(err);
				});					
			}
		});

		req.on('error', function(e) {
			console.error(e);
		});
	});

	req.end();
}