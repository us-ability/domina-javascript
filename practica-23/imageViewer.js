var ImageViewerProto = Object.create(HTMLElement.prototype);

ImageViewerProto.createdCallback = function() {
    // Definims los estilos y la plantilla
    var tmpl = this.getTemplate();

    // Denimos el ShadowDOM
    var shadowRoot = this.createShadowRoot();
    shadowRoot.innerHTML = tmpl;

    // Si tiene la propiedad src asignada,
    // cargamos el contenido en Base64
    var self = this;
    var attrSRC = this.getAttribute("src");
    
    if(attrSRC){
        this.attributeChangedCallback('src', '', attrSRC)

        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.getAttribute("src"), true);

        xhr.responseType = 'arraybuffer';

        // Cuando todo esté OK, continuamos
        xhr.onload = function(e) {
            if (this.status == 200) {
                // Para convertir a base64, primero pasamos a
                // binario y a continuación, se codifica como URL 
                var data = new Uint8Array(this.response);
                var len = data.length;
                var dataBin = new Array(len);

                while (len--){
                    dataBin[len] = String.fromCharCode(data[len]);
                }
                data = dataBin.join('');

                // Recuperamos la extensión
                var ext = self.getAttribute("src")
                              .lastIndexOf(".");
                ext = self.getAttribute("src").substring(ext + 1);

                self._code = "data:image/" + ext + ";base64," +
                             btoa(data);
            }
        };

        xhr.send();
    }
};

// Añadimos el método de actualización de atributos
ImageViewerProto.attributeChangedCallback = 
    function(attrName, oldVal, newVal) {
        var self = this;

        if(attrName == "src"){
            this.shadowRoot.querySelector("img").src = newVal;

            var img = self.shadowRoot.querySelector('img');
            img.style.width = "auto";
            img.style.height = "auto";

            // La información de la imagen no está accesible de 
            // forma inmediata. Por ello esperamos unos pocos ms
            setTimeout(function(){
                img.style.width = img.clientWidth + "px";
                img.style.height = img.clientHeight + "px";
                img.setAttribute("data-width", img.clientWidth);
                img.setAttribute("data-height", img.clientHeight);
            }, 150);
        } else if(attrName == "code"){
            this._code = newVal;
        }
}

