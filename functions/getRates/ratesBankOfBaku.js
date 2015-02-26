/*jslint node: true, asi:true */
'use strict';
module.exports = function ratesBankOfBaku(timestamp) {
	var http = require('http');
	var options = {
		hostname: 'www.bankofbaku.com',
		path: '/az/valyuta-m-z-nn-l-ri/',
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
				string = string.match(/<div class="cur_bottom">(.|\s)*?<\/table>/);
				string = string[0].match(/\d{1,2}\.\d{2,4}/g);
				var rates = {
					'bankofbaku': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[3],
						'buy_eur': string[5],
						'buy_gbp': string[9],
						'buy_rub': string[7],
						'sell_usd': string[4],
						'sell_eur': string[6],
						'sell_gbp': string[10],
						'sell_rub': string[8],
					}]
				};

				require('fs').writeFile(__dirname + '/../data/bankofbaku_rates.json', JSON.stringify(rates), function(err) {
					if (err) throw err;
					console.log(timestamp + '\tGetRates:\tBank of Baku rates are saved!');
				});
			} catch (err) {
				console.log(timestamp + '\tGetRates:\tBank of Baku rates ERROR ' + err);
			}
		});
	});

	req.on('error', function(e) {
		console.error(e);
	});

	req.end();
};