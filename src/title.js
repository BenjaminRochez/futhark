import * as THREE from 'three';
import gsap from 'gsap';

class Title {
    constructor(object) {
        console.log(object);
        this.name = object.name;
        this.res = 221 / 46 * .3;
        this.scene = object.scene
        this.texture = object.texture
        this.isActive = false
        this.placeOnLoad = object.placeOnLoad
        this.plane = null;

        this.init();
        if (this.placeOnLoad) {
            this.add()
        }
    }

    init() {
        console.log('Init img: ' + this.name);


        const geometry = new THREE.PlaneGeometry(this.res, 0.3, 1);
        const material = new THREE.MeshBasicMaterial({ 
            transparent: true, 
            map: this.texture, 
            side: THREE.FrontSide, 
            depthTest: false, 
            fog: false
        });
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.position.y -= 1.5;
    }

    add() {
        this.scene.add(this.plane);
    }

    remove() {
        this.scene.remove(this.plane)
        this.isActive = false
    }
}

export default Title;