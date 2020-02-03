this.SendFormTo = function (url, params) {
    // Comprobamos si tiene los parámetros establecidos
    if (typeof url == "undefined") { 
        alert("Falta la dirección de envío"); 
        return; 
    }

    if (typeof params == "undefined") { 
        alert("Falta el JSON con los datos"); 
        return; 
    }

    // Creamos el formulario
    var form = document.createElement("form");
    form.setAttribute('method', "post");
    form.setAttribute('action', url);
    form.style.display = "none";

    // Recorremos los parámetros
    for (var i = 0; i < params.length; i++) {
        var inputParam = params[i];

        var input = document.createElement("input");
        for (var key in inputParam) {
            input.setAttribute(key, inputParam[key]);
            if(key == "id"){
                input.setAttribute("name", inputParam[key]);
            }
        }
        form.appendChild(input);
    }

    // Añadimos el botón de submit
    var btn = document.createElement("button");
        btn.setAttribute('type', "submit");
        btn.setAttribute('value', "Enviar");

    // Añadimos el botón al formulario
    form.appendChild(btn);

    // Añadimos el formulario al final del body
    document.body.appendChild(form);
console.log(form.outerHTML)
    // Finalmente hacemos click en el botón de enviar
    btn.click();
}
