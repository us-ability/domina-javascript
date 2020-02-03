var Charts = function(selector){
    Charts.target = document.querySelector(selector);

    return Charts;
}

Charts.BarChart = function(config){
    // Inicializamos el lienzo (tamaño, configuración, ...)
    this.init(config);

    // Dibujamos las líneas de separación de valores
    this.setGridYLines();

    // Dibujamos las barras
    this.setBars();

    // Pintamos el título
    if(this.config.hasOwnProperty("title")){
        this.setTitle(this.config.title);
    }

    // Pintamos la legenda
    if(!this.config.hasOwnProperty("legend") ||
        this.config.legend != false ){
        this.setLegend();
    }
}

Charts.init = function(config){
    // Recuperamos la configuración
    this.config = config;
    this.dpi = window.devicePixelRatio; 

    // Establecemos los valores por defecto, si procede
    if(!this.config.hasOwnProperty("style")){
        this.config.style = {};
        this.config.style.width = "100%";
        this.config.style.height = "300px";
    } else {
        if(!this.config.style.hasOwnProperty("width")){
            this.config.style.width = "100%";
        }
        if(!this.config.style.hasOwnProperty("height")){
            this.config.style.width = "300px";
        }
    }

    // Establecemos la direccionalidad del gráfico
    if(!this.config.hasOwnProperty("direction")){
        this.config.direction = "vertical"
    }

    // Establecemos las propiedades del título
    if(!this.config.hasOwnProperty("title")){
        this.config.title = "";
    }
    if(typeof this.config.title == "string"){
        ta = {};
        ta.value = this.config.title;
        this.config.title = ta;
    }
    if(!this.config.title.hasOwnProperty("color")){
        this.config.title.color = "black";
    }
    if(!this.config.title.hasOwnProperty("position")){
        this.config.title.position = "top";
    }

    // Establecemos el tamaño del lienzo
    this.target.style.width = this.config.style.width;
    this.target.style.height = this.config.style.height;

    // Como, probablemente, haya cambiado el tamaño del lienzo,
    // reajustamos el tamaño en relación a los puntos por pulgada
    this.target.setAttribute("width", 
        getComputedStyle(this.target).
        getPropertyValue("width").
        slice(0, -2) * this.dpi
    );
    this.target.setAttribute("height", 
        getComputedStyle(this.target).
        getPropertyValue("height").
        slice(0, -2) * this.dpi
    );
    this.ctx = this.target.getContext("2d");
    
    // Limpiamos el lienzo
    this.ctx.clearRect(
        0, 0, 
        this.target.width, this.target.height
    );
    
    // Buscamos el valor máximo para establecer 
    // una relación entre los ejes del grid
    this.maxValue = 0;
    for (var data in this.config.data){
        this.maxValue = Math.max(
            this.maxValue,
            this.config.data[data]
        );
    }

    // Calculamos el espacio para insertar los valores del grid
    this.margin = this.maxValue.toString().length * 12;
    
    // Calculamos el área util para pintar
    this.areaDraw = {};
    this.areaDraw.height = this.target.height - this.margin * 2;
    this.areaDraw.width = this.target.width - this.margin * 2;
}

Charts.setGridYLines = function(){
    if(this.config.direction == "vertical"){
        for(var x = 10; x > -1; x--){
            var posY = (x * this.areaDraw.height / 10 + 
                        this.margin) + 1 ;
            var value = Math.floor((10 - x) * this.maxValue / 10);
            this.drawLine(
                this.margin,
                Math.floor(posY),
                this.target.width - this.margin/2,
                Math.floor(posY),
                value,
                this.config.gridColor
            );
        }
    } else {
        for(var x = 0; x < 11; x++){
            var posX = (x * this.areaDraw.width / 10 + 
                       this.margin) + 1 ;
            var value = Math.floor(x * this.maxValue / 10);
            this.drawLine(
                Math.floor(posX),
                this.margin,
                Math.floor(posX),
                this.target.height - this.margin,
                value,
                this.config.gridColor
            );
        }
    }
}

Charts.drawLine = function(x0, y0, x1, y1, value, color){
    // Guardamos el estado del contexto
    this.ctx.save();

    // Corrección de la media unidad a cada lado
    this.ctx.translate(.5,.5);
    
    // Pintamos el eje
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();

    // Pintamos el valor del eje
    this.ctx.fillStyle = color;
    this.ctx.textBaseline="bottom"; 
    this.ctx.font = "normal 12px arial";
    this.ctx.fillStyle = "#000";

    if(this.config.direction == "vertical"){
        this.ctx.fillText(value, 5, y0 + 8);
    } else {
        var top = this.config.title.position == "top" ? 
                  (this.target.height - this.margin / 2) : 
                  (this.margin - 5);
        this.ctx.fillText(value, 
                          x0 - (value.toString().length * 3), 
                          top);
    }

    // Restauración del desplazamiento
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Restauramos el estado del contexto
    this.ctx.restore();
}

