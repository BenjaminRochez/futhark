class Model {
    constructor(obj) {
      console.log(obj);
      this.name = obj.name;
  
      this.init();
    }
  
    init() {
      console.log("Init: " + this.name);
    }
  
    add() {
      console.log("Added: " + this.name);
    }
  }
  
  export default Model;
  