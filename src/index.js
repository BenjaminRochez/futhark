import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import Model from './model.js';
import vertex from './shaders/vertexShader.glsl';
import fragment from './shaders/fragmentShader.glsl';

// const myObjs = [
//   { name: "super" },
//   { name: "anothersuper" },
// ];

// for (const o in myObjs) {
//   myObjs[o] = new Model(myObjs[o]);
// }

// myObjs[1].add();

// console.log(myObjs);

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


/*------------------------------
Scene & camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;

/*------------------------------
Mesh
------------------------------*/
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment
});
const cube = new THREE.Mesh(geometry, material);
scene.add( cube );

/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = true;


/*------------------------------
Helpers 
------------------------------*/
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock();

/*------------------------------
Loop
------------------------------*/

const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();

/*------------------------------s
Resize
------------------------------*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onWindowResize, false);