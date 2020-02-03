HTMLElement.prototype.datalist=function(){
    this.addEventListener("input", searchResults);

    function setValue(li){
        this.value = li.innerHTML;

        removeList.call(this);
    }

    function removeList(){
        var uls = this.parentElement.querySelectorAll("ul");
        if(uls.length != 0){
            var ul = uls[0];
            var liItems = ul.querySelectorAll("li");
            for(var x = 0; x < liItems.length; x++){
                var liItem = liItems[x];

                liItem.onclick = null;
            }

            ul.remove();   
        }
        
    }

    function searchResults(event){
        var target = event.target;
        var container = target.parentElement.nextElementSibling;
        var items = container.querySelectorAll("option");

        // Si procede, eliminamos la lista y sus eventos
        removeList.call(target);

        // Si no hay nada que buscar, devolvemos el control
        if(target.value.trim() == "" || target.value.length == 0){
            return false;
        }

        // Creamos el contenedor de resultados
        var ul = document.createElement("ul");
            ul.classList.add("datalist-results");

        // Recorremos los resultados
        var totResults = 0;
        for(var x = 0; x < items.length; x++){
            var item  = items[x];
            var value = target.value.toLowerCase();

            if(item.innerHTML.toLowerCase().indexOf(value) != -1){
                // Añadimos el resultado
                var li = document.createElement("li");
                li.innerHTML = item.innerHTML;

                ul.appendChild(li);

                totResults++;
            }
        }

        if(totResults != 0){
            var ulNext = target.nextElementSibling;            
            target.parentElement.insertBefore(ul, ulNext);

            var liItems = ul.querySelectorAll("li");
            for(var x = 0; x < liItems.length; x++){
                var liItem = liItems[x];

                liItem.onclick = function(){ 
                    setValue.call(target, this); 
                }
            }
        }
    }
}