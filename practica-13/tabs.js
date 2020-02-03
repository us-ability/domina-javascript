// Iniciamos el objeto
var tabs = function(selector){
    tabs.targets = document.querySelectorAll(selector);

    return tabs;
}

// Lista con todos los tabs de tipo overflow
tabs.targets = null;

// Propiedad para controlar el temporizador. 
// Si es distinto de -1 es que se está pulsando el botón del ratón
tabs.navMousedownID = -1;

// Indica un poco la velocidad de respuesta.
// Cada vez que hay un ciclo de pulsación del ratón, se moverá
// los píxeles indicados,
tabs.navMouseStep = 10;

tabs.init = function(){
    var ntoItems = this.targets;
    for(var n = 0; n < ntoItems.length; n++){
        // Preparamos todo lo que necesitamos
        var ntoItem = this._wrap(ntoItems[n]);

        // Recuperamos los botones de anterior y siguiente
        var prev = ntoItem.querySelector("* > .nav-prev")
        var next = ntoItem.querySelector("* > .nav-next");
        
        // Establecemos el ancho del tab actual
        var items = ntoItem.querySelectorAll("* > .nav-tabs li");
        var curWidth = 0;
        for(var x = 0; x < items.length; x++){
            var item = items[x];
            var style = window.getComputedStyle(item);
            var pWidth = prev.offsetWidth;
            var nWidth = next.offsetWidth;            
            
            curWidth += item.offsetWidth + 
                        parseInt(style.marginRight) + 
                        parseInt(style.marginLeft);
        }
        var itemUL = ntoItem.querySelector('* > ul');
        itemUL.style.width = (curWidth + pWidth + nWidth) + 'px';
        
        //Assign events
        prev.onmousedown = function(Event){
            tabs.navMousedown(Event);
        }
        prev.onmouseup = function(Event){ 
            tabs.navmouseup(Event);
        }
        next.onmousedown = function(Event){ 
            tabs.navMousedown(Event); 
        }
        next.onmouseup = function(Event){ 
            tabs.navmouseup(Event); 
        }
    }
}

tabs._wrap =  function(ul){
    // Función para envolver elementos dentro de otro
    function wrap(el, wrapper){
        el.parentNode.insertBefore(wrapper, el); 
        wrapper.appendChild(el);
    };

    // Tomamos el elemento que contiene las pestañas
    // y lo metemos dentro de un contenedor
    // que creamos nosotros
    ul.classList.remove("nav-tabs-overflow");
    var container =  document.createElement("div");
    container.classList.add("nav-tabs-overflow");
    wrap(ul, container);
    
    // Si tiene estilos asignados los movemos al contenedor
    var style = ul.style;
    for(var x = 0; x < style.length; x++){
        container.style[style[x]] = style[style[x]];
    }
    ul.removeAttribute("style");
            
    // Añadimos el botón para moverse a la izquerda
    var prev = document.createElement("i");
    prev.classList.add("nav-prev");
    container.insertBefore(prev, container.childNodes[0]);

    // Añadimos el botón para moverse a la derecha
    var next = document.createElement("i");
    next.classList.add("nav-next");
    container.append(next);

    return container;
};

tabs.navMousedown = function(event){
    if(tabs.navMousedownID==-1){
        tabs.navMousedownID = setInterval(function(){
            tabs.whileNavMousedown(event); 
        }, 15); 
    }
};

tabs.navmouseup = function(event){ 
    if(tabs.navMousedownID!=-1){
        clearInterval(tabs.navMousedownID);
        tabs.navMousedownID=-1;
    }
} 

tabs.whileNavMousedown = function(Event){
    var trg = Event.target;
    var px = null; 

    if(trg.classList.contains("nav-next")){
        var width = trg.offsetWidth;
        trg = trg.previousElementSibling;
        px = trg.offsetLeft - width;
        
        if(Math.abs(trg.offsetLeft) + trg.parentElement.offsetWidth > trg.offsetWidth ) return;

        px = px - tabs.navMouseStep;
        trg.style.left = px + 'px';
    } else{
        var width = trg.offsetWidth;
        trg = trg.nextElementSibling;
        px = trg.offsetLeft - width;

        if(px == 0) return;
        
        px = px + tabs.navMouseStep;
        trg.style.left = px + 'px';
    }
}

