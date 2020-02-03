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

SudoQ.getBoard = function(){
    // Función que genera un array aleatorio de números entre 1 y 9
    function randArray(){
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        return arr.sort(function() {return Math.random() - 0.5});
    }

    // Iniciamos el tablero
    this.board = new Array();
    var xCount = 0, fCount = 0, fa = 0;
    var nums   = randArray();
    for (x = 0; x < 81; x++){
        // Recuperamos la fila y la columna correspondiente a x
        var f = Math.floor(x / 9);
        var c = x % 9;

        // Recuperamos la zona a la que pertenece la coordenada
        var r = f < 3 ? 0 : (f >= 3 && f < 6 ? 1 : 2)
            r = r * 3 + (c < 3 ? 0 : (c >= 3 && c < 6 ? 1 : 2))

        // Generamos nuevo array si cambiamos de fila
        if(f != fa && c == 0){
            fa = f;
            nums = randArray();
        }

        // Recuperamos el siguiente número
        nums.sort(function() {return Math.random() - 0.5});
        var n = nums.shift();
        
        // Si n no está en la columna, fila o región, lo añadimos
        // al tablero, si no, generamos otro y repetimos el proceso
        if(this.getRow(f).indexOf(n) == -1 &&
           this.getCol(c).indexOf(n) == -1 &&
           this.getRegion(r).indexOf(n) == -1){
               this.board[x] = n;
               fCount = 0;
            
        } else {
            if(fCount > nums.length){
                var aux = this.board.pop();
                nums.push(aux);
                x--;

            } else {
                fCount++;
            }

            nums.push(n);
            x--;
        }
        
        xCount++;

        // Cada 10000 intentos reiniciamos el contador,
        // para asegurarnos de no entrar en bucles infinitos
        if(xCount % 10000 == 0) x = 0;

        // Si hemos llegado al máximo de intentos, salimos
        if(xCount == 100000) break;
    }

    // Si no hemos tenido éxito,
    // lo volvemos a llamar hasta que lo tengamos
    if(xCount == 100000) this.getBoard();

    // Devolvemos el array sin los posible errores 
    // que se hayan podido causar
    return this.board.filter(function(e, i){ return i >= 0 });
}

SudoQ.getCol = function(n){
    return this.board.map(function(v, i){
        return i % 9 == n ? v : null
    }).filter(function(e){ return e != null });

}

SudoQ.getRegion = function(n){
    n = n * 3 - (2 * (n % 3));
    return this.board.filter(function(e, i){ 
        return (i < (n * 3 + 3) && i >= (n * 3 + 0)) || 
            (i < ((n+3) * 3 + 3) && i >= ((n+3) * 3 + 0)) ||
            (i < ((n+6) * 3 + 3) && i >= ((n+6) * 3 + 0))
    });
}
    
SudoQ.getRow = function(n){
    return this.board.map(function(v, i){
        return i >= (n * 9) && i < ((n + 1) * 9)  ? v : null
    }).filter(function(e){ return e != null });

}

