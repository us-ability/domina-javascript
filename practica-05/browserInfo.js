function browserInfo(){
    var r = navigator.userAgent;
    var t = t = r.match(/(chrome|firefox(?=\/))\/?\s*(\d+)/i) || [];
    var prefixes = ['-webkit-', '-moz-'];
  
    if(t.length == 0) return null;
  
    this.name = t[1];
    this.version = t[2];
    this.cookies = navigator.cookieEnabled ? "Sí" : "No";
    this.prefix = t[1].toLowerCase() == 'chrome' 
                  ? prefixes[0] 
                  : prefixes[1];

    return this;
}
  