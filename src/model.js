import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import vertex from './shaders/vertexShader.glsl';
import fragment from './shaders/fragmentShader.glsl';


class Model {
    constructor(obj) {
        //console.log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad
        this.color1 = obj.color1
        this.color2 = obj.color2
        this.background = obj.background
        this.duration = 1
        this.isActive = false
        this.isOpen = false;
        

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {
            //console.log("Init: " + this.name);

            /*------------------------------
            Original mesh
            ------------------------------*/
            this.mesh = response.scene.children[0]

            /*------------------------------
            Original Geometry
            ------------------------------*/
            this.geometry = this.mesh.geometry

            // WIP CIRClE
            // let angle = Math.random() * Math.PI * 2;
            // const x = Math.sin(angle) * 1.7;
            // const y = Math.cos(angle) * 1.7;

            /*-----------------------------
            Particles material
            ------------------------------*/
            this.particlesMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uColor1: { value: new THREE.Color(this.color1) },
                    uColor2: { value: new THREE.Color(this.color2) },
                    uTime: { value: 0 },
                    uScale: { value: 0 },
                    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2)},
                    // uPosX: {value: x},
                    // uPosY: {value: y}
                    uTranslationX: {value: 0}
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                alphaTest: 0.001,
                //depthTest: false,
                //depthWrite: false,
                blending: THREE.AdditiveBlending
            })
            /*------------------------------
            Particles geometry 
            - Basically, we create particles along the vertices
            ------------------------------*/
            const numParticles = 15000

            const sampler = new MeshSurfaceSampler(this.mesh).build()
            
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPosition = new Float32Array(numParticles * 3)
            const particlesRandomness = new Float32Array(numParticles * 3)

            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlesPosition.set([
                    newPosition.x,
                    newPosition.y,
                    newPosition.z,
                ], i * 3)

                particlesRandomness.set([
                    // Number from -1 to 1
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ], i * 3)
            }

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
            this.particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRandomness, 3))
            

            // Init this.particles
            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
            
            if (this.placeOnLoad) {
                this.add()
            }
        })
    }

    add() {
        this.scene.add(this.particles)


        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 1,
            duration: this.duration,
            delay: .3,
            ease: 'power3.out'
        })

        if (!this.isActive) {
            gsap.fromTo(this.particles.rotation, {
                y: Math.PI * 2,
                x: Math.PI * 2
            }, {
                y: 0,
                x: 0,
                duration: this.duration,
                ease: 'power3.out'
            })
            this.isActive = true

            // Update background color
            gsap.to('body', {
                background: this.background,
                duration: this.duration,
                ease: 'power3.in',
                className: 'active',
                onComplete: () =>{
                    document.querySelector('body').classList.remove('active')
                }
            })
        }
    }

    remove() {
        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 0,
            duration: this.duration,
            ease: 'power3.out',
            onComplete: () => {
                this.scene.remove(this.particles)
                this.isActive = false
            }
        })
         

        gsap.to(this.particles.rotation, {
            y: Math.PI * 2,
            duration: this.duration,
            ease: 'power3.out'
        })
    }

    move(){
        this.isOpen = true;
        gsap.to(this.particlesMaterial.uniforms.uTranslationX, {
            value: -2,
            duration: this.duration,
            delay: .3,
            ease: 'power3.out',
        })
        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 0.7,
            duration: this.duration / 2,
            ease: 'power3.out'
        })
        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 1,
            duration: this.duration / 2,
            delay: this.duration / 2,
            ease: 'power3.out'
        })
    }

    moveLeft(){
        gsap.to(this.particlesMaterial.uniforms.uTranslationX, {
            value: 2,
            duration: this.duration,
            delay: .4,
            ease: 'power3.out',
        })
    }

    reset(){
        gsap.to(this.particlesMaterial.uniforms.uTranslationX, {
            value: 0,
            duration: this.duration,
            delay: .3,
            ease: 'power3.out',
            onComplete: () => {
                this.isOpen = false
            }
        })
        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 0.7,
            duration: this.duration / 2,
            ease: 'power3.out'
        })
        gsap.to(this.particlesMaterial.uniforms.uScale, {
            value: 1,
            duration: this.duration / 2,
            delay: this.duration / 2,
            ease: 'power3.out'
        })
    }
}

export default Model;
