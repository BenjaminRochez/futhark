import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import Model from './model.js';
import vertex from './shaders/vertexShader.glsl';
import fragment from './shaders/fragmentShader.glsl';
import modelsData from './modelsData.js';

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
Models
------------------------------*/

const myObjs = modelsData;

for (const o in myObjs) {
    myObjs[o].scene = scene
    myObjs[o] = new Model(myObjs[o]);
}
let currActiveModel = 0;

/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

/*------------------------------
Helpers 
------------------------------*/
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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
    if (myObjs[currActiveModel].particlesMaterial) {
        myObjs[currActiveModel].particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
    }
};
animate();

/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

/*------------------------------
Controller
------------------------------*/
// BUTTONS
const buttons = document.querySelectorAll('.button')
buttons[0].addEventListener('click', () => {
    nextModel()
})
buttons[1].addEventListener('click', () => {
    previousModel()
})


// SCROLL
let isScrolling;
let body = document.querySelector('body');

window.addEventListener('wheel', function (event) {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
        // Run the callback
        console.log('Scrolling has stopped.');

        if (event.deltaY > 1 && !animationIsRunning()) {
            nextModel()
        } else if (event.deltaY < 1 && !animationIsRunning()) {
            previousModel()
        }
    }, 66);

}, false);


// FUNCTIONS
function animationIsRunning() {
    return body.classList.contains('active')
}

function nextModel() {
    if (currActiveModel === myObjs.length - 1) {
        myObjs[currActiveModel].remove()
        currActiveModel = 0
        myObjs[currActiveModel].add()
    } else {
        myObjs[currActiveModel].remove()
        currActiveModel += 1
        myObjs[currActiveModel].add()
    }
}

function previousModel() {
    if (currActiveModel === 0) {
        myObjs[currActiveModel].remove()
        currActiveModel = myObjs.length - 1
        myObjs[currActiveModel].add()
    } else {
        myObjs[currActiveModel].remove()
        currActiveModel -= 1
        myObjs[currActiveModel].add()
    }
}
