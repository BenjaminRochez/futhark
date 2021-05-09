import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import Model from './model.js';
import Title from './title.js';
import Juventus from './juventus.js';
import starsVertex from './shaders/stars/vertexShader.glsl';
import starsFragment from './shaders/stars/fragmentShader.glsl';
import modelsData from './modelsData.js';
import Stats from 'stats.js';
import * as dat from 'dat.gui'
import Hammer from 'hammerjs';
import Splitting from 'splitting';
import "splitting/dist/splitting.css";


/*------------------------------
Loading Manager
------------------------------*/
let loaded = false;
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log('loading started')
}
loadingManager.onLoad = () => {
    //console.log('loading finished')
    scene.add(stars)
    gsap.fromTo(_backgroundIntro.scale, {
        y: 1,
        x: 1
    }, {
        y: 3,
        x: 3,
        duration: 3,
        ease: 'power3.out'
    })

    for (const title in myTitles) {
        myTitles[title] = new Title(myTitles[title]);
    }
    loaded = true;
    window.addEventListener('mousemove', onMouseMove);
    animate();

}
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log('loading progressing ', (itemsLoaded / itemsTotal * 100) + '%');
}
loadingManager.onError = () => {
    console.log('loading error')
}


const textureLoader = new THREE.TextureLoader(loadingManager);
const backgroundTexture = textureLoader.load('./img/bg3d_sub.jpg')
const _bgIntroMap = textureLoader.load("./img/bg3d_intro.png");

/*------------------------------
Titles
------------------------------*/
let myTitles = [];
modelsData.forEach(i => {
    myTitles.push(i);
})
for (const t in myTitles) {
    myTitles[t].texture = textureLoader.load(myTitles[t].img);
    myTitles[t].scene = scene;
}

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
scene.background = backgroundTexture;
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 5;
camera.position.y = 0;



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


/*------------------------------
Helpers 
------------------------------*/
// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// gridHelper.visible = false;
// axesHelper.visible = false;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    starsMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);


    if (myObjs[currActiveModel]) {

        myObjs.forEach(obj => {
            obj.particlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
        })
    }
}
window.addEventListener('resize', onWindowResize, false);

/*------------------------------
MouseMove
------------------------------*/
let mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
function onMouseMove(e) {
    const x = e.clientX
    const y = e.clientY
    camera.updateProjectionMatrix();
    gsap.to(camera.rotation, {
        y: gsap.utils.mapRange(0, window.innerWidth, .05, -.05, x),
        x: gsap.utils.mapRange(0, window.innerHeight, .05, -.05, y)
    })


    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = - (y / window.innerHeight) * 2 + 1;
    myTitles[currActiveModel].plane.material.uniforms.uXDisplacement.value = mouse.x;
    myTitles[currActiveModel].plane.material.uniforms.uYDisplacement.value = mouse.y;

}


/*------------------------------
Controller
------------------------------*/
// BUTTONS
// const buttons = document.querySelectorAll('.button')
// buttons[0].addEventListener('click', () => {
//     nextModel()
// })
// buttons[1].addEventListener('click', () => {
//     previousModel()
// })

// buttons[2].addEventListener('click', () => {
//     allModels()
// })


// SCROLL
let isScrolling;
let scrollActivated = false;
let body = document.querySelector('body');
let hasScrolled = false;
let cta = document.getElementById('scroll__cta');

window.addEventListener('wheel', function (event) {
    if (event.deltaY >= 1 && !animationIsRunning() && !scrollActivated) {
        nextModel()
        removeCta()
    } else if (event.deltaY <= 1 && !animationIsRunning() && !scrollActivated) {
        previousModel()
        removeCta()
    }

    scrollActivated = true;
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
        // Run the callback
        console.log('Scrolling has stopped.');

        scrollActivated = false;
    }, 66);

}, false);

function removeCta() {
    if (!hasScrolled) {
        gsap.to(cta, {
            opacity: 0,
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => {
                cta.style.display = "none"
            }
        })
    }
}

window.addEventListener('click', () => {
    if (currentIntersect) {
        console.log(currentIntersect.object.name);
        // to the router here 
        if (!myObjs[currActiveModel].isOpen) {
            myObjs[currActiveModel].move();
        } else {
            myObjs[currActiveModel].reset();
        }
        //loadDoc();
    }
});






// MOBILE

var hammertime = new Hammer(window);
hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
hammertime.on('pan', function (ev) {
    console.log(ev);
    if (ev.direction === 16 && !animationIsRunning() && !scrollActivated) {
        previousModel()
        removeCta()
    } else if (ev.direction === 8 && !animationIsRunning() && !scrollActivated) {
        nextModel()

        removeCta()
    }
    scrollActivated = true;
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
        // Run the callback
        console.log('Scrolling has stopped.');

        scrollActivated = false;
    }, 66);
});

