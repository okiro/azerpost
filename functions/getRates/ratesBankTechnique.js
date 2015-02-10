"use strict";
module.exports = function ratesBankTechnique(timestamp)
{
	var http = require('http');
	var options = {
	  hostname: 'banktechnique.az',
	  port: 80,
	  path: '/new/',
	  method: "GET"
	}
	var req = http.request(options, function(res) {
		var data = "";
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	  	data += chunk.toString();
	  });
	  res.on('end', function(){
			var string = data;
			var string = string.match(/<div class="date">.*<\/div>/);
			var string = string[0].match(/\d.*\d/g);
			var date = string[0];

			var string = data;
			var string = string.match(/<div id="first"(.|\s)*?<\/div>/);
			var string = string[0].match(/\d\.\d{4}/g);
			var rates = 
				{
				"banktechnique" : [
						{
							"date" : date,
							"timestamp" : timestamp
						},
						{
							"buy_usd" : string[0],
							"buy_eur" : string[1],
							"buy_gbp" : string[2],
							"buy_rub" : string[3],
							"sell_usd" : string[4],
							"sell_eur" : string[5],
							"sell_gbp" : string[6],
							"sell_rub" : string[7]
						}
				]
				}

			require('fs').writeFile(__dirname + "/../data/banktechnique_rates.json", JSON.stringify(rates), function(err){
				if (err) throw err;
				  console.log(timestamp + '\tGetRates:\tBankTechnique rates are saved!');
			});				
		});
	});
	
	req.end();
}