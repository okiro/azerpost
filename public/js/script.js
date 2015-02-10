"use strict";
$(document).ready(function(){
    $.getJSON( "/data/rates.json", function( obj ) {
      var items = [];
      var bankCode = "";
      
      $.each( obj.banktechnique[1], function( key, val ) {
        $("#bt_"+key).text(val);
      });
      $.each( obj.iba[1], function( key, val ) {
        $("#iba_"+key).text(val);
      });
      $.each( obj.kapitalbank[1], function( key, val ) {
        $("#kb_"+key).text(val);
      });    
      $.each( obj.bankstandard[1], function( key, val ) {
        $("#bs_"+key).text(val);
      });     
      $.each( obj.bankofbaku[1], function( key, val ) {
        $("#bob_"+key).text(val);
      });

      var currency = ['usd','eur','gbp','rub'];

      $.each(currency, function(index, value) {
        var maxEl = {};
        var max = 0;
        $("td[id$=buy_"+value+"]").each(function(){
          var $this = parseFloat( $(this).text() );
          if ($this >= max){
            max = $this;
            maxEl = $(this);
          }
        })
        maxEl.addClass('success');
      });
      $.each(currency, function(index, value) {
        var maxEl = {};
        var max = 100;
        $("td[id$=buy_"+value+"]").each(function(){
          var $this = parseFloat( $(this).text() );
          if ($this < max){
            max = $this;
            maxEl = $(this);
          }
        })
        maxEl.addClass('danger');
      });
      $.each(currency, function(index, value) {
        var maxEl = {};
        var max = 100;
        $("td[id$=sell_"+value+"]").each(function(){
          var $this = parseFloat( $(this).text() );
          if ($this < max){
            max = $this;
            maxEl = $(this);
          }
        })
        maxEl.addClass('success');
      });
      $.each(currency, function(index, value) {
        var maxEl = {};
        var max = 0;
        $("td[id$=sell_"+value+"]").each(function(){
          var $this = parseFloat( $(this).text() );
          if ($this > max){
            max = $this;
            maxEl = $(this);
          }
        })
        maxEl.addClass('danger');
      });

    });

});
