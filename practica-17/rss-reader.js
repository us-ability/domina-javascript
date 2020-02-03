var RSS = function(){
    // Recuperamos los argumentos
    for(var x = 0; x < arguments.length; x++ ){
        var arg = arguments[x];
        if(typeof arg == "string"){
            this.url = arg;
        } else if(typeof arg == "function"){
            this.callback = arg;
        } else {
            this.cfg = arg;
        }
    }

    // Si la configuración no está establecida, la creamos
    if(typeof this.cfg == "undefined" || this.cfg == null){
        this.cfg = {};
    }

    // Establecemos unos valores por defecto, si no los trae ya
    if(!this.cfg.hasOwnProperty("method")){
        this.cfg.method = "POST";
    }
    if(!this.cfg.hasOwnProperty("mode")){
        this.cfg.mode = "cors";
    }
    if(!this.cfg.hasOwnProperty("credentials")){
        this.cfg.credentials = "omit";
    }
    if(!this.cfg.hasOwnProperty("cache")){
        this.cfg.cache = "no-store";
    }
    if(!this.cfg.hasOwnProperty("referrerPolicy")){
        this.cfg.referrerPolicy = "no-referrer";
    }
    
    // Actualizamos la configuración de conexión con los datos
    // personalizados que nos puedan enviar
    var opt = {}
    for(var key in this.cfg){
        opt[key] = this.cfg[key];
    }
    this.cfg = opt;

    this.result = '';

    // Devolvemos el objeto
    return this;
}

RSS.prototype.getData = function(){
    // Definimos los estilos necesarios
    var styles = `
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap');
    .rss-reader {
        font-family: "Open Sans", sans-serif;
        font-size: 14px;
    }
    .rss-reader a {
        white-space: normal;
        word-break: break-all;
        color: #003090;
        text-transform: none;
    }
    .rss-reader details {
        background: #fff;
        border: 1px solid #f0f0f0;
        text-transform: uppercase;
        text-align: center;
        padding: 5px 0;
    }
    .rss-reader details > * { 
        color: #0060c0 !important; 
        font-weight: 100;
    }
    .rss-reader details summary{
        font-size: 21px;
    }
    .rss-reader article {
        border: 1px solid rgba(0,0,0,0.1);
        width: 100%;
        display: block;
        padding: 5px;
        margin: 5px 0;
        box-sizing: border-box;
    }
    .rss-reader article header {
        font-family: "Roboto", sans-serif;
        background: #f0f0f0;
        padding: 5px;
        color: #333;
        font-size: 21px;
        font-variant: small-caps;
    }
    .rss-reader article > div {
        text-align: justify;
        min-height: 56px;
        padding: 10px;
    }
    .rss-reader article > div > a {
        background: #0060c0;
        box-sizing: border-box;
        color: #fff;
        width: 100%;
        display: block;
        padding: 5px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-decoration: none;
    }
    .rss-reader article > div img {
        padding-right: 10px;
        display: block;
        width: auto;
        height: 100px;
        float: left;
        object-fit: cover;
        object-position: center;
        box-sizing: border-box;
    }
    .rss-reader article footer {
        padding: 10px 5px;
    }
    @media(max-width: 480px){
        .rss-reader article > div > img { 
            margin: 0;
            padding: 0;
            float: none;
            height: auto;
            width: 100%; 
        }   
    }`;

    // Asignamos el objeto this a una variable para poder 
    // manipularla desde dentro de los consumidores del objeto 
    // fetch
    var rss = this;

    // Creamos la petición
    this.request = new Request(this.url, this.cfg);
    
    fetch(this.request)
    .then(function(response) {
        // recuperamos el XML y lo pasamos al siguiente
        // consumidor, dónde será tratado
        return response.text();
    })
    .then(function(text) {
        var rssElements;

        // Creamos un objeto DOMParser para analizar 
        // gramaticalmente el XML y convertirlo en un
        // documento DOM parseable
        var parser = new DOMParser();
        rssElements = parser.parseFromString(text,"text/xml");

        var err = rssElements.querySelectorAll("parsererror");
        var result;
        if(err.length != 0){
            // Asignamos el contenido del error
            result = err[0].innerHTML;
        
        } else {
            // Asignamos el contenido del RSS
            result = rss.convertToHTML(rssElements);

            // Añadimos los estilos
            var style = document.createElement("style");
            style.innerHTML = styles;
            document.head.appendChild(style);
        }

        rss.callback(result);
    })
    .catch(function(err) { 
        // Mostramos el error, si procede.
        console.error(err);
    });
}

RSS.prototype.convertToHTML = function(data){

    function getInnerText(e){
        try{
            if(e.getAttribute("href") != null) 
                return e.getAttribute("href");
            if(e == null || e.childNodes.length == 0) return "";
            return e.childNodes[0].nodeValue;
        } catch (e){
            return "";
        }
    }

    // Recuperamos los datos del sitio
    var title = getInnerText(data.querySelector("title"));
    var link = getInnerText(data.getElementsByTagName('link')[0]);
    var desc = getInnerText(data.querySelector("description"));
    
    // Creamos el contenedor RSS
    var cont = document.createElement("section");
    cont.classList.add("rss-reader");
    
    // Añadimos la información genérica al contenedor RSS
    cont.innerHTML += `<details>
    <summary>` + desc + ` - ` + title + `</summary>
    <p>From: <b>RSS-READER JS 1.0</b></p>
    <p><a href="' + link + '" target="_blank">` + link + `</a></p>
    </details>`;

    // Recorremos todos los <item> del RSS
    var items = data.querySelectorAll("item");
    for (var x = 0; x < items.length; x++){
        var item = items[x];
        title = getInnerText(item.querySelector("title"));
        link  = getInnerText(item.querySelector("link"));
        desc  = getInnerText(item.querySelector("description"));

        cont.innerHTML += `<article>
    <header>` + title + `</header>
    <div class="content">` + desc + `</div>
    <footer>
        <b>Fuente: </b>
        <a href="`+ link + `" target="_blank">` + link + `</a>
    </footer>
    </article>`;
    }

    return cont.outerHTML;
}

