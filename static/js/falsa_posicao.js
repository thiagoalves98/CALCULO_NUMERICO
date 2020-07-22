function draw() {
	try{
		var data = []
		const expressao = document.getElementById('eq').value
		const expr = math.compile(expressao)
		const xValores = math.range(-100, 100, 1).toArray()
    
		const yValores = xValores.map(function (x) {
			return expr.eval({x: x})
		})

		const trace1 = {
			x: xValores,
		        y: yValores,
		        type: 'scatter'
		}	
		data.push(trace1)

		var p0 = Number(document.getElementById('p0').value)
		var p1 = Number(document.getElementById('p1').value)
		const tol = Number(document.getElementById('tol').value)
		const iMax = Number(document.getElementById('iteracoes').value)

		var i  = 2
		while (i <= iMax) {
			var q0 = expr.eval({x: p0})
		        var q1 = expr.eval({x: p1})

		        var newTrace = {
			        x: [p0, p1],
			        y: [q0, q1],
			        mode: 'lines',
			        type: 'scatter'
		        }
		        data.push(newTrace)

			var p = p1 - q1*((p1-p0)/(q1-q0))
			console.log("Iteracao: " + i + "\np0 = " + p0 + "\np1 = " + p1 + "\np = " + p + "\nq0 = " + q0 + 
				    "\nq1 = " + q1 + "\n|p - p1|/|p| = " + math.abs((p - p1)/p))
        
			if (math.abs((p - p1)/p) < tol) {
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
			var q = expr.eval({x: p})
			if (q1*q < 0) {
				p0 = p1
			}

			p1 = p
			q1 = q
			i += 1
    		}

    		Plotly.newPlot('plot', data)
	}
	catch (err) {
		console.log(err)
		alert(err)
	}
}

document.getElementById('solve').onclick = function (event) {
    event.preventDefault()
    draw()
}