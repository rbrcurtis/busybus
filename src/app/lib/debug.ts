
class Debug {

  debug(key, ...args) {
    key = String(key);
    
    if (key === this.currentDebugKey()) {
      console.log.apply(console, [`[${key}]`].concat(args));
    }
  }

  currentDebugKey():string {
    let current:any = window.location.href.match(/debug=([^&]+)/)
    if (current)current = current[1];
    return current || "";
  }
  
}

let instance = new Debug();

let debug = instance.debug.bind(instance);
let currentDebugKey = instance.currentDebugKey;

export {debug, currentDebugKey};