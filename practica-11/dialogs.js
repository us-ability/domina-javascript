HTMLElement.prototype.showDialog=function(){
    if(!this.classList.contains("popup")) {
        alert("El elemento no acepta este método!")
        return;
    }

    var overlay = this.parentElement;
    overlay.style.display = "block";

    // Definimos evento en el botón de cerrar superior
    var cls = this.querySelector(".popup-close");
    cls.addEventListener("click", function(){
        this.hideDialog.call(overlay.children[0]);
    });

    // Definimos evento en el botón de cerrar del footer
    var cls = this.querySelector(".popup-footer button");
    cls.addEventListener("click", function(){
        this.hideDialog.call(overlay.children[0]);
    });
}

HTMLElement.prototype.hideDialog=function(){
    if(!this.classList.contains("popup")) {
        alert("El elemento no acepta este método!")
        return;
    }

    var overlay = this.parentElement;
    overlay.style.display = "none";
}

