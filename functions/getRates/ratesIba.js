"use strict";
module.exports = function ratesIba(timestamp)
{
	var http = require('http');
	var options = {
	  hostname: 'www.ibar.az',
	  port: 80,
	  path: '/',
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
			
			// Rate date
			var string = string.match(/<div class="title">Əsas valyuta m.*<\/div>/);
			var string = string[0].match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/);
			var date = string[0];

			// Rates table
			var string = data;
			var string = string.match(/<div class="rates">((.|\s)*?<\/div>){30}/);
		 	var string = string[0].match(/\d.\d{3,4}/g);
			var rates = 
				{
				"iba" : [
						{
							"date" : date,
							"timestamp" : timestamp
						},
						{
							"buy_usd" : string[11],
							"buy_eur" : string[2],
							"buy_gbp" : string[5],
							"buy_rub" : string[8],
							"sell_usd" : string[12],
							"sell_eur" : string[3],
							"sell_gbp" : string[6],
							"sell_rub" : string[9]
						}
				]
				}

				require('fs').writeFile(__dirname + "/../data/iba_rates.json", JSON.stringify(rates), function(err){
					if (err) throw err;
					  console.log('IBA rates are saved!');
				});

		});
	});
	
	req.end();
}