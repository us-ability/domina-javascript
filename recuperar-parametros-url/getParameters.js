function getParameters(name){
    if(window.location.search == "") return null;

    var items = window.location.search.substr(1).split("+");
    var vars = new Array();
    for(var item of items){
        var key = item.split(/=/)[0];
        var val = item.split(/=/)[1];
        vars[key] = val;
    }
    if(name){
        return vars[name];
    } else {
        return vars;
    }
}