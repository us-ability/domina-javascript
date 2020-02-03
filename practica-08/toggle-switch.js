// Creación del método constructor
var toggleSwitch = function(selector){
    toggleSwitch.targets = document.querySelectorAll(selector);
    return toggleSwitch;
}

// Targets contendrá todos los elementos a tratar
toggleSwitch.targets = null;

// Creamos el método de establecimiento del switch
toggleSwitch.set = function(cfg){
    // Miramos la configuración,
    // Si no está establecida, ponemos los valores por defecto
    if(!cfg | typeof cfg == "undefined") cfg = {};

    // Recuperamos los parámetros enviados
    if(!cfg.hasOwnProperty("textOn")) cfg.textOn = "Sí";
    if(!cfg.hasOwnProperty("textOff")) cfg.textOn = "No";
    if(!cfg.hasOwnProperty("width")) cfg.width = "64px";

    // Recorremos los elementos seleccionados 
    // y creamos los switch
    var items = this.targets;
    for(var n = 0; n < items.length; n++){
        var item = items[n];
        
        var id = typeof item.id == "undefined" ? 
            ("tSwitch" + n) : 
            item.id;
    
        // Reestructuramos el contenido
        item.innerHTML = '<span>' + item.innerHTML + '</span>';
        
        // Añadimos el elemento de tipo verificación
        var chk = document.createElement("input");
            chk.type = "checkbox";
            chk.id = id + "Checkbox";
            chk.setAttribute("name", chk.id);

        item.appendChild(chk);

        // Añadimos el elemento de tipo verificación
        var div = document.createElement("div");
            div.id = id + "Div";
            div.classList.add("switch");
            div.setAttribute("data-on", cfg.textOn);
            div.setAttribute("data-off", cfg.textOff);
            div.style.width = cfg.width;

        item.appendChild(div);

        // Añadimos la clase del componente al item
        item.classList.add("toggleSwitch");

        // Agregamos el evento que cambia el estado
        chk.addEventListener("change", function(event){
            var trg = event.target.nextElementSibling;

            trg.classList.toggle("off");
        });
    }
}
