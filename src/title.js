import * as THREE from 'three';
import vertex from './shaders/titles/vertexShader.glsl';
import fragment from './shaders/titles/fragmentShader.glsl';
import gsap from 'gsap';

class Title {
    constructor(object) {
        //console.log(object);
        this.name = object.name;
        this.res = 221 / 46 * .3;
        this.scene = object.scene
        this.texture = object.texture
        this.isActive = false
        this.placeOnLoad = object.placeOnLoad
        this.plane = null;
        this.duration = 1;

        this.init();
        if (this.placeOnLoad) {
            this.add()
        }
    }

    init() {
        //console.log('Init img: ' + this.name);
        const geometry = new THREE.PlaneBufferGeometry(this.res, 0.3, 1);
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            uniforms: {
                uImage: { value: 0 },
                uXDisplacement: {value: 0.3},
                uYDisplacement: {value: 0.3},
                uScale: {value: 0.5},
                uOpacity: {value: 0}
            },
            side: THREE.DoubleSide,
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true
        });

        this.texture.needsUpdate = true;
        let material = this.material.clone();
        material.uniforms.uImage.value = this.texture;
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.name = this.name;
        this.plane.position.y -= 1.;
    }

    add() {
        this.scene.add(this.plane);
        gsap.to(this.plane.material.uniforms.uOpacity, {
            value: 1,
            duration: this.duration,
            delay: .3,
            ease: 'power3.out'
        })
        gsap.to(this.plane.material.uniforms.uScale, {
            value: 1,
            duration: this.duration,
            delay: .3,
            ease: 'power3.out'
        })
    }

    remove() {
        gsap.to(this.plane.material.uniforms.uOpacity, {
            value: 0,
            duration: this.duration,
            ease: 'power3.out',
            onComplete: () => {
                this.scene.remove(this.plane)
                this.isActive = false
            }
        })
        gsap.to(this.plane.material.uniforms.uScale, {
            value: 0.5, 
            duration: this.duration,
            ease: 'power3.out'
        })
    }
}

export default Title;