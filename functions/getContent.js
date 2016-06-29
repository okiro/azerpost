/*jslint node: true, asi:true */
'use strict';
var fs = require('fs');
var path = require('path');
var zlib = require("zlib");

module.exports = function getContent(request, response, dirname) {

  if (request.url === '/') request.url = '/index.html';
  if (request.url === '/favicon.ico') {
    response.writeHead(200, {
      'Content-Type': 'image/x-icon'
    });
    response.end();
    return;
  }
  switch (path.extname(request.url)) {
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

  var raw = fs.createReadStream(dirname + '/public' + request.url);
  raw.on('error', function(error) {});

  var acceptEncoding = request.headers['accept-encoding'];
  if (!acceptEncoding) {
    acceptEncoding = '';
  }

  if (acceptEncoding.match(/\bdeflate\b/)) {
    response.writeHead(200, {
      'Content-Encoding': 'deflate'
    });
    raw.pipe(zlib.createDeflate()).pipe(response);
  }
  else if (acceptEncoding.match(/\bgzip\b/)) {
    response.writeHead(200, {
      'Content-Encoding': 'gzip'
    });
    raw.pipe(zlib.createGzip()).pipe(response);
  }
  else {
    response.writeHead(200, {});
    raw.pipe(response);
  }
}