SudoQ.createInterface = function(target){
    // Si ya está creado, salimos
    if(document.querySelectorAll(".sudo-q").length != 0) return;

    // Definimos el nuevo tablero
    this.target.classList.add("sudo-q");

    var table = document.createElement('table');
        table.classList.add("sudo-q-table");
        table.setAttribute("cellpadding", '0');
        table.setAttribute("cellspacing", '0');

    // Creamos la cabecera de la tabla
    var tHead  = document.createElement('thead');
    var trHead = document.createElement('tr');
    var thHead = document.createElement('th');
    thHead.setAttribute("colspan", "9");
    
    // Creamos  el elemento que funcionará como título
    var aux = document.createElement('b');
    aux.innerHTML = "SudoQ 1.0";
    thHead.appendChild(aux);

    // Añadimos el texto asociado al desplegable de niveles
    var aux = document.createElement('span');
    aux.innerHTML = "Nivel";
    thHead.appendChild(aux);

    // Añadimos el desplegable de niveles
    var aux = document.createElement('select');
    aux.id = "sudo-q-level";
    aux.innerHTML = `<option value="1"> Fácil</option>
                    <option value="2"> Medio</option>
                    <option value="3"> Difícil</option>
                    <option value="4"> Experto</option>`;
    thHead.appendChild(aux);

    // Añadimos el checkbox para gestionar la visualización
    // de errores
    var aux = document.createElement('input');
    aux.type = "checkbox";
    aux.checked = true;
    aux.id = "sudo-q-error-check"
    thHead.appendChild(aux);

    // Añadimos el texto asociado al checkbox anterior
    var aux = document.createElement('label');
    aux.setAttribute("for", "sudo-q-error-check")
    aux.innerHTML = "Mostrar Errores";
    thHead.appendChild(aux);

    trHead.appendChild(thHead);
    tHead.appendChild(trHead);
    table.appendChild(tHead);

    // Creamos el cuerpo de la tabla
    var tBody = document.createElement('tbody');
    var trBody, tdBody;
    for(var x = 0; x < 81; x++){
        if(x == 0 || (x) % 9 == 0){
            if(x != 0){
                tBody.appendChild(trBody);
            }
            trBody = document.createElement('tr');
        }

        // Añadimos el elemento editable para escribir
        var aux = document.createElement('input');
            aux.id = "c" + Math.floor(x / 9) + (x % 9);
            aux.type = "text";
            aux.classList.add("sudo-q-cell");
            aux.setAttribute("maxlength", "1");
            aux.setAttribute("oninput", "SudoQ.checkError(this)");

        tdBody = document.createElement('td');
        tdBody.appendChild(aux);

        trBody.appendChild(tdBody);
    }
    tBody.appendChild(trBody);
    table.appendChild(tBody);
    
    // Creamos el footer de la tabla
    var tFoot = document.createElement('tfoot');
    var trFoot = document.createElement('tr');
    var tdFoot = document.createElement('td');
    tdFoot.setAttribute("colspan", '9');

    // Añadimos el botón de nuevo juego
    var aux = document.createElement('input');
    aux.type = "button";
    aux.value = "NUEVO";
    aux.setAttribute("onclick", "new SudoQ('"+target+"')");
    tdFoot.appendChild(aux);

    // Añadimos el botón de pausar el juego
    var aux = document.createElement('input');
    aux.id = 'chrono-pause';
    aux.type = "button";
    aux.value = "PAUSAR";
    aux.setAttribute("onclick", "Chrono.pause('chrono-pause')");
    tdFoot.appendChild(aux);

    // Añadimos el botón de resolver el juego
    var aux = document.createElement('input');
    aux.type = "button";
    aux.value = "RESOLVER";
    aux.setAttribute("onclick", "SudoQ.resolve()");
    tdFoot.appendChild(aux);

    // Añadimos el display para mostrar el tiempo consumido
    var aux = document.createElement('input');
    aux.id = "sudo-q-display"
    aux.type = "text";
    aux.value = "00:00:00";
    aux.style["text-align"] = "center";
    tdFoot.appendChild(aux);

    // Añadimos todo a la tabla
    trFoot.appendChild(tdFoot);
    tFoot.appendChild(trFoot);
    table.appendChild(tFoot);

    // Añadimos la tabla al elemento target que nos indicaron
    this.target.appendChild(table);
    
    // Añadimos los estilos
    var aux = document.createElement('style');
    aux.innerHTML = `@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap');

    .sudo-q-table { 
        border: 1px solid rgba(0,0,0,0.2); 
        margin: 0 auto; 
        font-family: 'Roboto', sans-serif;
    }

    .sudo-q-table thead th {
        height: 40px;
        width: 100%;
        background: #204080;
        border-bottom: 1px solid #fff;
        color: #fff;
        font-size: 14px;
        font-weight: 300;
    }

    .sudo-q-table thead th span {
        width: 40px;
        display: inline-block;
        text-align: right;
        padding-right: 5px;
    }

    .sudo-q-table thead b, .sudo-q-table thead select {
        min-width: 70px;
        text-align: left;
        display: inline-block;
        font-weight: 300;
    }

    .sudo-q-table thead b{
        color: #90b0d0;
        font-weight: 400;
        font-variant: small-caps;
    }

    .sudo-q-table thead select {
        border: 1px solid rgba(255,255,255,0.25);
        background: #204080;
        color: #fff;
    }

    .sudo-q-table thead input{
        margin-left: 15px;
        position: relative;
        top: 2px;
        width: 14px;
        height: 14px;
    }

    .sudo-q-table td {
        border-top: 1px solid rgba(0,0,0,0.1)
    }

    .sudo-q-table td:nth-child(2n+1) .sudo-q-cell {
        background: #f0f5ff;
    }

    .sudo-q-table tr:nth-child(3n+1) td {
        border-top: 1px solid rgba(0,0,0,0.2);
    }

    .sudo-q-table tr:first-child td {
        border-top-color: rgba(0,0,0,0.1);
    }

    .sudo-q-table td:nth-child(3n) {
        border-right: 1px solid rgba(0,0,0,0.2);
    }

    .sudo-q-table td:last-child {
        border-right: 0 none;
    }

    .sudo-q-cell {
        width: 36px;
        height: 36px;
        background: transparent;
        font-size: 18px;
        font-weight: bold;
        border: 0 none;
        text-align: center;
        color: #000;
    }

    .sudo-q table tfoot input[type="button"] {
        background: #204080;
        border: 1px solid #fff;
        color: #fff;
        height: 32px;
        margin: 2px -1px 2px 2px;
    }

    #sudo-q-display{
        text-align: center;
        width: 70px;
        display: inline-block;
        height: 30px;
        margin: 3px;
        float: right;
    }`;

    document.head.appendChild(aux);
}

