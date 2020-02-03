// Definición del constructor 
var Chatbot = function(){
    return Chatbot;
}

// Título del chatbot
Chatbot.title = "JSChatbot";

// Versión del componente
Chatbot.version = 1.0;

// Mensaje Inicial al cargar el chatbot
Chatbot.welcomeMessage = "Hola!, ¿qué deseas saber?";

// Icono asociado al chatbot
Chatbot.iconBot = "";

// Icono asociado al usuario que está actualmente logado
Chatbot.iconUser = "";

// Definición del constructor de la BBDD
Chatbot.database = function(){ 
    var database = indexedDB; 
    return database;
};

// Propiedad para controlar el número de preguntas fallidas
Chatbot.database.failedtries = 0;

// Datos a insertar en la BBDD
Chatbot.database.data = [];

// Input de texto que se utilizará para comunicarse con el chatbot
Chatbot.input = {};

// Evento que se utilizará para controlar el input
Chatbot.input.onkeydown = null;

Chatbot.init = function(selector){
    // Asignamos el target para gestionar el control de formulario
    Chatbot.target = document.querySelector(selector);

    // Creamos la cabecera
    Chatbot._addHeader(selector);

    // Creamos el contenedor de mensajes
    Chatbot._addMessageTemplate(selector);

    // Creamos el contenedor de mensajes
    Chatbot._addContainer(selector);
    
    Chatbot.initDatabase();

    // Recuperamos el input de entradad de datos
    Chatbot.input = document.forms[0].elements[0];

    // Asignamos el evento para la entrada de datos
    Chatbot.input.onkeydown = function check(e){
        var resp = this.value.toLowerCase();
        var assert = ['si', 'sí', 'ayuda', 'ejecuta']
                     .indexOf(resp.split(" ")[0]);

        if(e.keyCode == 13) {
            if(assert < 2 && Chatbot.database.failedtries > 2){
                Chatbot._showIndex();

            } else if(assert == 2){
                Chatbot._showIndex();

            } else if(assert == 3){
                var aux = this.value.split(" ")[0];
                aux = this.value.replace(aux, '');

                eval(aux);

                Chatbot._showMessage("Ejecutado...<br>" + aux);

            } else {
                Chatbot.database.select(this.value, 
                                        Chatbot._showMessage)
            }
        }
    }
}

Chatbot._showMessage = function(msg){
    var template = document.querySelector("template");
    var cont = document.querySelector(".history");

    // Mensaje del usuario
    var tmpl = template.content.cloneNode(true);

    tmpl.querySelector("img").src = Chatbot.iconUser;
    tmpl.querySelector('.time').innerHTML = Chatbot._getTime();
    tmpl.querySelector('p').innerHTML = Chatbot.input.value;

    cont.appendChild(tmpl)

    // Mensaje del bot
    var tmpl = template.content.cloneNode(true);

    tmpl.querySelector('.message').classList.add("black");
    tmpl.querySelector("img").src = Chatbot.iconBot;
    tmpl.querySelector('h3').innerHTML = Chatbot.title;
    tmpl.querySelector('.time').innerHTML = Chatbot._getTime();
    tmpl.querySelector('p').innerHTML = msg;

    cont.appendChild(tmpl);

    Chatbot._updateScroll();

    // Limpiamos el contenido del input
    Chatbot.target.querySelector("input").value = "";
}

Chatbot._updateScroll = function(){
    var cont = document.querySelector(".history");
    setTimeout(function(){ cont.scrollTop = cont.scrollHeight; }, 50);
}