// FUNCTIONS
function animationIsRunning() {
    return body.classList.contains('active')
}

function nextModel() {
    if (currActiveModel === myObjs.length - 1) {
        myObjs[currActiveModel].remove()
        myTitles[currActiveModel].remove()
        currActiveModel = 0
        myObjs[currActiveModel].add()
        myTitles[currActiveModel].add()
    } else {
        myObjs[currActiveModel].remove()
        myTitles[currActiveModel].remove()
        currActiveModel += 1
        myObjs[currActiveModel].add()
        myTitles[currActiveModel].add()
    }
}

function previousModel() {
    if (currActiveModel === 0) {
        myObjs[currActiveModel].remove()
        myTitles[currActiveModel].remove()
        currActiveModel = myObjs.length - 1
        myObjs[currActiveModel].add()
        myTitles[currActiveModel].add()
    } else {
        myObjs[currActiveModel].remove()
        myTitles[currActiveModel].remove()
        currActiveModel -= 1
        myObjs[currActiveModel].add()
        myTitles[currActiveModel].add()
    }
}

function allModels() {
    allModelsActive = true;
    myObjs.forEach(obj => {
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

for (let i = 0; i < starsCount; i++) {
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
        uSize: { value: 100 },
        uTime: { value: 0 },
    },
    vertexShader: starsVertex,
    fragmentShader: starsFragment
})

const stars = new THREE.Points(starsGeometry, starsMaterial);



/*------------------------------
Introduction
------------------------------*/

var _introBgMat = new THREE.MeshBasicMaterial({ transparent: true, map: _bgIntroMap, side: THREE.FrontSide, depthTest: false, fog: false });
var _backgroundIntro = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), _introBgMat);
_backgroundIntro.scale.x = 1., _backgroundIntro.scale.y = 1.;
_backgroundIntro.position.z = 1;
scene.add(_backgroundIntro);



/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock();

/*------------------------------
Loop
------------------------------*/
let currentIntersect = null;
const animate = function () {
    const elapsedTime = clock.getElapsedTime()

    stats.begin();
    stats.end();

    raycaster.setFromCamera(mouse, camera)

    if (myObjs[currActiveModel].particles) {

        const objectsToTest = [myObjs[currActiveModel].mesh, myTitles[currActiveModel].plane];
        const intersects = raycaster.intersectObjects(objectsToTest)
        if (intersects.length) {
            if (currentIntersect === null) {
                currentIntersect = intersects[0];
                body.style.cursor = "pointer";
            }
        } else {
            if (currentIntersect) {
                currentIntersect = null;
                body.style.cursor = "initial";
            }
        }
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    starsMaterial.uniforms.uTime.value = elapsedTime;

    if (myObjs[currActiveModel].particlesMaterial && !allModelsActive) {
        myObjs[currActiveModel].particlesMaterial.uniforms.uTime.value = elapsedTime;
    } else if (allModelsActive) {
        myObjs.forEach(obj => {
            obj.particlesMaterial.uniforms.uTime.value = elapsedTime;
        })
    }
};


/*------------------------------
GUI
------------------------------*/
const gui = new dat.GUI()
// gui.add(gridHelper, 'visible').name('Grid Helper');
// gui.add(axesHelper, 'visible').name('Axes Helper');
gui.add(controls, 'enabled').name('Orbit control');
gui.close();
gui.add(starsMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('starsSize')

/*------------------------------
AJAX
------------------------------*/

// function loadDoc() {
//     let DOM = document.getElementById("content");
//     fetch("https://raw.githubusercontent.com/BenjaminRochez/futhark/master/src/json/fehu.json")
//         .then(res => res.json())
//         .then((data) => {

//             var title = document.createElement("h2");
//             var titleContent = document.createTextNode(data.content.title);
//             title.appendChild(titleContent);
//             DOM.appendChild(title);

//             var list = document.createElement("ul");

//             data.content.list.forEach(el => {
//                 var elDOM = document.createElement("li");
//                 var elContent = document.createTextNode(el);
//                 elDOM.appendChild(elContent);
//                 list.appendChild(elDOM);
//             })
//             DOM.appendChild(list);

//             data.content.paragraphs.forEach(el => {
//                 var elDOM = document.createElement("p");
//                 var elContent = document.createTextNode(el);
//                 elDOM.appendChild(elContent);
                
//                 DOM.appendChild(elDOM); 
//             })

//             DOM.setAttribute("data-splitting", 'lines');
//             Splitting();
//         })
// }

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.autoplay = true;
audioLoader.load( './sounds/inwardness.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

let soundIcon = document.getElementById('sound');
soundIcon.addEventListener('click', function(){
    if(soundIcon.classList.contains('disabled')){
        sound.play();
        soundIcon.classList.remove('disabled')
    }else{
        sound.stop();
        soundIcon.classList.add('disabled')
    }
})
