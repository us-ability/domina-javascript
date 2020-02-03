function RSA(p, q){
    // Comprobación de si un número es primo no no
    function isPrime(n) {
        for (var i = 2; i < n; i++) {
            if (n % i === 0) return false;
        }

        return n !== 1;
    }

    // Cálculo de la clave pública
    var n = p * q;
    var z = (p - 1) * (q - 1);

    // Cálculo aleatorio de k
    for(var k = 2; k < z; k++){
        if(z % k != 0 && isPrime(k)){
            break;
        }
    }
    this.publicKey = [k,n].reduce(function(a, b){ 
        return parseFloat(a+"."+b); 
    });

    // Cálculo de la clave privada
    for(var j = 2; j < z; j++){
        if(k * j % z == 1){
            break;
        }
    }
    this.privateKey = j;

    // Creación de la tabla de códigos
    this.codes = RSA.createCodes(n);

}

// Inicializamos la propiedad de clave pública
RSA.publicKey = -1;

// Inicializamos la propiedad de clave privada
RSA.privateKey = -1;

RSA.createCodes = function(n){
    var arr = [];

    // Tomamos los caracteres ASCII desde el carácter espacio
    for(var x = 32; x < 256; x++){
        arr[x-32] = String.fromCharCode(x);
    }

    // Rellenamos con caracteres Unicode 
    for(var x = arr.length; x < n; x++){
        arr[x] = String.fromCharCode(1000+x);
    }

    // La desordenamos de forma aleatoria 
    return arr.sort(function() {return Math.random() - 0.5});
}

RSA.prototype.assignedCodes = function(c){
    var arr = this.codes;
    
    for(var x = 0; x < arr.length; x++){
        if(arr[x] == c) return x;
    }
}

RSA.prototype.encrypt = function(msg){
    var newMsg = "";
    var e = this.publicKey.toString().split(".")[0];
    var n = this.publicKey.toString().split(".")[1];

    for(var x = 0; x < msg.length; x++){
        // Recuperamos el código del carácter solicitado
        var c = this.assignedCodes(msg[x]);

        // Ciframos
        var v = bigInt(c).pow(e).mod(n).toJSNumber();

        // Devolvemos el carácter que se corresponde 
        // con el nuevo valor
        newMsg += this.codes[v % this.codes.length];
    }

    return newMsg;
}

RSA.prototype.decrypt = function(msg){
    var newMsg = "";

    var n =  this.publicKey.toString().split(".")[1]; //253
    var d =  this.privateKey; // 147
   
    for(var x = 0; x < msg.length; x++){
        // Recuperamos el código del carácter codificado
        var c = this.assignedCodes(msg[x]);

        // Desciframos
        var v = bigInt(c).pow(d).mod(n).toJSNumber();

        // Devolvemos el carácter que se corresponde 
        // con el nuevo valor
        newMsg += this.codes[v % this.codes.length];
    }
    
    return newMsg;
}


