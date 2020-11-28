// ==UserScript==
// @name         loteria
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.loteriasonline.caixa.gov.br/silce-web/
// @grant        none
// ==/UserScript==

(function() {

  'use strict';
  var fn = function(n) {
    var z = n.trim().replace(/\s+/g, ' ')
    z = z.replace(/,/g, ' ')
    if (z.split(/ /).length == 1) {
      var newz = [];
      for (var i = 0; i < z.length; i += 2) {
        newz.push(z.substring(i, i+2));
      }
      z = newz.join(" ");
    }
    Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }
    var numeros = z.replace(/[ ]+/g, " ").split(" ")
    var ids = numeros.map(function(a,b,c,d) { return "n" + parseInt(a, 10).pad() });
    ids.forEach(function(e,i) {
      window.jQuery("#" + e).click()
    });
  };

  var script = document.createElement("script");
  script.type = "text/javascript";
  script.innerHTML = "window.selecionaNumeros = " + fn.toString();
  document.body.appendChild(script);

  var initialize = function() {
    // div numeros para apostar
    var divEntrada = document.createElement("div");
    divEntrada.style="width: 500px; height: 35px; position: fixed; z-index: 10000000000000; background-color: black; top: 5px; right: 5px;";
    var input = document.createElement("input");
    input.style="width: 100%; height: 100%;";
    input.onkeydown = function(ev) {
      if (ev.keyCode == 13) {
        console.log(input.value);
        window.selecionaNumeros(input.value);
        input.value = "";
        setTimeout(function() {
          document.querySelector("#colocarnocarrinho").click();
        }, 1000);
      }
    }
    divEntrada.appendChild(input);
    document.body.appendChild(divEntrada);

    // div numeros split
    divEntrada = document.createElement("div");
    divEntrada.style="font-size: 10px; width: 700px; height: 120px; position: fixed; z-index: 10000000000000; background-color: black; bottom: 5px; right: 5px;";
    var input2 = document.createElement("textarea");
    input2.style="width: 100%; height: 100%;";
    input2.onkeydown = function(ev) {
      if (ev.keyCode == 13) {
        var n = input2.value;
        var xx = n.trim().replace(/\s+/g, ' ')
        var zz = xx.split(/\n/)
        var res = ""
        for (var mm = 0; mm < zz.length; mm++) {
          var z = zz[mm]
          z = z.replace(/,/g, ' ')
          if (z.split(/ /).length == 1) {
            var newz = [];
            for (var i = 0; i < z.length; i += 2) {
              newz.push(z.substring(i, i+2));
            }
            z = newz.join(" ");
          }
          Number.prototype.pad = function(size) {
            var s = String(this);
            while (s.length < (size || 2)) {s = "0" + s;}
            return s;
          }
          var numeros = z.replace(/[ ]+/g, " ").split(" ")
          var ids = numeros.map(function(a,b,c,d) { return parseInt(a, 10).pad() });
          res += ids.join(", ") + "\n";
        }
        console.log(res);
        alert(res);
      }
    }
    divEntrada.appendChild(input2);
    document.body.appendChild(divEntrada);
  };

  script = document.createElement("script");
  script.type = "text/javascript";
  script.innerHTML = "window.initializeHack = " + initialize.toString() + "; initializeHack();";
  document.body.appendChild(script);

})();
