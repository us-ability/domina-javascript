var AsyncLoad = function(array, callback){
    'use strict'

    // Inicializamos propiedades
    AsyncLoad.loadedFiles = ",";
    AsyncLoad.fileList = array;
    AsyncLoad.elapsedTimes = [];
    AsyncLoad.callback = typeof callback == "undefined" ? 
                         null : 
                         callback;
    
    // Comprobamos que todos los elementos tienen ID
    AsyncLoad._checkIds();

    // Vamos a por el primero
    var item = AsyncLoad.getNext();
}

AsyncLoad._checkIds = function(item){
    var dependencies = true;
    AsyncLoad.fileList.forEach(function(item, idx){
        if(!item.hasOwnProperty("id") || item.id == ""){
            item.id = idx + AsyncLoad.fileList.length;
            dependencies = false;
        }
    });

    // Si se ha establecido algún ID de forma automática, 
    // se ignoran las dependencias
    if(!dependencies){
        AsyncLoad.fileList.forEach(function(item, idx){
            item.dependencies = -1;
        });
    }
}

AsyncLoad.getNext = function(){
    'use strict'

    var item = search(this);

    if(item){
        this.add(item);

    } else {
        // Asignamos el tiempo total de carga
        var t = AsyncLoad.elapsedTimes.reduce(function(total, e){
            return total + e
        });
        AsyncLoad.totalTime = t;

        // Recortamos los caracteres extremos de loadedFiles
        var aux = AsyncLoad.loadedFiles;
        aux = aux.substr(1, aux.length - 2);
        AsyncLoad.loadedFiles = aux;

        // Si tiene función de vuelta, la llamamos
        if(AsyncLoad.callback) AsyncLoad.callback();
    }

    function search(e){
        var found = false, index;

        // Buscamos los que no tienen dependencias
        e.fileList.forEach(function(item, idx){
            if(!item.hasOwnProperty("dependencies") || 
               parseInt(item.dependencies) == -1){
                found = item;
                index = idx;

                return;
            }
        });

        // Si hemos encontrado alguno, lo mandamos cargar
        if(found){
            e.fileList.splice(index, 1);
            return found;

        // Si ya no hay ninguno sin dependencias, 
        // buscamos alguno que pueda cargarse
        } else { 
            e.fileList.forEach(function(item, idx){
                // Si ya lo hemos encontrado, cortamos el foreach
                if(found) return;

                // Miramos que no falte ninguna dependencia
                var missingDep = false;
                item.dependencies.split(",").forEach(function(idp){
                  if(e.loadedFiles.indexOf("," + idp + ",") == -1){
                      missingDep = true;
                      return;
                  }
                });

                // Si no falta ninguna dependencia, lo escogemos
                if(!missingDep){ 
                    found = item; 
                    index = idx

                    return;
                }
            });

            // Si hemos encontrado alguno, lo mandamos cargar
            if(found){
                e.fileList.splice(index, 1);
                return found;
            } else {
                return false;
            }
        }
    }
}

AsyncLoad.add = function(item){
    AsyncLoad._setTime(item.id);

    var script = document.createElement("script");
        script.id = "scriptJS" + item.id;
        script.type= 'text/javascript';

    script.onload = function(e) {
        AsyncLoad.loadedFiles += item.id +",";
        
        AsyncLoad._setTime(item.id);

        // Siguiente elemento
        AsyncLoad.getNext();
    }
    
    script.async = item.hasOwnProperty("async") ? 
                   item.async.toString() : 
                   "true";
    script.src = item.src;
    document.body.appendChild(script);
}

AsyncLoad._setTime = function(id){
    var t = new Date().getTime();
    var x = AsyncLoad.elapsedTimes[id];

    if(x){
        x = t - x;
    } else {
        x = t;
    }
    AsyncLoad.elapsedTimes[id] = x;
}

/*
console.log("El proceso ha tardado:", AsyncLoad.totalTime, "ms")
console.log("Lista de tiempos por ID:", AsyncLoad.elapsedTimes);
*/


