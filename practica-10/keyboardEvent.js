var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");

if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
    function KeyboardEvent(type, json){
        // Creamos el evento de teclado
        var keyboardEvent = document.createEvent("KeyboardEvent");

        // Comprobamos el método de inicialización
        var initMethod = typeof keyboardEvent.initKeyboardEvent 
            !== 'undefined' 
            ? "initKeyboardEvent" 
            : "initKeyEvent";

        // Establecemos los valores por defecto
        if(!json.hasOwnProperty("bubbles")) json.bubbles = true;
        if(!json.hasOwnProperty("cancelable")) 
            json.cancelable = true;
        if(!json.hasOwnProperty("ctrlKey"))  json.ctrlKey = false;
        if(!json.hasOwnProperty("altKey"))   json.altKey = false;
        if(!json.hasOwnProperty("shiftKey")) json.shiftKey = false;
        if(!json.hasOwnProperty("metaKey")) json.metaKey = false;
        if(!json.hasOwnProperty("location")) json.location = 0;
        
        if(initMethod == 'initKeyEvent'){
            keyboardEvent[initMethod](
                type,
                json.bubbles,
                json.cancelable,
                window,
                json.ctrlKey,
                json.altKey,
                json.shiftKey,
                json.metaKey,
                json.key.charCodeAt(), 0
            );

        } else {
            keyboardEvent[initMethod](
                type,
                json.bubbles,
                json.cancelable,
                window,
                json.key,
                json.location,
                (json.ctrlKey ? "Control" : " ") + 
                (json.altKey ? "Alt" : " ") + 
                (json.shiftKey ? "Shift" : " ") + 
                (json.metaKey ? "Meta" : " ") + 
                (json.metaKey ? "NumLock" : " "),
                false,
                window.navigator.language
            );
        }
        return keyboardEvent;
    }
}