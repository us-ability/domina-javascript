var Chrono = function(target){
    // Establecemos una variable para gestionar el temporizador
    Chrono.chronoTimer = null;
    
    // Establecemos una propiedad para saber si se está ejecutando
    Chrono.cronoEjecutandose = false;
    
    // Definimos las variables
    Chrono.seconds = 0;
    Chrono.minutes = 0;
    Chrono.hours = 0;

    Chrono.target = document.getElementById(target);

    // Inicializamos el cronómetro
    Chrono.stop();
    Chrono.start();
    Chrono.show();
}
Chrono.target = null;

Chrono.start = function() {
    //inicializa contadores globales
    Chrono.seconds = 0
    Chrono.minutes = 0
    Chrono.hours = 0
    
    //pone a cero los marcadores
    Chrono.target.value = '00:00:00';
}

Chrono.stop = function(){
    if(Chrono.cronoEjecutandose){
        clearTimeout(chronoTimer);
    }

    Chrono.cronoEjecutandose = false;
}

Chrono.pause = function(target) {
    if (document.getElementById(target).value == "PAUSAR"){
        document.getElementById(target).value = "CONTINUAR";
        for (x = 0; x < 81; x++){
            var f = Math.floor(x / 9);
            var c = x % 9;
            document.getElementById("c"+c+f).readOnly = true;
        }
        Chrono.stop();
    } else {
        for (x = 0; x < 81; x++){
            var f = Math.floor(x / 9);
            var c = x % 9;
            document.getElementById("c"+c+f).readOnly = false;
        }
        document.getElementById(target).value = "PAUSAR";
        Chrono.show();
    }
}

Chrono.show = function(){
    //incrementa el crono
    Chrono.seconds++
    if ( Chrono.seconds > 59 ) {
        Chrono.seconds = 0
        Chrono.minutes++
        if ( Chrono.minutes > 59 ) {
            Chrono.minutes = 0
            Chrono.hours++
            if ( Chrono.hours > 99 ) {
                alert('Fin de la cuenta');
                Chrono.stop();
                return true
            }
        }
    }

    //configura la salida
    var value = "";
        value = (Chrono.hours < 10) ? 
                "0" + Chrono.hours : 
                Chrono.hours;
        value += (Chrono.minutes < 10) ?
                 ":0" + Chrono.minutes :
                 ":" + Chrono.minutes;
        value += (Chrono.seconds < 10) ?
                 ":0" + Chrono.seconds :
                 ":" + Chrono.seconds;

    Chrono.target.value = value;

    chronoTimer = setTimeout("Chrono.show()", 1000);
    Chrono.cronoEjecutandose = true;
    return true;
}

var SudoQ = function(target){
    // Asignamos target
    this.target = document.getElementById(target);

    // Creamos tablero
    this.board = SudoQ.getBoard();

    // Creamos la interfaz gráfica
    SudoQ.createInterface.call(this, target);
    
    // Lo preparamos para jugar
    SudoQ.resolve();
    SudoQ.prepareToLevel();

    return this;
}


