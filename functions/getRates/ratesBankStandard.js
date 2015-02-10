"use strict";
module.exports = function ratesBankStandard(timestamp)
{
	var https = require('https');
	var options = {
	  hostname: 'bankstandard.com',
	  path: '/az/',
	  method: "GET"
	}

	var req = https.request(options, function(res) {
		var data = "";
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	  	data += chunk.toString();
	  });
	  res.on('end', function(){
			var string = data;
			var string = string.match(/currency_wrapper index((.|\s)*?<\/div>){5}/);			
			var string = string[0].match(/\d{2}\.\d{2}\.\d{4}/);
			var date = string[0];


			var string = data;
			var string = string.match(/currency_wrapper index((.|\s)*?<\/div>){5}/);		
			var string = string[0].match(/\d\.\d{4}/g);
			var rates = 
				{
				"bankstandard" : [
						{
							"date" : date,
							"timestamp" : timestamp
						},
						{
							"buy_usd" : string[1],
							"buy_eur" : string[3],
							"buy_gbp" : string[5],
							"buy_rub" : string[7],
							"sell_usd" : string[2],
							"sell_eur" : string[4],
							"sell_gbp" : string[6],
							"sell_rub" : string[8]
						}
				]
				}

			require('fs').writeFile(__dirname + "/../data/bankstandard_rates.json", JSON.stringify(rates), function(err){
				if (err) throw err;
				  console.log(timestamp + '\tGetRates:\tBank Standard rates are saved!');
			});				
		});
	});
	
	req.on('error', function(e) {
	  console.error(e);
	});
	
	req.end();
}