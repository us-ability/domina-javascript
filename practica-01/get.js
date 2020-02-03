var get = function(t){
    var items = document.querySelectorAll(t);

    if(items.length > 1)
        return items
    else
        return items[0];
};

get('div')[1];	 // Devuelve el segundo DIV que encuentre
get('#head'); 	 // Devuelve el elemento id ID head
