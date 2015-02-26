var fs = require('fs');
var path = require('path');

module.exports = function getContent(requestUrl, response, dirname) {
  if (requestUrl === '/') {
    fs.readFile(dirname + "/public/index.html", function(err, data) {
      if (err) console.log(err + "- Not found");;
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(data);
    });
  } else {
    fs.readFile(dirname + "/public" + requestUrl, function(err, data) {
      if (err && requestUrl != "/favicon.ico") console.log(err + "- Not found" + requestUrl);;
      switch (path.extname(requestUrl)) {
        case ".js":
          response.writeHead(200, {
            'Content-Type': 'application/javascript'
          });
          break;
        case ".css":
          response.writeHead(200, {
            'Content-Type': 'text/css'
          });
          break;
        case ".json":
          response.writeHead(200, {
            'Content-Type': 'application/json'
          });
          break;
      }
      response.end(data);
    });
  }
}