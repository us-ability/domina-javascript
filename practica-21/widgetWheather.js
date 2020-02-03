var Wheather = function(selector){
    Wheather.target = document.querySelector(selector);

    Wheather.data = {};
    Wheather.location = {};
    Wheather.position = {};

    return Wheather;
}

Wheather.translate = {
    apparentTemperature: "Senciación térmica",
    cloudCover: "nubosidad",
    dewPoint: "Punto de rocío",
    humidity: "Humedad",
    icon:"",
    location: "",
    nearestStormDistance: 'Tormenta más cercana',
    ozone: "Ozono",
    precipIntensity: "Intensidad de lluvia",
    precipProbability: "Probabilidad de lluvia",
    pressure: "Presión",
    summary: "Resumen",
    sunsetTime: "El Sol se pone a las",
    sunriseTime: "Amanece a las",
    temperature: "Temperatura",
    temperatureMax: "Temperatura máxima",
    temperatureMin: "Temperatura mínima",
    temperatureMinTime: "a las",
    temperatureMaxTime: "a las",
    uvIndex: "Índice UV",
    uvIndexTime: "Hora de mayor índice UV",
    visibility: "Visibilidad",
    windBearing: "Dirección del viento",
    windGust: "Ráfagas de viento de",
    windSpeed: "Velocidad del viento",
}

Wheather.units = {
    apparentTemperature: "ºC",
    cloudCover: "%|100",
    dewPoint: "ºC",
    humidity: "%|100",
    icon:"",
    location: "",
    nearestStormDistance: 'Km',
    ozone: "DU",
    precipIntensity: "lH|0.0163871",
    precipProbability: "%|100",
    pressure: "mbar",
    summary: "",
    sunsetTime: "",
    sunriseTime: "",
    temperature: "ºC",
    temperatureMax: "ºC",
    temperatureMin: "ºC",
    temperatureMinTime: "",
    temperatureMaxTime: "",
    uvIndex: "",
    uvIndexTime: "",
    visibility: "Km/s|1.60934",
    windBearing: "º",
    windGust: "Km/s|1.60934",
    windSpeed: "Km/s|1.60934",
}

Wheather.draw = function(){
    navigator.geolocation.getCurrentPosition(exito, error);

    function exito(pos){
        // Recuperamos la ubicación
        var coords = pos.coords;
        
        // Guardamos las coordenadas
        Wheather.position = coords;

        Wheather.getForecast();
    }

    function error(e){
        if(e.code == error.PERMISSION_DENIED){
            console.log("El usuario bloqueó el acceso");

        } else if(e.code == error.POSITION_UNAVAILABLE){
            console.log("Servicio indisponible temporalmente");

        } else if(e.code == error.TIMEOUT){
            console.log("Se sobrepasó el tiempo de espera");

        } else{
            console.log("Error desconocido");
        }
    }
}

Wheather.getForecast = function(){
    var coords = this.position;
    var loc = coords.latitude + "," + coords.longitude;

    // Prparamos la URL para llamar a la API del tiempo
    var API_KEY = "d810f45304291f353d8f1f1c97fe8971";
    var url  = "https://api.darksky.net/forecast/" + API_KEY + "/";
        url += loc;
        url += "?lang=es&units=ca";

    // Inicializamos petición Ajax
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        // Si la petición está completada y lista
        if (this.readyState == 4) {
            if (this.status == 200) { 
                // Y tuvo éxito
                Wheather.data = JSON.parse(this.responseText);

                Wheather.getLocation();

            } else if (this.status == 404) { 
                // Y el archivo no lo encuentra o no existe
                alert("Predicción no encontrada."); 

            } else {
                // Y no sabemos que ocurrió
                alert("Error no controlado."); 
            }
        }
    }

    // Realizamos la petición
    xhttp.open("GET", url, true);
    xhttp.send();
}


Wheather.getLocation = function(){
    var coords = this.position;
    var lat = coords.latitude;
    var lng = coords.longitude;
    var url  = "https://nominatim.openstreetmap.org/reverse";
        url += "?format=json&lat=" + lat + "&lon=" +  lng;

    // Inicializamos petición Ajax
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        // Si la petición está completada y lista
        if (this.readyState == 4) {
            if (this.status == 200) { 
                // Y tuvo éxito
                Wheather.location = JSON.parse(this.responseText);
                Wheather.location = Wheather.location.address;

                Wheather.data.currently.location = 
                         Wheather.location.road +
                         ", " + Wheather.location.city_district + 
                         ", " + Wheather.location.city;

                Wheather.show();

            } else if (this.status == 404) { 
                // Y el archivo no lo encuentra o no existe
                alert("Ubicación no encontrada."); 

            } else {
                // Y no sabemos que ocurrió
                alert("Error no controlado."); 
            }
        }
    }

    // Realizamos la petición
    xhttp.open("GET", url, true);
    xhttp.send();
}

Wheather.show = function(){
    var urlImages = 'https://darksky.net/images/weather-icons/';

    // Establecemos la imagen
    var item  = Wheather.target
                .querySelector("[data-wheather-property=icon]");
    var value =  Wheather.data.currently.icon;
    item.src  = urlImages + value + '.png';
    
    // Buscamos todas propiedades que queremos mostrar
    var selector = "[data-wheather-property]";
    var items = Wheather.target.querySelectorAll(selector);

    // Rellenamos los valores
    for(var x = 0; x < items.length; x++){
        var item  = items[x];
        var key   = item.dataset.wheatherProperty;
        var value =  Wheather.data.currently[key];
        
        // Si no hay valor buscamos en el pronóstico diario
        if(!value || typeof value == "undefined"){
            var value =  Wheather.data.daily.data[0][key];
        }

        // Si la unidad tiene que convertirse
        var unit = Wheather.units[key].split("|");
        if(unit.length > 1){
            value = (value * unit[1]).toLocaleString();
        } else {
            if(Wheather.units[key] == "ºC"){
                value = Math.round(value)   
            }
        }

        // Si es una hora
        if(key.indexOf("Time") != -1){
            value = new Date(value * 1000).toLocaleTimeString();
        }

        item.innerHTML = '<b>' + 
            Wheather.translate[key] + 
            '</b>' + 
            value + ' ' + unit[0];
    }
}