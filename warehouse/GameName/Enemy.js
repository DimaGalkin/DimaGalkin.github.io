import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/FBXLoader.js";

// global vars
import { scene } from "/warehouse/Game.js";

class Enemy {
    constructor(state, listener, position) {
        this.game = state;
        this.model = null;

        this.health = 1;
        this.thresholdDistance = 5;
        this.hitPlayer = 1;
        this.position = position;

        this.animations = {
            idle: null,
            walk: null,
            shoot: null,
            reload: null,
            dieBody: null,
            dieHead: null,
            hit: null
        };

        this.sfx = {
            shoot: null,
            die: null
        };

        this.mixer = null;

        this.init(listener);
    }

    init(listener) {
        let loader = new FBXLoader();
        loader.load( '/warehouse/swat/swat.fbx', ( gltf ) => {
            this.model = gltf;

            this.model.position.set(this.position.x, this.position.y, this.position.z);
            this.model.scale.set(0.01, 0.01, 0.01);

            this.mixer = new THREE.AnimationMixer( this.model );

            this.animations.idle = this.mixer.clipAction( gltf.animations[ 4 ] );
            this.animations.idle.setLoop(THREE.LoopRepeat);
            this.animations.idle.play();

            this.animations.dieHead = this.mixer.clipAction( gltf.animations[ 5 ] );
            this.animations.dieHead.setLoop(THREE.LoopOnce);
            this.animations.dieHead.clampWhenFinished = true;
            this.animations.dieHead.timeScale = 2.25;

            this.animations.dieBody = this.mixer.clipAction( gltf.animations[ 5 ] );
            this.animations.dieBody.setLoop(THREE.LoopOnce);
            this.animations.dieBody.clampWhenFinished = true;
            this.animations.dieBody.timeScale = 2.25;

            this.animations.hit = this.mixer.clipAction( gltf.animations[ 4 ] );
            this.animations.hit.setLoop(THREE.LoopOnce);

            this.animations.shoot = this.mixer.clipAction( gltf.animations[ 3 ] );

            this.animations.walk = this.mixer.clipAction( gltf.animations[ 12 ] );
            this.animations.walk.timeScale = 0.25;

            this.model.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            scene.add( this.model );

            this.game.addToHitlist(this.model);
        }, null, null );

        this.sfx.die = new THREE.Audio( listener );
        this.sfx.die.setVolume( 5 );
        this.sfx.die.setPlaybackRate( 1.75 );

        let sfxLoader = new THREE.AudioLoader();
        sfxLoader.load( 'sfx/fall.mp3', buffer => {
            this.sfx.die.setBuffer( buffer );
        });
    }

    die(headshot) {
        this.mixer.stopAllAction();
        this.sfx.die.play();
        this.animations.dieHead.play();
    }

    registerHit(x, y, z) {
        if (this.health < 0) return;
        let headshot = y > 0.5;
        let damage = headshot ? 2 : 1;

        this.health -= damage;

        if (this.health == 0) {
            this.die(headshot);
        } else {
            this.animations.hit.play();
        }
    }

    animate(delta) {
        if (this.mixer == null) return;
        this.mixer.update(delta);
    }
};

export default Enemy;
