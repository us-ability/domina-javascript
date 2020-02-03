function isMobile(){
    // Probamos si puede crear un evento táctil
    var te = new TouchEvent("touchstart");
    if(typeof te != "undefined" && te.length == 1) return true;

    // Probamos si el sistema operativo está entre los nombres que
    // sabemos que son móviles
    var devices = ["Android", "webOS", "iPhone", "iPad", 
            "iPod", "BlackBerry", "IEMobile", 
            "Opera Mini"];
    devices = new RegExp(devices.join("|"), 'i');
    if (devices.test(navigator.userAgent)) return true;

    // Testamos por el tamaño de la pantalla
    if(window.screen.width <= 768) return true;

    // Testamos por el tamaño de la ventana ya que puede que 
    // el desarrollador tenga la consola abierta
    if(window.innerWidth <= 768) return true;

    return false;
};