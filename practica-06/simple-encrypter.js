Number.prototype.leftPad = function(w){
    var n1 = Array.from(this + "");

    if(w - n1.length <=0) return this;
    else return new Array(w-n1.length).fill(0).concat(n1).join("");
}

String.prototype.leftPad = function(len) {
    var str = this;
    while (str.length < len) str = "0" + str;
    
    return str;
}

String.prototype.encrypt = function(){
    var strDec = "", strHex = "", result = "";

    for(var x = 0; x < this.length; x++){
        var v = this[x].charCodeAt();
        v = v.leftPad(3);

        strDec += v;
    }

    for(var x = 0; x < strDec.length; x += 3){
        var v = strDec.substr(x, 3);
        v = parseInt(v).toString(16).leftPad(2);

        strHex += v;
    }
    
    for(var x = 0; x < strHex.length; x += 4){
        var v = strHex.substr(x, 4).leftPad(4);
        v = String.fromCodePoint(parseInt("0x" + v, 16))

        result += v;
    }

    return result
}

String.prototype.decrypt = function(){
    var strHex = "", res = "";

    for(var x = 0; x < this.length; x++){
        strHex += this[x].charCodeAt().toString(16);
    }

    for(var x = 0; x < strHex.length; x += 2){
        res += String.fromCharCode(parseInt(strHex.substr(x, 2), 16));
    }

    return res;
}