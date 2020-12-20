// ==UserScript==
// @name         loteria_multi
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
    // deps
    var jqueryUI = document.createElement("script")
    jqueryUI.type = "text/javascript"
    jqueryUI.src = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"
    jqueryUI.onload = function() {
    }
    document.body.appendChild(jqueryUI)

    var jqueryUICSS = document.createElement("link")
    jqueryUICSS.setAttribute("rel", "stylesheet")
    jqueryUICSS.href = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css"
    document.body.appendChild(jqueryUICSS)

    var dialog = document.createElement("div")
    dialog.setAttribute("id", "dialog")
    dialog.setAttribute("title", "Title")
    dialog.setAttribute("style", "background-color: white;")
    document.body.appendChild(dialog)

    // storage game list
    window.gamelist = []
    window.getGames = function() {
      if (!localStorage.gamelist || !Array.isArray(JSON.parse(localStorage.gamelist))) {
        localStorage.gamelist = "[]"
        window.gamelist = []
      } else {
        window.gamelist = JSON.parse(localStorage.gamelist)
      }
      return gamelist
    }
    window.showGames = function() {
      // "Jogo " + new String((idx + 1)).padStart(4, '0') + ":    " + 
      alert(getGames().map((a, idx) => ("" + a.map(z => new String(z).padStart(2, '00')).join(', '))).join('\n'))
    }
    window.setGames = function(games) {
      window.gamelist = games
      localStorage.gamelist = JSON.stringify(games)
    }
    window.addGame = function(game) {
      var games = getGames()
      games.push(game)
      setGames(games)
    }
    window.addMultiGames = function(games) {
      var curgames = getGames()
      curgames = [...curgames, ...games]
      setGames(games)
    }
    window.clearGames = function() {
      window.gamelist = []
      localStorage.gamelist = JSON.stringify(window.gamelist)
    }
    window.travarAdicionarCarrinho = false
    window.addJogoCarrinho = function() {
      if (!travarAdicionarCarrinho) {
      	travarAdicionarCarrinho = true
        var jogoAFazer = gamelist[0]
        gamelist.splice(0, 1)
        selecionaNumeros(jogoAFazer.join(' '))
        localStorage.gamelist = JSON.stringify(window.gamelist)
        travarAdicionarCarrinho = false
      }
    }
    window.addListaJogos = function() {
      var jogos = (
        jQuery("#listajogos").val().replace(/[^0-9\t \n]/g, 'A').replace(/\t/g, ' ').replace(/[\n]+/g, '\n').trim()
        	.split(/\n/).map(
          	a=>a.replace(/(\s+|[\t]+)/g, ' ').split(/ /).map(a=>parseInt(a)
          )
        )
      )
      alert(`adicionando ${jogos.length} jogos`)
      console.log(jogos)
      addMultiGames(jogos)
    }
    window.verificaRepetidos = function() {
      var jogos = (
        jQuery("#listajogos").val().replace(/[^0-9\t \n]/g, 'A').replace(/\t/g, ' ').replace(/[\n]+/g, '\n').trim()
        	.split(/\n/).map(
          	a=>a.replace(/(\s+|[\t]+)/g, ' ').split(/ /).map(a=>parseInt(a)
          )
        )
      )
      var checkIdxsEl = (arr, busca) => arr.reduce((a,e,i) => { if (e == busca) { a.push((i+1)) } return a }, [])
      var arrJogosStr = jogos.map((a, idx) => ("" + a.sort(function(a, b) { return a - b }).map(z => new String(z).padStart(2, '00')).join(', ')))
      let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
      var repetidosLinhas = findDuplicates(arrJogosStr).map((v,i,a) => (v + "    > Linhas: " + checkIdxsEl(arrJogosStr, v)))
      alert(repetidosLinhas.join('\n'))
    }
    getGames()

    // init tools
    var divInfo = document.createElement("div")
    divInfo.id = "hackInfo"
    divInfo.style="bottom: 0px; height: 50px; left: 0px; right: 0px; position: fixed; z-index: 10000000000000; background-color: red; color: white; padding: 5px;"
    document.body.appendChild(divInfo)

    // interval carrinho lock
    window.sucessolock = false
    window.carrinholock = false
    setInterval(function() {
      var avisoCarrinhoSucesso = $("#div_alertas").text().trim()
      window.sucessolock = (avisoCarrinhoSucesso == "Aposta inserida no carrinho com sucesso.")
    }, 500)
    window.multipleDialog = function() {
      jQuery("#dialog").dialog({title: "Multiplos jogos", width: 500, height: 400, minWidth: 500, minHeight: 400 })
      jQuery("#dialog").html(`
<textarea id="listajogos"></textarea><br />
<button type="submit" onclick="addListaJogos(); return false;">Adicionar Jogos</button>
<button type="submit" onclick="verificaRepetidos(); return false;">Verifica repetidos</button>
`)
    }
    var cssJQUI = document.createElement("style")
    cssJQUI.innerHTML = `

.ui-dialog {
  background-color: white;
}

#hackInfo a {
  color: yellow;
}

#hackInfo a:hover {
  color: yellow;
}

#hackInfo .result {
  background-color: black;
  padding-left: 4px;
  padding-right: 4px;
  font-weight: bold;
  color: yellow;
}

#hackInfo button {
  color: yellow;
  background-color: black;
}

.ui-button-icon-only {
    text-indent: auto !important;
}

.ui-button {
    overflow: hidden !important;
}

#dialog textarea {
    width: 100%;
    height: calc(100% - 50px);
}

		`
    document.body.appendChild(cssJQUI)


    jQuery("#hackInfo").html(`
<span class="info"></span>
<button type="submit" onclick="multipleDialog(); return false;">Adicionar Jogos</button> 
<button type="submit" onclick="showGames(); return false;">Ver Jogos</button>
<button type="submit" onclick="clearGames(); return false;">Limpar Jogos</button>
<button type="submit" onclick="addJogoCarrinho(); return false;">Adicionar UM ao carrinho</button>

`)
    // interval info
    setInterval(function() {
      var titulo = jQuery(".jumbotron.ng-scope h1").text()
      var noCarrinho = $("#carrinho").text().trim()
      jQuery("#hackInfo .info").html(`
				<b>Jogo</b>: ${titulo} ****
				<b>Apostas na fila</b>: <span class="result">${gamelist.length}</span> ****
				<b>Apostas no carrinho</b>: <span class="result">${noCarrinho}</span> ****
				<b>Locked</b>: ${sucessolock} ****
				`)
    }, 100)
//     jQuery('button').on("onmouseover", "#btaddjogos", function(e){
//       console.log(e)
//       console.log("CLICK")
//       multipleDialog()
//     })

    // onload
    window.jQuery(function() {
    })

    // seleciona numeros do jogo e adiciona no carrinho
    window.selecionaNumeros = function(n) {
      var z = n.trim().replace(/\t/g, ' ').replace(/\s+/g, ' ')
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
      })
      
      setTimeout(function() {
        document.querySelector("#colocarnocarrinho").click()
      }, 1000)
    }
  }

  var script = document.createElement("script");
  script.type = "text/javascript";
  script.innerHTML = "window.initializeHack = " + initialize.toString() + "; initializeHack();";
  document.body.appendChild(script);

})();
