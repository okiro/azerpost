/*jslint node: true, asi:true */
'use strict';
module.exports = function(bankName, rates, timestamp, callback) {
    require('fs').readFile(__dirname + '/../data/' + bankName + '_rates.json', function(err, data) {
        if (!err) {
            var fileContent = JSON.parse(data.toString());
            var oldData = JSON.stringify(fileContent[bankName][1]);
            var newData = JSON.stringify(rates[bankName][1]);
            if (oldData != newData) {
                require('fs').writeFile(__dirname + '/../data/' + bankName + '_rates.json', JSON.stringify(rates), function(err) {
                    if (err) throw err;
                    console.log(timestamp + '\tGetRates:\t' + bankName + ' rates are saved!');
                    callback();
                });
            }
            else {
                console.log(timestamp + '\tGetRates:\t' + bankName + ' rates has not been changed.');
                callback();
            }
        }
        else {
            require('fs').writeFile(__dirname + '/../data/' + bankName + '_rates.json', JSON.stringify(rates), function(err) {
                if (err) throw err;
                console.log(timestamp + '\tGetRates:\t' + bankName + ' rates are saved!');
                callback();
            });
        }
    });
}