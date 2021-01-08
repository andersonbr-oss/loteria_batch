// ==UserScript==
// @name         loteria_multi ANGULAR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adicionar multiplos jogos de uma unica vez
// @author       Anderson Calixto
// @match        https://www.loteriasonline.caixa.gov.br/silce-web/
// @grant        none
// ==/UserScript==

(function() {

  'use strict';

  var initialize = function() {
    window.jQuery(function() {
    	console.log("INICIALIZANDO...")
    	window.controller = angular.element(document.body).scope()
      window.container = angular.element(document.querySelector(".container.ng-scope")).scope()
      setInterval(function() {
        var test = angular.element(document.querySelector(".container.ng-scope")).scope()
        if (test != container) {
          container = test
        }        
      }, 20)

      /***********
       *
       * FUNÇÕES
       *
       */
      // aumentar teimosinhas
      window.aumentarTeimosinhas = function() {
				container.vm.modificarQtdTeimosinhas(true); container.$apply()
      }
      // definir teimosinhas
      window.definirTeimosinhas = function() {
				container.vm.qtdTeimosinhas = 0; container.$apply()
      }
      
      window.marcarNumero = function(num) {
        container.vm.numerosCartela[num-1].selecionado = true; container.$apply()
      }
    })
  }

  
  /***********
   *
   * Carregar o script
   *
   */
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.innerHTML = "window.initializeHack = " + initialize.toString() + "; initializeHack();";
  document.body.appendChild(script);

})();