Charts.setBars = function(){
    var totalBars = Object.keys(this.config.data).length;
    var barWidth = (this.areaDraw.width / totalBars) - 1;

    for (var key in this.config.data){
        // Tomamos el valor de la barra actual
        var val = this.config.data[key];

        // Recuperamos el índice asociado a la barra
        var barIndex = Object.keys(this.config.data).indexOf(key);

        // Calculamos su altura 
        var barHeight = Math.ceil(this.areaDraw.height * val / 
                                  this.maxValue);

        // Calculamos la coordenada dónde posicionarla
        var x = (this.margin + barIndex * barWidth);
            x += (5 * barIndex);
        var y  = 1 + this.target.height - barHeight - this.margin;

        var colorsLength = this.config.colors.length;

        // Si es horizontal, recalculamos todos los valores
        if(this.config.direction == "horizontal"){
            barWidth = Math.ceil(this.areaDraw.width * val / 
                                 this.maxValue);
            barHeight = ((this.areaDraw.height) / totalBars) - 4;
            y  = (this.margin + barIndex * barHeight);
            y += (5 * barIndex);
            x = this.margin + 1;
        }

        // Pintamos la barra
        this.drawBar(
            x,
            y,
            barWidth,
            barHeight,
            this.config.colors[barIndex % colorsLength]
        );
    }
}

Charts.drawBar = function(x, y, width, height, color){
    // Guardamos el estado del contexto
    this.ctx.save();

    // Corrección de la media unidad a cada lado
    this.ctx.translate(.5,.5);

    // Establecemos la barra
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);

    // Restauración del desplazamiento
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Restauramos el estado del contexto
    this.ctx.restore();
}

Charts.setTitle = function(t){
    // Guardamos el estado del contexto
    this.ctx.save();

    // Corrección de la media unidad a cada lado
    this.ctx.translate(.5,.5);

    // Establecemos el título
    this.ctx.textBaseline="bottom";
    this.ctx.textAlign="center";
    this.ctx.fillStyle = t.color;
    this.ctx.font = "normal 13px Arial";

    // Calculamos y establecemos el título
    var top  = Math.floor(t.position == "top" ? 
                   (this.margin - 13) : 
                   (this.target.height - 13)
               );
    var left = Math.floor(this.target.width / 2);
    
    this.ctx.fillText(t.value, left, top);

    // Restauración del desplazamiento
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Restauramos el estado del contexto
    this.ctx.restore();
}

Charts.setLegend = function(){
    // Si ya tiene una legenda, la eliminamos
    if(this.target.nextElementSibling && 
       this.target.nextElementSibling.tagName == "LEGEND"){
        this.target.nextElementSibling.remove();
    }

    // Creamos la nueva leyenda del gráfico
    var legend = document.createElement("legend");
    legend.setAttribute("for", this.target.id)

    // Añadimos los elementos
    var ul = document.createElement("ul");
    ul.style.padding = "0";
    legend.append(ul);

    // Añadimos las series
    var colors = this.config.colors;
    for (var key in this.config.data){
        var barIndex = Object.keys(this.config.data).indexOf(key);

        // Creamos el item de la serie
        var li  = document.createElement("li");
        li.style.listStyle = "none";
        li.style.height = "25px";
        li.style.margin = "0 0 0 10px";
        li.style.display = "inline-block";
        li.style.minWidth = "120px";

        // Creamos span con el monbre de la serie
        var span  = document.createElement("span");
        span.style.paddingLeft = "10px";
        span.style.lineHeight = "18px";
        span.innerHTML = key;
        li.appendChild(span);

        // Creamos span con el color de la serie
        var span = document.createElement("span");
        span.style.background = colors[barIndex % colors.length];
        span.style.width = "8px";
        span.style.height = "8px";
        span.style.padding = "5px";
        span.style.borderRadius = "4px";
        span.style.float = "left";
        li.appendChild(span);

        // Añadimos serie al contenedor UL
        ul.append(li);
    }

    // Añadimos la legenda justo detrás del canvas
    this.target.parentElement.insertBefore(
        legend, 
        this.target.nextElementSibling
    );
}
