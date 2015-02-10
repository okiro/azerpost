module.exports = function concatenateRates()
{
	var fs = require('fs');
	fs.unlink(__dirname + '/rates.json', function(err)
	{
		fs.unlink(__dirname + '/../public/data/rates.json', function(err)
		{
			fs.readdir(__dirname + "/data", function(err, files){
				if (err) throw err;
				files.forEach(function (currentValue, index, array){
					fs.readFile(__dirname + "/data/" + currentValue, function (err, data) {
					  if (err) throw err;
					  fs.writeFile(__dirname + '/rates.json', data.toString(), {flag: 'a'}, function (err) {
						  if (err) throw err;
							if (index === 0) {
								fs.readFile(__dirname + "/rates.json", function (err, data) {
								  if (err) throw err;
							  	data = data.toString().replace(/\}\{/g, ",");
						  		fs.writeFile(__dirname + '/../public/data/rates.json', data, {flag: 'w'}, function (err) {
						  			if (err) throw err;
						  		});
						  	});
							}
						});					  
				  });
				});
			});
		});
	});
}