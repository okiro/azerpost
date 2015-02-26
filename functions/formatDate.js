/*jslint node: true, asi: true */
'use strict';
module.exports = function formatDate(d) {
  var dd = d.getDate()
  if (dd < 10) dd = '0' + dd
  var mm = d.getMonth() + 1
  if (mm < 10) mm = '0' + mm
  var yy = d.getFullYear() % 100
  if (yy < 10) yy = '0' + yy
  var h = d.getHours()
  if (h < 10) h = '0' + h
  var min = d.getMinutes()
  if (min < 10) min = '0' + min
  var sec = d.getSeconds()
  if (sec < 10) sec = '0' + sec
    // var msec = d.getMilliseconds()
    //if ( h < 10 ) h = '0' + h
  return dd + '.' + mm + '.' + yy + ' ' + h + ':' + min + ':' + sec;
}