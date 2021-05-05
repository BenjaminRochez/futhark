import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import Model from './model.js';
import starsVertex from './shaders/stars/vertexShader.glsl';
import starsFragment from './shaders/stars/fragmentShader.glsl';
import modelsData from './modelsData.js';
import Stats from 'stats.js';
import * as dat from 'dat.gui'


/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
let allModelsActive = false;

/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;
console.log(controls)


/*------------------------------
Helpers 
------------------------------*/
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stars.uniform.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
}
window.addEventListener('resize', onWindowResize, false);

/*------------------------------
MouseMove
------------------------------*/
function onMouseMove(e) {
    const x = e.clientX
    const y = e.clientY

    gsap.to(scene.rotation, {
        y: gsap.utils.mapRange(0, window.innerWidth, .2, -.2, x),
        x: gsap.utils.mapRange(0, window.innerHeight, .2, -.2, y)
    })
}
window.addEventListener('mousemove', onMouseMove)

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

buttons[2].addEventListener('click', () => {
    allModels()
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
        if (event.deltaY >= 1 && !animationIsRunning()) {
            nextModel()
        } else if (event.deltaY <= 1 && !animationIsRunning()) {
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

function allModels(){
    allModelsActive = true;
    myObjs.forEach(obj =>{
        obj.add()
    });
}

/*------------------------------
Stars
------------------------------*/
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 200;
const positionArray = new Float32Array(starsCount * 3);
const scaleArray = new Float32Array(starsCount)

for(let i = 0; i<starsCount; i++){
    positionArray[i * 3 + 0] = (Math.random() * 4 - 2) * 2.5 
    positionArray[i * 3 + 1] = (Math.random() * 4 - 2) * 2.5
    positionArray[i * 3 + 2] = (Math.random() * 4 - 2) * 2.5
    scaleArray[i] = Math.random()
}
starsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

const starsMaterial = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,

    uniforms:
    {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: {value: 100},
        uTime: { value: 0 },
    },
    vertexShader: starsVertex,
    fragmentShader: starsFragment
})

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars)

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock();

/*------------------------------
Loop
------------------------------*/

const animate = function () {
    const elapsedTime = clock.getElapsedTime()

    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    starsMaterial.uniforms.uTime.value = elapsedTime;

    if (myObjs[currActiveModel].particlesMaterial && !allModelsActive) {
        myObjs[currActiveModel].particlesMaterial.uniforms.uTime.value = elapsedTime;
    }else if(allModelsActive){
        myObjs.forEach(obj =>{
            obj.particlesMaterial.uniforms.uTime.value = elapsedTime;
        })
    }
};
animate();

/*------------------------------
GUI
------------------------------*/
const gui = new dat.GUI()
gui.add(gridHelper, 'visible').name('Grid Helper');
gui.add(axesHelper, 'visible').name('Axes Helper');
gui.add(controls, 'enabled').name('Orbit control');
gui.add(starsMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('starsSize')