SudoQ.prepareToLevel = function(){
    var t  = 0;
    var l = document.getElementById("sudo-q-level").value;
    var lt = l == 1 ? 40 : (l == 2 ? 45 : (l == 3 ? 49 : 53));
    while(t < lt){
        var x = Math.round(Math.random()*80);
        var f = Math.floor(x / 9);
        var c = x % 9;
        var item = document.getElementById("c"+f+c);
        
        if(item.value != ""){
            item.value = "";
            item.removeAttribute("readonly");
            t++;
        }
    }

    new Chrono("sudo-q-display");
}

SudoQ.resolve = function(){
    for (x = 0; x < 81; x++){
        // Recuperamos la fila y la columna correspondiente a x
        var f = Math.floor(x / 9);
        var c = x % 9;

        // Recuperamos la celda
        var item = document.getElementById("c"+f+c);

        // Rellenamos y estilizamos
        item.value = this.board[x];
        item.setAttribute("readonly", "readonly")
        item.style.color = "#000000";
    }
    document.getElementById("chrono-pause").value = "PAUSAR";
    Chrono.stop();
}

SudoQ.checkError = function(cell){
    var coord = cell.id.substr(1,2);
    var f = coord.substr(0,1);
    var c = coord.substr(1,1);
    var xR = 0;
    var showErrors = document.getElementById("sudo-q-error-check").checked;
    
    for(var x = 0; x < 81; x++){
        var fR = Math.floor(x / 9);
        var cR = x % 9;
        var NumR = this.board[fR * 9 + cR];
        var item = document.getElementById("c"+fR+cR);
        
        // Si es errónea o está vacía, la ponemos en rojo
        if (item.value.trim() != "" && item.value != NumR){
            if(showErrors && c == cR && f == fR) 
                item.style.color = "#fa1e14";
            break;

        } else if(showErrors && c == cR && f == fR) {
            if(showErrors) item.style.color = "#4080C0";
        }
        if (item.value.trim() != "") xR++;
    }

    if (xR == 81){
        Chrono.stop();
        alert ("¡¡Felicidades!!");
    }
}

