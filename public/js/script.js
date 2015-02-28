/*jslint jquery: true, asi: false*/
'use strict';
$(document).ready(function() {
  $.getJSON('/data/rates.json', function(obj) {

    var data = [];
    var type = ['buy', 'sell'];
    var currency = ['usd', 'eur', 'gbp', 'rub'];
    var classType = ['success', 'danger'];
    var maxArray = {};
    var minArray = {};
    var max = 0;
    var min = 1000;

    $.each(obj, function(bank, obj) {
      $.each(obj[1], function(key, val) {
        if (parseFloat(val) !== 0) $('#' + bank + '_' + key).text(parseFloat(val).toFixed(4));
        data.push({
          type: key,
          value: parseFloat(val)
        });
      });
    });

    $.each(type, function(key, type) {
      $.each(currency, function(key, currency) {
        $.each(data, function(key, value) {
          if (type + '_' + currency === value.type) {
            if (value.value > max) max = maxArray[value.type] = value.value;
            if (value.value < min && value.value !== 0) min = minArray[value.type] = value.value;
          }
        });
        max = 0;
        min = 1000;
      });
    });

    $.each(maxArray, function(index, value) {
      $('td[id$=' + index + ']').each(function() {
        if ($(this).text() === value.toFixed(4).toString()) {
          if (index.match(/buy/)) {
            $(this).addClass(classType[0]);
          } else {
            $(this).addClass(classType[1]);
          }
        }
      });
    });

    $.each(minArray, function(index, value) {
      $('td[id$=' + index + ']').each(function() {
        if ($(this).text() === value.toFixed(4).toString()) {
          if (index.match(/buy/)) {
            $(this).addClass(classType[1]);
          } else {
            $(this).addClass(classType[0]);
          }
        }
      });
    });

  });
});