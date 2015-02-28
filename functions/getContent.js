/*jslint node: true, asi:true */
'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function getContent(requestUrl, response, dirname) {
  if (requestUrl === '/') {
    fs.readFile(dirname + '/public/index.html', function(err, data) {
      if (err) console.log('Request:', requestUrl, ' not found. Error', err.code);
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(data);
    });
  } else {
    fs.readFile(dirname + '/public' + requestUrl, function(err, data) {
      if (err && requestUrl != '/favicon.ico') if (err) console.log('Request:', requestUrl, ' not found. Error', err.code);
      switch (path.extname(requestUrl)) {
        case '.js':
          response.writeHead(200, {
            'Content-Type': 'application/javascript'
          });
          break;
        case '.css':
          response.writeHead(200, {
            'Content-Type': 'text/css'
          });
          break;
        case '.json':
          response.writeHead(200, {
            'Content-Type': 'application/json'
          });
          break;
      }
      response.end(data);
    });
  }
}