ImageViewerProto.getTemplate = function(){
    // Función para encontrar el host del elemento
    function getHost(n){
        var str = "this";
        for(var x = n; x > 0; x--){
            str += ".parentNode";
        }
        str += ".host";

        return str;
    }

    return `
<style>
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap');
    :host {
        --fg: #384a74;
        --bg: #ffffff;
        --kfg: whitesmoke; 
        --kbg: linear-gradient(to bottom, rgb(63, 63, 68) 0%, rgb(43, 43, 48) 100%);
        --bc: #eeeeee;
    }

    header * {
        outline: none;
    }

    header + div{
        background: #000;
        position: absolute;
        width: 100%;
        height: calc(100% - 30px);
        left: 0;
        top: 30px;
        overflow: auto;
        color: #fff;
    }

    header{
        position: relative;
        width: 100%; 
        height: 30px;
        border: none;
        background: var(--kbg);
        box-sizing: border-box;
        z-index: 9;
    }

    header h1 {
        margin: 0;
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        float: left;
        border-right: 1px solid rgba(0,0,0,0.2);
        padding: 0 10px 0 5px;
        color: #808080;
        font-weight: 400;
        line-height: 30px;
        text-shadow: 1px 1px 0px #000;
    }

    header button{
        cursor: pointer;
        width: 28px;
        height: 30px;
        border: none;
        background: transparent;
        margin: 0 1px;
        float: left;
        position: relative;
    }

    header .fa-folder{
        border-left: 1px solid rgba(255,255,255,0.1);
    }

    header .fa{
        color: var(--kfg);
        font-size: 13px;
    }

    header input[type=range]{
        width: 300px;
        float: left;
        margin: 4px 10px;
        border-right: 1px solid rgba(0,0,0,0.1);
    }

    header .width100{
        font-size: 13px;
        line-height: 30px;
        padding: 0 5px;
        margin: 0;
        float: left;
        color: var(--kfg);
        width: 64px;
        border-left: 1px solid rgba(255,255,255,0.1);
        border-right: 1px solid rgba(0,0,0,0.1);
        position: relative;
    }

    header .width100::after {
        content: "100%";
        font-family: "Open Sans", sans-serif;
        font-size: 13px;
        line-height: 30px;
        padding: 0 5px;
        margin: 0;
    }

    header .base64{
        width: 36px;
        position: relative;
        border-left: 1px solid rgba(255,255,255,0.1);
        color: var(--kfg);;
    }

    header .base64::before{
        content: "B";
        position: relative;
        top: 0px;
        left: 0;
        width: 100%;
        height: 30px;
        font-size: 15px;
        line-height: 30px;
    }

    header .base64::after{
        content: "64";
        position: relative;
        top: -8px;
        left: 2px;
        width: 100%;
        font-size: 10px;
    }

    header .width100:focus,
    header .base64:focus {
        background: rgba(0,0,0,0.3);
    }

    img[src="#"]{
        display: none;
    }
</style>
<header>
    <h1>Image Viewer 1.0</h1>
    
    <button class="fa fa-folder"
            onclick="` + getHost(2) + `.open(this)">
    </button>
    
    <div class="image">
        <input type="range" 
            min="50" max="500" 
            value="100" 
            oninput="` + getHost(3) + `.zoom(this)" />
        
        <button class="fa fa-space-shuttle width100"
                title="Ajustar al 100%"
                onclick="` + getHost(3) + `.resetImage(this)"
        ></button>
        <button class="base64"
                title="Copiar en Base64"
                onclick="` + getHost(3) + `.copyBase64(this)"
        ></button>
    </div>
</header>

<div><img src="#" /></div>`;
}

ImageViewerProto.zoom = function(e){
    var img = this.shadowRoot.querySelector("img");
    var w = img.dataset.width;
    var h = img.dataset.height;
    img.style.width = e.value * w / 100 + "px";
    img.style.height = e.value * h / 100 + "px";
}

ImageViewerProto.resetImage = function(e){
    // Recuperamos el elemento input por encima
    var rng = e.previousElementSibling;

    // Asignamos el valor
    rng.value='100';

    // Emulamos un evento oninput
    var event = new Event('input', {'bubbles': true, 'cancelable': true});
    rng.dispatchEvent(event);
}

ImageViewerProto.copyBase64 = function(e){
    // Creamos un elemento textarea
    var el = document.createElement("textarea")
    el.value = this._code;

    // Lo añadimos al shadowRoot
    var aux = this.shadowRoot.appendChild(el);

    // Hacemos que tome el foco
    aux.focus();

    // Seleccionamos todo el contenido
    document.execCommand("selectAll");

    // Lo copiamos al portapapeles
    document.execCommand("copy");

    // Lo eliminamos
    aux.remove();
}

ImageViewerProto.open = function(){
    // Guardamos la instancia para usarla después
    var self = this;

    // Creamos un input file para recuperar
    // el archivo que quieren solicitar
    var e = document.createElement("input");
    e.type = "file";
    e.style.display = "none";
    e.onchange = function(evt){
        // Ya lo han seleccionado. Ahora, lo cargamos
        var reader = new FileReader();

        self.setAttribute("src", evt.target.files[0].name);

        reader.onload = function(){
            var data = reader.result;
            self._code = data;
        }

        reader.readAsDataURL(evt.target.files[0]);

        // Eliminamos el input file
        e.remove();
    }

    // Añadimos al body el input file y simulamos click
    this.shadowRoot.appendChild(e);
    e.click();
}

var ImageViewer = document.registerElement('image-viewer', {prototype: ImageViewerProto});
