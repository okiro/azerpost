module.exports = function logging(fileName, logText){
	require('fs').writeFile(__dirname + "/../log/" + fileName + ".txt", logText, function(err){
		if (!err) throw err;
	});		
}