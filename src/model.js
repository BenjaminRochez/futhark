import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import vertex from './shaders/vertexShader.glsl';
import fragment from './shaders/fragmentShader.glsl';


class Model {
    constructor(obj) {
        console.log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {
            console.log("Init: " + this.name);

            /*------------------------------
            Original mesh
            ------------------------------*/
            this.mesh = response.scene.children[0]

            /*------------------------------
            Original Geometry
            ------------------------------*/
            this.material = new THREE.MeshBasicMaterial({
                color: 'green',
                wireframe: true
            })
            this.mesh.material = this.material
            this.geometry = this.mesh.geometry
            
            let cube = new THREE.Mesh(this.geometry, this.material)
            this.scene.add(cube)
        })
        
    }

    add() {
        console.log("Added: " + this.name);
    }
}

export default Model;
