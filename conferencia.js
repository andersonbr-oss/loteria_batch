var linhas = Array.from(document.querySelector("table.result").querySelectorAll("tbody tr"))
var valores = {
    "11": 5,
    "12": 10,
    "13": 25,
    "14": 50000,
    "15": 2000000
}
var quantidades = linhas.map(e => {
    var results_linha = (Array.from(e.querySelectorAll("td")).filter((_,i) => i>3))
    results_linha = results_linha.map(ej => ej.innerHTML.trim() == '' ? 0 : parseInt(ej.innerHTML.trim(), 10)).filter((v) => v>0)
    results_linha = results_linha.reduce((pv, v, i, arr) => {
        if (!pv[v]) { pv[v] = 1 } else { pv[v]++ }
        return pv
    }, {})
    return results_linha
}).reduce((pv, v, i, arr) => {
    Object.keys(v).map(k => {
        pv[k] += v[k]
    })
    return pv
}, {
    "11": 0, "12": 0, "13": 0, "14": 0, "15": 0
})
var quantidades_valores = Object.keys(valores).map(v => { return { [v]: `R$ ${valores[v] * quantidades[v]},00` } } ).reduce((pv, v, i, arr) => {
    Object.keys(v).map(k => { pv[k] = v[k] })
    return pv
}, {
    "11": 0, "12": 0, "13": 0, "14": 0, "15": 0
})
alert(`
11: ${quantidades[11]} acertos. ${quantidades_valores[11]}
12: ${quantidades[12]} acertos. ${quantidades_valores[12]}
13: ${quantidades[13]} acertos. ${quantidades_valores[13]}
14: ${quantidades[14]} acertos. ${quantidades_valores[14]}
15: ${quantidades[15]} acertos. ${quantidades_valores[15]}
`)