Chatbot._addHeader = function(selector){
    var header = document.createElement("header");
    
    // Definimos el botón de cerrar
    var aClose = document.createElement("a");
        aClose.href = '#';
        aClose.innerHTML = "x";
        aClose.classList.add("close", "btn");
        aClose.onclick = function(){
            Chatbot.target.remove();
        }

    var aMaximize = document.createElement("a");
        aMaximize.href = '#';
        aMaximize.innerHTML = "";
        aMaximize.classList.add("btn", "far", "fa-window-maximize");
        aMaximize.onclick = function(){
            Chatbot.target.classList.remove("minimized");
            if(!Chatbot.target.classList.contains("maximized")){
                Chatbot.target.classList.add("maximized");
                Chatbot.target.querySelectorAll(".btn")[1].classList.add("fa-window-restore");
                Chatbot.target.querySelectorAll(".btn")[1].classList.remove("fa-window-maximize");
                Chatbot.target.querySelector(".history").style.height = (window.innerHeight - 95) + "px";
            } else{
                Chatbot.target.classList.remove("maximized");
                Chatbot.target.querySelectorAll(".btn")[1].classList.add("fa-window-maximize");
                Chatbot.target.querySelectorAll(".btn")[1].classList.remove("fa-window-restore");
                Chatbot.target.querySelector(".history").style.height = "";
            }
        }
    
    var aMinimize = document.createElement("a");
        aMinimize.href = '#';
        aMinimize.innerHTML = "";
        aMinimize.classList.add("btn", "far", "fa-window-minimize");
        aMinimize.onclick = function(){
            Chatbot.target.classList.remove("maximized");
            Chatbot.target.classList.add("minimized");
            Chatbot.target.querySelector(".history").style.height = "";
        }

    // Definimos el icono del robot
    var imgHeader = new Image();
        imgHeader.src = Chatbot.iconBot;

    // Definimos el título de la cabecera
    var h2Header = document.createElement("h2");
        h2Header.appendChild(imgHeader);
        h2Header.innerHTML += Chatbot.title;

    // Añadimos todo a la cabcera
        header.appendChild(aClose);
        header.appendChild(aMaximize);
        header.appendChild(aMinimize);
        header.appendChild(h2Header);

    // Añadimos la cabecera al elemento destino
    document.querySelector(selector).appendChild(header);
}

Chatbot._addMessageTemplate = function(selector){
    // Creamos el elemento template
    var template = document.createElement("template");

    // Definimos su contenido
    template.innerHTML = '<div class="message">\
    <img src="' + Chatbot.iconUser + '"\
         alt=""\
         width="32"\
         height="32" />\
    <div class="message-content">\
        <span class="time"></span>\
        <h3>Tú</h3>\
        <p></p>\
    </div>\
</div>';
    
    // Añadimos la cabecera al elemento destino
    document.querySelector(selector).appendChild(template);
}

Chatbot._addContainer = function(selector){
    // Creamos el contenedor de mensajes
    var cont = document.createElement("div");
    cont.classList.add("history");

    // Añadimos el mensaje inicial
    var template = document.querySelector("template");
    var tmpl = template.content.cloneNode(true);

    tmpl.querySelector('.message').classList.add("black");
    tmpl.querySelector("img").src = Chatbot.iconBot;
    tmpl.querySelector('h3').innerHTML = Chatbot.title;
    tmpl.querySelector('.time').innerHTML = Chatbot._getTime();
    tmpl.querySelector('p').innerHTML = Chatbot.welcomeMessage;

    cont.appendChild(tmpl)

    // Definimos el elemento de entrada de datos
    var input = document.createElement("input");
    input.id = "req";
    input.type = "text";
    input.setAttribute("placeholder", 
                       "Escribe 'ayuda' para mostrar los temas");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autofocus", "on");

    // Definimos el formulario
    var form = document.createElement("form");
    form.method = "post";
    form.action="#"
    form.onsubmit = function(){ return false; }
    form.appendChild(input);

    // Añadimos el contenedor y el formualrio 
    // al elemento destino
    document.querySelector(selector).appendChild(cont);
    document.querySelector(selector).appendChild(form);
}

Chatbot._getTime = function (){
    return Intl.DateTimeFormat("es-ES", { 
          hour: "2-digit", 
          minute: "2-digit"
        }
    ).format(new Date());
}

