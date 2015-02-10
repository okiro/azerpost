"use strict";
module.exports = function ratesBankOfBaku(timestamp)
{
	var http = require('http');
	var options = {
	  hostname: 'www.bankofbaku.com',
	  path: '/az/valyuta-m-z-nn-l-ri/',
	  method: 'GET'
	}

	var req = http.request(options, function(res) {
		var data = "";
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	  	data += chunk.toString();
	  });
	  res.on('end', function(){
			var date = ''

			var string = data;
			var string = string.match(/<div class="cur_bottom">(.|\s)*?<\/table>/);		
			var string = string[0].match(/\d{1,2}\.\d{3,4}/g);
			var rates = 
				{
				"bankofbaku" : [
						{
							"date" : date,
							"timestamp" : timestamp
						},
						{
							"buy_usd" : round10(1 / string[1], -4),
							"buy_eur" : round10(1 / string[4], -4),
							"buy_gbp" : round10(1 / string[10], -4),
							"buy_rub" : round10(1 / string[7], -4),
							"sell_usd" : round10(1 / string[2], -4),
							"sell_eur" : round10(1 / string[5], -4),
							"sell_gbp" : round10(1 / string[11], -4),
							"sell_rub" : round10(1 / string[8], -4)
						}
				]
				}

			require('fs').writeFile(__dirname + "/../data/bankofbaku_rates.json", JSON.stringify(rates), function(err){
				if (err) throw err;
				  console.log('Bank of Baku rates are saved!');
				  return true;
			});				
		});
	});
	
	req.on('error', function(e) {
	  console.error(e);
	});
	
	req.end();
}


function round10(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math.round(value);
    }
    value = +value;
    exp = +exp;
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
};