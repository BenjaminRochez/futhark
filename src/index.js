console.log('hello world');
import Model from "./model.js";

const myObjs = [
  { name: "super" },
  { name: "anothersuper" },
];

for (const o in myObjs) {
  myObjs[o] = new Model(myObjs[o]);
}

myObjs[1].add();

console.log(myObjs);

