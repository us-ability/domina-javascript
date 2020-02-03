HTMLElement.prototype.setCounter=function(){
    var tmpl1 = "Caracteres escritos: ", tmpl2 = "";
    var next = this.nextElementSibling;
    var maxl = parseInt(this.getAttribute("maxlength"));

    if(!isNaN(maxl)){
        tmpl2 = ". Disponibles: " + (maxl - this.value.length);
    }

    if(!next || !next.classList.contains("counter")){
        var counter = document.createElement("span");
            counter.classList.add("counter");
            counter.innerHTML = tmpl1 + this.value.length + tmpl2;
        this.parentElement.insertBefore(counter, next)

        this.oninput = countChars;
    }

    function countChars(e){
        var val = this.value.length;
        this.nextElementSibling.innerHTML = tmpl1 + val + tmpl2;
    }
}

HTMLElement.prototype.removeCounter=function(){
    var next = this.nextElementSibling;

    if(next && next.classList.contains("counter")){
        next.remove();
        this.oninput = null;
    }
}
