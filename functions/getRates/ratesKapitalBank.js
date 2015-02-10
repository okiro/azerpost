"use strict";
module.exports = function ratesKapitalBank(timestamp)
{
	var http = require('http');
	var options = {
	  hostname: 'www.kapitalbank.az',
	  path: '/?/az/exchange/',
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
			//console.log(string); id="bla(.|\s)*?<\/table>
			var string = string.match(/id="bla(.|\s)*?<\/table>/);
			var string = string[0].match(/\d{1,2}.*\d{4}/);
			console.log(string[0]);
			var date = string[0];

			var string = data;
			var string = string.match(/\d\.\d{4}/g);
			var rates = 
				{
				"kapitalbank" : [
						{
							"date" : date,
							"timestamp" : timestamp
						},
						{
							"buy_usd" : string[0],
							"buy_eur" : string[2],
							"buy_gbp" : string[6],
							"buy_rub" : string[4],
							"sell_usd" : string[1],
							"sell_eur" : string[3],
							"sell_gbp" : string[7],
							"sell_rub" : string[5]
						}
				]
				}

			require('fs').writeFile(__dirname + "/../data/kapitalbank_rates.json", JSON.stringify(rates), function(err){
				if (err) throw err;
				  console.log('KapitalBank rates are saved!');
			});				
		});
	});
	
	req.end();
}