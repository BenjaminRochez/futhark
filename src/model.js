import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import vertex from './shaders/vertexShader.glsl';
import fragment from './shaders/fragmentShader.glsl';

class Model {
    constructor(obj) {
        
    }

    init() {
        console.log("Init: " + this.name);
    }

    add() {
        console.log("Added: " + this.name);
    }
}
 
export default Model;
