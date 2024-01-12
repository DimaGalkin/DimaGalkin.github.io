import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

// global vars
import { scene, camera } from "/warehouse/Game.js";

class Gun {
    constructor(state, listener) {
        this.game = state;

        this.bullets = 15;

        this.gunModel = null;
        this.gunMixer = null;

        this.animationModels = {
            shoot: null,
            reload: null,
            walk: null,
            sprint: null,
            prev: null
        };

        this.animationActions = {
            shooting: false,
            shoot: false,
            reload: false,
            walk: true,
            sprint: false
        };

        this.sounds = {
            shoot: null,
            reload: null,
            background: null,
            walking: null
        };

        this.raycaster = new THREE.Raycaster();

        this.init(listener);
    }

    updateState(position, rotation) {
        let direction = new THREE.Vector3(0, 0, 0);
        camera.getWorldDirection(direction);

        if (this.gunModel == null) return;

        this.gunModel.rotation.set(-rotation.x, rotation.y + Math.PI, rotation.z);

        this.gunModel.position.set(
            position.x + direction.x * 0.1,
            position.y - 0.175 + direction.y * 0.1,
            position.z
        );
    }

    shoot() {
        this.animationActions.shooting = true;

        let direction = new THREE.Vector3(0, 0, 0);
        camera.getWorldDirection(direction);

        let origin = new THREE.Vector3(0, 0, 0);
        camera.getWorldPosition(origin);

        this.raycaster.set(origin, direction);

        this.game.hitlist.forEach(enemy => {
            const intersects = this.raycaster.intersectObject(enemy, true);

            if (intersects.length > 0) {
                // const geometry = new THREE.SphereGeometry(0.01, 32, 16);
                // const material = new THREE.MeshBasicMaterial({
                //     color: 0xffff00
                // });
                // const sphere = new THREE.Mesh(geometry, material);
                // sphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                // scene.add(sphere);

                this.game.enemy.registerHit(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            }
        });

        // recoil
        let rand = Math.random() * (0.08 - 0.05) + 0.05;
        let newRot = camera.rotation.x + rand;
        newRot = Math.min(newRot, 0.32);
        camera.rotation.x = newRot;
    }

    animFinished(name) {
        if (name == 'Armature|FN_Shot') {
            --this.bullets;
            this.animationActions.shoot = false;
            this.animationActions.shooting = false;
            this.animationModels.shoot.stop();
            this.animationModels.walk.play();
        } else if (name == 'Armature|FN_Reload' || name == 'Armature|FN_ReloadFull') {
            this.bullets = 15;
            this.animationActions.reload = false;
            this.animationModels.reload.stop();
            this.sounds.reload.stop();
        }

        if (this.animationModels.prev != null) this.animationModels.prev.play();
    }

    init(listener) {
        const loader = new GLTFLoader();

        loader.load( '/warehouse/fn402/scene.gltf',  gltf => {
            this.gunModel = gltf.scene;

            this.gunModel.position.set(0.05, -0.175, 0);
            this.gunModel.rotation.order = "YXZ";
            this.gunModel.rotation.set(0, Math.PI + camera.rotation.y, 0);

            scene.add( this.gunModel );
            
            this.gunMixer = new THREE.AnimationMixer( this.gunModel );

            this.gunMixer.addEventListener( 'finished', e => {
                this.animFinished(e.action._clip.name);
            });

            this.animationModels.walk =  this.gunMixer.clipAction( gltf.animations[ 0 ] );
            this.animationModels.sprint =  this.gunMixer.clipAction( gltf.animations[ 1 ] );
            this.animationModels.shoot =  this.gunMixer.clipAction( gltf.animations[ 2 ] );
            this.animationModels.shoot.speed = 2;
            this.animationModels.reload =  this.gunMixer.clipAction( gltf.animations[ 4 ] );

            this.animationModels.shoot.loop = THREE.LoopOnce;
            this.animationModels.reload.loop = THREE.LoopOnce;

            this.gunModel.add( this.sounds.shoot );

            this.sounds.shoot = new THREE.Audio( listener );
            this.sounds.shoot.setVolume( 3 );

            this.sounds.reload = new THREE.Audio( listener );
            this.sounds.reload.setVolume( 2 );
            let ratioToAnim = this.animationModels.reload._clip.duration / 3.9009791666666667;
            this.sounds.reload.setPlaybackRate( ratioToAnim );
            this.sounds.reload.detune = 1000;

            this.sounds.background = new THREE.Audio( listener );
            this.sounds.background.setVolume( 0.35 );

            this.sounds.walking = new THREE.Audio( listener );
            this.sounds.walking.setVolume( 0.5 );
            this.sounds.walking.setPlaybackRate( 0.5 );

            const audioLoader = new THREE.AudioLoader();
            audioLoader.load( 'sfx/shot.mp3', buffer => {
                this.sounds.shoot.setBuffer( buffer );
            });

            audioLoader.load( 'sfx/reload.mp3', buffer => {
                this.sounds.reload.setBuffer( buffer );
            });

            audioLoader.load( 'sfx/background_noise.mp3', buffer => {
                this.sounds.background.setBuffer( buffer );
                this.sounds.background.setLoop( true );
                this.sounds.background.play();
            });

            audioLoader.load( 'sfx/walk.mp3', buffer => {
                this.sounds.walking.setBuffer( buffer );
                this.sounds.walking.setLoop( true );
            });

        }, null, null );
    }

    animate(walk, sprint) {
        for (const [key, value] of Object.entries(this.animationActions)) {
            if (value == null) return;
        }

        if (walk || sprint) {
            this.animationModels.prev = this.animationModels.walk;
        } else {
            this.animationModels.prev = null;
        }

        if (this.animationActions.shoot && this.bullets > 0 && !this.animationActions.shooting) {
            if (this.animationModels.prev != null) {
                this.animationModels.prev.stop();
                this.animationModels.prev = null;
            }

            this.sounds.shoot.isPlaying = false;
            this.sounds.shoot.play();
            this.animationModels.shoot.play();
            this.shoot();
        } else if (this.animationActions.reload) {
            if (this.animationModels.prev != null) {
                this.animationModels.prev.stop();
                this.animationModels.prev = null;
            }

            this.animationActions.reload = false;
            if (!this.sounds.reload.isPlaying) {
                this.sounds.reload.play();
            }
            this.animationModels.reload.play();
        } else if (sprint && this.animationModels.prev != null) {
            this.sounds.walking.play();
            this.animationModels.sprint.play();
        } else if (walk && this.animationModels.prev != null) {
            this.sounds.walking.play();
            this.animationModels.walk.play();
        } else {
            if (this.sounds.walking.isPlaying) {
                this.sounds.walking.stop();
            }

            this.animationModels.walk.stop();
            this.animationModels.sprint.stop();
        }
    }
};

export default Gun;
