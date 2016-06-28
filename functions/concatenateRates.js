/*jslint node: true, asi: true */
'use strict';
var fs = require('fs');
var timestamp;
module.exports = function concatenateRates(_timestamp) {
	timestamp = _timestamp;
	deleteFile('/rates.json', deleteFile('/../public/data/rates.json', readDir));
}


function deleteFile(fileName, callback) {
	fs.unlink(__dirname + fileName, function(err) {
		if (err) console.log(err);
		if (typeof callback !== 'undefined') callback();
	});
}

function readDir() {
	fs.readdir(__dirname + '/data', function(err, files) {
		if (err) throw err;
		filesLoop(files);
	});
}

function filesLoop(files) {
	files.forEach(function(currentValue, index, array) {
		if (require('path').extname(currentValue) === '.json') {
			fs.readFile(__dirname + '/data/' + currentValue, function ReadingEachFile(err, data) {
				if (err) throw err;
				fs.writeFile(__dirname + '/rates.json', data.toString(), {
					flag: 'a'
				}, function(err) {
					if (err) throw err;
					if (index === array.length - 1) {
						fs.readFile(__dirname + '/rates.json', function(err, data) {
							if (err) throw err;
							data = data.toString().replace(/\}\{/g, ',');
							fs.writeFile(__dirname + '/../public/data/rates.json', data, {
								flag: 'w'
							}, function(err) {
								if (err) throw err;
								console.log(timestamp + '\tFile Merge:\tRates concatenation is done.');
							});
						});
					}
				});
			});
		}
	});
}
