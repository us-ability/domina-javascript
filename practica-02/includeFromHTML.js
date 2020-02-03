
function includeFromHTML(selector, file) {
    // Inicializamos petición de Ajax
    var xhttp = new XMLHttpRequest();

    // Recuperamos el elemento contenedor
    var trg = document.querySelector(selector);

    // Si no lo encontramos mostramos una mensaje de error
    if(!trg) alert("El elemento contnedor no se encuentra");

    xhttp.onreadystatechange = function () {
        // Si la petición está completada y lista
        if (this.readyState == 4) {
            if (this.status == 200) { 
                // Y tuvo éxito
                trg.innerHTML += this.responseText; 

            } else if (this.status == 404) { 
                // Y el archivo no lo encuentra o no existe
                trg.innerHTML = "Archivo no encontrado."; 

            } else {
                // Y no sabemos que ocurrió
                trg.innerHTML = "Error no controlado."; 
            }
        }
    }

    // Realizamos la petición
    xhttp.open("GET", file, true);
    xhttp.send();

    return;
}