Chatbot.initDatabase = function(){
    // Recuperamos el constructor de IndexedDB
    window.indexedDB = window.indexedDB || 
                    window.webkitIndexedDB || 
                    window.mozIndexedDB || 
                    window.msIndexedDB;

    // Definimos el controlador de transacciones soportado
    window.IDBTransaction = window.IDBTransaction ||
                            window.webkitIDBTransaction ||
                            window.mozIDBTransaction ||
                            window.msIDBTransaction;

    // Definimos el controlador de rangos clave
    window.IDBKeyRange = window.IDBKeyRange || 
                        window.webkitIDBKeyRange ||
                        window.mozIDBKeyRange ||
                        window.msIDBKeyRange;

    // Variable para referenciar la base de datos utilizada
    Chatbot.database.db = null;
    
    // Por si hay algún error
    Chatbot.database.onerror = function(e) {
        console.log(e);
    };

    // Una vez que está todo controlado, 
    // abrimos nuestra base de datos
    var req = window.indexedDB.open("Chatbot", 1);

    req.onupgradeneeded = function(event) { 
        var db = event.target.result;
    
        // Creamos el almacén de objetos (objectStore) para
        // ser utilizado por nuestra base de datos
        var objStore = db.createObjectStore("messages", 
              { keyPath: "id", autoIncrement: true }
        );

        // Creamos los índices, por si acaso los necesitamos
        objStore.createIndex("question", "question", 
                             { unique: true });
        objStore.createIndex("response", "response", 
                             { unique: true });
    };

    req.onsuccess = function(event) {    
        Chatbot.database.db = event.target.result;
    };

    req.onerror = Chatbot.database.onerror;

    // Esperamos a que la base de datos esté lista
    // para insertar los datos
    var int = setInterval(function(){
        if(Chatbot.database.db){
            clearInterval(int);
            Chatbot.database.insert(Chatbot.database.data);
        } 
    }, 250)
}

Chatbot.database.insert = function(data) {
    var db = Chatbot.database.db;
    var trans = db.transaction('messages', 'readwrite');
    var store = trans.objectStore('messages');

    data.forEach(function(reg) {
        var request = store.add(reg);

        request.onerror = function(e) {
            console.log("Error code " + 
                        e.target.error.code + ". " + 
                        e.target.error.message);
        };
    });
};

Chatbot.database.select = function(key, callback) {
    var db = Chatbot.database.db;
    var trans = db.transaction('messages', 'readonly');
    var req = trans.objectStore('messages').openCursor();

    var result = null;

    req.onsuccess = function(e) {
        var cursor = e.target.result;
        var resp = 'Lo siento!. ';
        resp += 'No he encontrado nada referente a tu pregunta'; 

        if(cursor){
            key = key.toLowerCase();
            key = key.normalize('NFD')
                     .replace(/[\u0300-\u036f]/g, "");

            var aux = cursor.value.question.toLowerCase();
            aux = aux.normalize('NFD')
                     .replace(/[\u0300-\u036f]/g, "");

            if(aux.indexOf(key) != -1){
                    result = cursor.value;
                    callback(result.response);
                    
                    Chatbot.database.failedtries = 0;
                    return;

            } else
                cursor.continue();
            
        } else{
            callback(resp);
            
            Chatbot.database.failedtries++;
            Chatbot._showHelp();
        }
    }

    req.onerror = function(e) {
        console.log("Error: " + e);
    };
}

Chatbot._showHelp = function(){
    if(Chatbot.database.failedtries > 2){
        Chatbot._showMessage("¿Necesitas ayuda?");
        Chatbot._updateScroll();
    }
}

Chatbot._showIndex = function() {
    var db = Chatbot.database.db;
    var trans = db.transaction('messages', 'readwrite');
    var req = trans.objectStore('messages').openCursor();

    var resp = '<ul><li>';
    resp += '<h3>Estos son los temas con los que te puedo ayudar';
    resp += '</h3></li>';

    req.onsuccess = function(e) {
        var cursor = e.target.result;
        
        if(cursor){
            resp += '<li><b>' + 
                    cursor.key + 
                    '</b> - ' + cursor.value.question + '</li>';
            cursor.continue();
            
        } else {
            resp += '</ul>';
            Chatbot._showMessage(resp);
            Chatbot._updateScroll();
            Chatbot.database.failedtries = 0;
        }
    }

    req.onerror = function(e) {
        console.log("Error: " + e);
    };
}