Charts.LineChart = function(config){
    // Si sólo viene una serie en formato JSON
    // la transformamos
    if(typeof config.data.length == "undefined"){
        config.data = [{ name: "", values: config.data }];
    }

    // Preparamos algunas propiedades que necesitaremos
    legends = {};
    dataSeries = config.data;
    colorSeries = config.colors;

    // Configuramos el JSON de valores para poder recuperar
    // el máximo valor y, así, poder inicializar el gráfico
    config.data = {};
    for(var x = 0; x < dataSeries.length; x++){
        var serie = dataSeries[x];

        for(var key in serie.values){
            config.data[serie.name + "_" + key] = 
                serie.values[key];
        }
    }

    // Inicializamos el lienzo (tamaño, configuración, ...)
    this.init(config);

    // Ahora pintamos cada una de las series
    for(var x = 0; x < dataSeries.length; x++){
        var serie = dataSeries[x];

        // Agregamos al JSON de leyendas para luego
        legends[serie.name] = x;

        // Transferimos los valores de la serie actual al
        // objeto data, como si se tratase de un único gráfico
        this.config.data = serie.values;
        this.config.colors = [colorSeries[x % colorSeries.length]]

        // Sólo pintamos los grids en la primera iteración
        if(x == 0){
            // Dibujamos las líneas sobre el eje Y
            this.setGridYLines();

            // Dibujamos las líneas sobre el eje X
            this.setGridXLines();
        }

        // Dibujamos las lineas de segmento
        this.drawSegmentLines();
    }

    // Pintamos el título
    if(this.config.hasOwnProperty("title")){
        this.setTitle(this.config.title);
    }

    // Pintamos la legenda
    if(!this.config.hasOwnProperty("legend") ||
        this.config.legend != false){
        
        this.config.data = legends;
        this.config.colors = colorSeries;
        this.setLegend();
    }
}

Charts.setGridXLines = function(){
    // Guardamos el estado del contexto
    this.ctx.save();

    // Corrección de la media unidad a cada lado
    this.ctx.translate(.5,.5);

    // Establecemos las líneas verticales
    var keys  = Object.keys(this.config.data);
    var sepLine = this.target.offsetWidth / keys.length;
    
    this.ctx.beginPath();
    for(var i = 0; i < keys.length; i++){
        this.ctx.strokeStyle = this.config.gridColor;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(sepLine * i + this.margin, 
                        this.target.offsetHeight - this.margin);
        this.ctx.lineTo(sepLine * i + this.margin, this.margin);

        // Pintamos el nombre asociado al valor del eje X
        this.ctx.textBaseline="bottom";
        this.ctx.font = "normal 11px Arial";
        this.ctx.fillText(keys[i], sepLine * i + this.margin - 1,
                          this.target.offsetHeight - 
                          this.margin / 2);
    }
    this.ctx.stroke();

    // Restauración del desplazamiento
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Restauramos el estado del contexto
    this.ctx.restore();
}

Charts.drawSegmentLines = function(){
    // Guardamos el estado del contexto
    this.ctx.save();

    // Corrección de la media unidad a cada lado
    this.ctx.translate(.5,.5);

    // Establecemos los valores
    var values  = Object.values(this.config.data);
    var sepLine = this.target.offsetWidth / values.length;
    var availHeight = this.target.offsetHeight - this.margin;
    var colors = this.config.colors;
    
    var x0 = 0, y0 = availHeight, x1 = 0, y1 = 0, heightVal = 0;

    // Pintamos la serie de puntos
    this.ctx.beginPath();
    for(var i = 0; i < values.length; i++){
        this.ctx.strokeStyle = colors[0];
        this.ctx.lineWidth = 2;

        heightVal = availHeight - 
                    ((availHeight - this.margin) * values[i] / 
                    this.maxValue);

        x0 = sepLine * (i - 1) + this.margin;
        x1 = sepLine * i + this.margin;
        y1 = heightVal;

        // Si i == 0, no pintamos nada, solo lo tomamos 
        // como referencia para el siguiente punto
        if(i != 0){
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x1, y1);
        }

        y0 = y1;
    }
    this.ctx.stroke();

    // Pintamos el resaltado de puntos
    var x0 = 0, y0 = availHeight, x1  = 0, y1 = 0, heightVal = 0;
    for(var i = 0; i < values.length; i++){
        this.ctx.strokeStyle = colors[0];
        this.ctx.lineWidth = 2;

        heightVal = availHeight - 
                    ((availHeight - this.margin) * values[i] / 
                    this.maxValue);

        x0 = sepLine * (i - 1) + this.margin;
        x1 = sepLine * i + this.margin;
        y1 = heightVal;

        // Pintamos el resaltado del punto
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = colors[0];
        this.ctx.arc(x1, y1, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();

        y0 = y1;
    }
        
    // Restauración del desplazamiento
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Restauramos el estado del contexto
    this.ctx.restore();
}
