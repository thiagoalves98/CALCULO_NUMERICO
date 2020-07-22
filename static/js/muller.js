function draw() {
	try{
		//Variável que irá armazenar os conjuntos de pontos cartesianos do gráfico
                var data = []

		//Parte do código que vai plotar a equação que o usuário colocou na entrada.
                //Salva o valor do campo eq em uma variável
                const expressao = document.getElementById('eq').value
                //Compila o valor de uma string para uma expressão JS
                const expr = math.compile(expressao)
		
                //Define o pontos que serão aplicados na equação
                const xValores = math.range(-10, 10, 1).toArray()
                //Aplica os valores de x definidos acima na equação para descobrir y
                const yValores = xValores.map(function (x) {
                	return expr.eval({x: x})
                })                      
                //Monta os pontos da equação que serão aplicados no gráfico
                const trace1 = {
                        x: xValores,
                        y: yValores,
                        type: 'scatter'
                }
                data.push(trace1)
		
		//Pega os valores dos formulários HTML e converte de texto para número complexo
                var p0 = math.complex(document.getElementById('p0').value)
                var p1 = math.complex(document.getElementById('p1').value)
		var p2 = math.complex(document.getElementById('p2').value)
		console.log("p0: " + p0 + "\np1: " + p1 + "\np2: " + p2)
                const tol = Number(document.getElementById('tol').value)
                const iMax = Number(document.getElementById('iteracoes').value)

		var i = 2;
		while(i <= iMax) {
			var h1 = math.subtract(p1,p0)
			var h2 = math.subtract(p2,p1)
			console.log("h1: " + h1 + "\nh2: " + h2)

			var sig1 = math.chain(expr.eval({x: p1}))
				       .subtract(expr.eval({x: p0}))
				       .divide(h1)
				       .done()
			var sig2 = math.chain(expr.eval({x: p2}))
				       .subtract(expr.eval({x: p1}))
				       .divide(h2)
				       .done()
			var d = math.chain(sig2)
				    .subtract(sig1)
				    .divide(math.add(h2, h1))
				    .done()
			console.log("sig1: " + sig1 + "\nsig2: " + sig2 + "\nd: " + d)

			var b = math.chain(h2)
				    .multiply(d)
				    .add(sig2)
				    .done()
			var D = math.sqrt(math.chain(expr.eval({x: p2}))
				    	      .multiply(d)
	  				      .multiply(-4)
					      .add(math.pow(b,2))
					      .done())
			console.log("b: " + b + "\nD: " + D)

			var E =	0		
			if (math.abs(math.subtract(b,D)) < math.abs(math.add(b,d))) {
				E = math.add(b,D)
			} else {
				E = math.subtract(b,D)
			}

			var h = math.chain(expr.eval({x: p2}))
				    .multiply(-2)
				    .divide(E)
				    .done()
			var p = math.add(p2, h)
			console.log("h: " + h + "\np: " + p)

			//Condição de parada do loop
			if (math.abs(h) < tol) {
				var text = "<p>A raiz encontrada foi <b>" + p + "</b> em " + i + " iterações.<p>"
				console.log("Raiz encontrada")
				//Exibe o resultado na página HTML
				document.getElementById("resultado").innerHTML = text
				break
			}
			if (i == iMax) {
				var text = "<p>Não foi possível encontrar a raiz em " + i + " iterações.<p>"
				console.log("Raiz não encontrada")
				//Exibe o resultado na página HTML
				document.getElementById("resultado").innerHTML = text
			}
			//Os novos valores que serão aplicados na secante
			p0 = p1
			p1 = p2
			p2 = p
			i += 1
		}
		
		//Plota o gŕafico
                Plotly.newPlot('plot', data)
		
	}
        catch (err) {
                console.error(err)
                alert(err)
        }
}

//Executa a função quando o usuário apertar no botão
document.getElementById('solve').onclick = function (event) {
        event.preventDefault()
        draw()
}
