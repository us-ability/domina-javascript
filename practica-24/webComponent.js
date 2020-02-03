class FileViewer extends HTMLElement{
    constructor(){
        super();
        this._filename = null;
    }

    static get observedAttributes() {
        return ['filename'];
    }
    
    get filename() {
        return this._filename;
    }
    
    set filename(v) {
        if (v) this.setAttribute('filename', v);
    }

    connectedCallback () {
        // Por cómo se ha definido el componente, definimos el 
        // shadowRoot porque queremos que pueda ser accesible 
        // desde fuera para cambiar / recuperar ciertos datos
        var shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.innerHTML = this.getView();
        shadowRoot.querySelector('pre').innerText = this.data;

        // Establecemos la configuración adecuada para el tipo
        // de fichero a mostrar
        this.setConfiguration(this);
    }

    disconnectedCallback() {
        console.log(this, "fue elemento eliminado!");
    }

    getView(){
        // Buscamos la instancia que ha hecho el usuario
        var re = this.getInstance();

        return this.getStyles() + `
<article class="viewerFile">
    <header>
        <h1>File Viewer 1.0</h1>
        <button class="fa fa-folder"
                onclick="` + re + `.open()">
        </button>

        <button class="fa fa-save"
            onclick="` + re + `.save()">
        </button>
        
        <button class="fa fa-copy"
            onclick="document.execCommand('copy')">
        </button>
        <button class="fa fa-cut"
            onclick="document.execCommand('cut')">
        </button>

        <button class="fa fa-undo"
            onclick="document.execCommand('undo')">
        </button>
        <button class="fa fa-repeat"
            onclick="document.execCommand('redo')">
        </button>

        <button class="decreaseFont"
            onclick="` + re + `.style(this)">
        </button>
        <button class="increaseFont"
            onclick="` + re + `.style(this)">
        </button>
        <select class="fontName"
                onchange="` + re + `.style(this)">
            <option value="arial">Arial</option>
            <option value="verdana">Verdana</option>
            <option value="Open Sans, sans-serif">
                Open Sans
            </option>
            <option value="Roboto, sans-serif">Roboto</option>
        </select>

        <input type="radio"
                id="left-align"
                name="align"
                checked
                class="left"
                onchange="` + re + `.style(this)" />
        <label for="left-align" class="fa align left"></label>

        <input type="radio"
                id="justify-align"
                name="align"
                class="justify"
                onchange="` + re + `.style(this)" />
        <label for="justify-align" class="fa align justify"></label>
        
        <label for="word-wrap" class="word-wrap">
            <input type="checkbox" 
                id="word-wrap"
                onchange="FileViewer.wordWrap(this)">
            Ajuste de línea
        </label>
    </header>

    <code>
        <pre
            onmouseup="` + re + `.getSelectedText(this)"
            onmousedown="` + re + `.getSelectedText(this)"
            onmousemove="` + re + `.getSelectedText(this)"
            onkeyup="` + re + `.getSelectedText(this)"
            onkeydown="` + re + `.getSelectedText(this)"
            contenteditable="true">
        </pre>
    </code>
</article>
<a href="">__FILENAME__</a>
        `;
    }

    getInstance(){
        for(var key in window){
            if(window[key] instanceof FileViewer){
                return key;
            }
        }
    
        // Si pasamos por aquí es que hemos definifo una etiqueta
        // en vez de crearlo por JavaScript
        window.VFile = document.querySelector("file-viewer");
        return 'VFile';
    }
    
    getStyles(){
        return `<style>
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap');
    :host {
        --fg: #ffffff;
        --bg: #000000;
        --kfg: whitesmoke; 
        --kbg: linear-gradient(to bottom, rgb(63, 63, 68) 0%, rgb(43, 43, 48) 100%);
        --bc: #eeeeee;
    }
    
    header * {
        outline: none;
    }
    
    article{
        background: var(--fg);
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: auto;
        color: #fff;
    }
    
    code{
        position: relative;
        margin-top: 30px;
        width: 100%;
        height: auto;
        display: block;
    }
    
    code > pre {
        margin: 0;
        width: 100%;
        height: auto;
        line-height: 1.7428;
        display: block;
        background: transparent;
        color: var(--bg);
        outline: none;
        padding: 5px 3px;
        box-sizing: border-box;
    }
    
    code > pre.word-wrap{
        overflow: hidden;
        white-space: pre-wrap;
    }
    
    header{
        position: fixed;
        width: 100%;
        height: 30px;
        border: none;
        background: var(--kbg);
        box-sizing: border-box;
        z-index: 9;
        display: inline-block;
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
    
    header .fa-save{
        border-right: 1px solid rgba(0,0,0,0.1);
    }
    
    header .fa-copy{
        border-left: 1px solid rgba(255,255,255,0.1);
    }
    
    header .fa-redo{
        border-right: 1px solid rgba(0,0,0,0.1);
    }
    
    header .increaseFont:before{
        content: "A";
        color: var(--kfg);
    }
    
    header .increaseFont:after{
        content: "+";
        font-size: 10px;
        position: absolute;
        top: 5px;
        right: 5px;
        font-style: italic;
        color: var(--kfg);
    }
    
    header .increaseFont, header .fa-repeat{
        border-right: 1px solid rgba(0,0,0,0.1);
    }
    
    header .decreaseFont:before{
        content: "A";
        color: var(--kfg);
    }
    
    header .decreaseFont:after{
        content: "-";
        font-size: 10px;
        position: absolute;
        top: 5px;
        right: 5px;
        font-style: italic;
        color: var(--kfg);
    }
    
    header .decreaseFont{
        border-left: 1px solid rgba(255,255,255,0.1);
    }
    
    header select{
        width: auto;
        height: 28px;
        border: 0 none;
        border-left: 1px solid rgba(255,255,255,0.1);
        border-right: 1px solid rgba(0,0,0,0.1);
        background: rgba(53,53,58,1);
        color: var(--kfg);
        margin: 1px -1px;
        padding-left: 5px;
        float: left;
    }
    
    header .word-wrap {
        font-family: "Roboto", sans-serif;
        font-size: 13px;
        padding: 0 5px;
        display: block;
        float: left;
        line-height: 30px;
        color: var(--kfg);
        border-right: 1px solid rgba(0,0,0,0.1);
        border-left: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
    }
    
    header .align {
        padding: 0 5px;
        display: block;
        float: left;
        line-height: 30px;
        border-right: 1px solid rgba(0,0,0,0.1);
        border-left: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
    }
    
    header [name=align] {
        display: none;
    }
    
    header [name=align]:checked + label{
        background: rgba(0,0,0,0.3);
    }
    
    header .align.justify::before {
        content:"\\f039";
    }
    
    header .align.left::before {
        content:"\\f036";
    }
    
    header .word-wrap input{
        position: relative;
        top: 3px;
    }
    </style>`;
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        // Si es un archivo de texto, lo cargamos con Ajax 
        var req = new XMLHttpRequest();
            req.open('GET', newValue, false); 
            req.send(null);
    
        if (req.status == 200){
            this.data = req.responseText;
        }
    }
 
    open(){
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
    
            self.filename = evt.target.files[0].name;
            self.setConfiguration(self);
            
            reader.onload = function(){
                var data = reader.result;
                var isr  = self.shadowRoot;
    
                isr.querySelector("pre").innerText = data;
    
                // Actualizamos los estilos, si los tenía antes
                isr.querySelector("pre").style = self.config;
    
                if(self.classes && 
                   self.classes.indexOf("word-wrap") != -1){
                       isr.querySelector("pre")
                          .setAttribute("class", self.classes);
    
                    var isrw = isr.querySelector("#word-wrap");
                    FileViewer.triggerWordWrap(isrw, true);
    
                }
            }
    
            // Solicitamos leer el archivo
            reader.readAsText(evt.target.files[0]);
    
            // Eliminamos el input file
            e.remove();
        }
    
        // Añadimos al body el input file y simulamos click
        this.shadowRoot.appendChild(e);
        e.click();
    }

    static wordWrap(e){
        var pre = e.parentElement
                   .parentElement
                   .nextElementSibling
                   .children[0];
        if(e.checked){ pre.classList.add(e.id); } 
        else { pre.classList.remove(e.id); }
    }
    
    static triggerWordWrap(e, v){
        e.checked = v;
        var event = new Event('change', {
            'bubbles': true,
            'cancelable': true
        });
        e.dispatchEvent(event);
    
        FileViewer.wordWrap(e);
    }
    
    style(e){
        var pre = this.shadowRoot.querySelector("pre");
    
        if(e.classList.contains("fontName")){
            pre.style.fontFamily = e.value;
    
        } else if(e.classList.contains("increaseFont")){
            var v = parseFloat(getComputedStyle(pre).fontSize);
            pre.style.fontSize = (v + 1) + "px";
    
        } else if(e.classList.contains("decreaseFont")){
            var v = parseFloat(getComputedStyle(pre).fontSize);
            pre.style.fontSize = (v - 1) + "px";
    
        } else if(e.classList.contains("justify")){
            pre.style.textAlign ="justify";
    
        } else if(e.classList.contains("left")){
            pre.style.textAlign ="left";
        }
    }
    
    setConfiguration(instance){
        var sr = instance.shadowRoot;
    
        instance.config = sr.querySelector("pre")
                            .getAttribute("style");
        instance.classes = sr.querySelector("pre")
                             .getAttribute("class");
    
        if(typeof instance.classes == "undefined"){
            instance.classes = "";
        }
    
        var a = this.shadowRoot.querySelector("a");
            a.id = "s" + new Date().getTime();
            a.style.display = "none";
            a.download = this._filename;
    }
    
    save() {
        this._filename = this.getAttribute("filename");
        var text = this.shadowRoot.querySelector("pre").innerHTML;
        var filename = prompt("Por favor, introduce el nombre del fichero", this._filename);
    
        if (filename != null) {
            // Convertimos los datos a un objeto procesable
            var file = new Blob([text], {type: 'text/plain'});
    
            // Actualizamos el contenido del hipervínculo
            // para que pueda ser descargado
            var a = this.shadowRoot.querySelector("a");
            a.download = filename;
            a.href = 'data:text/plain;charset=utf-8,' + 
                     encodeURIComponent(text);
    
            
            setTimeout(function () {
                a.click();
            }, 0);
        }
    }
    
    getSelectedText(){
        var sroot = this.shadowRoot;
        var el = sroot.querySelector("pre");
        var s = sroot.getSelection();
        var bn = s.baseNode;
    
        if(!bn || !bn.nodeValue) return;
    
        // Recuperamos la posición dónde empieza
        // el texto seleccionado en el nodo actual
        var startSel = s.getRangeAt(0).startOffset;
    
        // Recuperamos la posición dónde termina
        // el texto seleccionado en el nodo actual
        var endSel = s.getRangeAt(0).endOffset;
    
        // Recuperamos el texto seleccionado
        var sel = bn.nodeValue.substring(startSel, endSel);
    
        // Recuperamos el número de nodos del contenedor
        var cn = bn.parentElement.childNodes;
    
        // Averiguamos el índice del nodo seleccionado
        var idx = Array.prototype.indexOf.call(cn, bn);
    
        // La longitud de los nodos anteriores 
        // será el offset a sumar
        var offset = 0;
        for(var x = 0; x < idx; x++){
            offset += cn[x].textContent.length;
        }
    
        // Configuramos la propiedad
        this.selection = {};
        this.selection.node = bn.nodeValue;
        this.selection.text = sel;
        this.selection.start = offset + startSel;
        this.selection.end = offset + endSel;
    
        return this.selection;
    }
}

customElements.define("file-viewer", FileViewer);