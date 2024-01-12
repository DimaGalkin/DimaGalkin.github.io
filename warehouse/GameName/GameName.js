import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

// global vars
import { scene, camera } from "/warehouse/GameName/Game.js";

// custom modules
import Player from "./warehouse/GameName/Player.js";
import Enemy from "./warehouse/GameName/Enemy.js";

class Game {
    constructor() {
        this.clock = new THREE.Clock();

        this.level = null;
        this.hitlist = [];
        this.loadtasks = [];
        this.loaded = false;

        this.listener = new THREE.AudioListener();
        camera.add( this.listener );

        document.getElementById("loadingScreen").style.display = "flex";
        document.getElementsByTagName("canvas")[0].style.visibility = "hidden";

        this.player = new Player(this, this.listener);
        this.enemy = new Enemy(this, this.listener, new THREE.Vector3(0, -1, -5));

        this.initScene();
        this.initLights();
    }
    onSceneLoad() {
        this.loadtasks.forEach(task => {
            task();
        });

        document.getElementById("loadingScreen").style.display = "none";
        document.getElementsByTagName("canvas")[0].style.visibility = "visible";

        this.loaded = true;
    }

    addToHitlist(enemy) {
        this.hitlist.push(enemy);
    }

    removeFromHitlist(enemy) {
        this.hitlist = this.hitlist.filter(e => e != enemy);
    }

    initScene() {
        let loader = new GLTFLoader();
        loader.load( './warehouse/level/scene.gltf', ( gltf ) => {
            this.level = gltf.scene;

            this.level.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            this.level.position.set(0, -1, 0);
            scene.add( this.level );

            this.onSceneLoad();
        }, null, null );
    }

    initLights() {
        // list of overhead lights
        const lamps = [
            new THREE.Vector3(0, 3.2, -10.2),
            new THREE.Vector3(0, 3.2, -5.1),
            new THREE.Vector3(0, 3.2, 0),
            new THREE.Vector3(4.4, 2.7, 0),
            new THREE.Vector3(-4.4, 2.7, 0),
           new THREE.Vector3(0, 3.2, 5.1),
            new THREE.Vector3(0, 3.2, 10.2),
        ];
        
        // draw the overhead lights
        lamps.forEach(lamp => {
            let dirL = new THREE.DirectionalLight(0xffeeb1, 0.25);
            dirL.position.set(lamp.x, lamp.y, lamp.z);
            dirL.target.position.set(lamp.x, 0, lamp.z);
            dirL.castShadow = true;
            dirL.shadow.mapSize.width = 1024;
            dirL.shadow.mapSize.height = 1024;
            dirL.shadow.camera.near = 0.1;
            dirL.shadow.camera.far = 500;
            scene.add(dirL);
        });
        
        // flashlight effect with different intensities
        const flashlight = new THREE.SpotLight(0xffffff, 5, 0, Math.PI * 0.17);
        flashlight.position.set(0, 0, -1);
        flashlight.target.position.set(0, 0, -2);
        flashlight.castShadow = true;
        flashlight.shadow.mapSize.width = 1024;
        flashlight.shadow.mapSize.height = 1024;
        camera.add(flashlight);
        camera.add(flashlight.target);
        
        const flashlightsoft = new THREE.SpotLight(0xffffff, 4, 0, Math.PI * 0.20);
        flashlightsoft.position.set(0, 0, -1);
        flashlightsoft.target.position.set(0, 0, -2);
        flashlightsoft.castShadow = true;
        flashlightsoft.shadow.mapSize.width = 1024;
        flashlightsoft.shadow.mapSize.height = 1024;
        camera.add(flashlightsoft);
        camera.add(flashlightsoft.target);
    }

    animate(delta) {
        this.player.animate(delta);
        this.enemy.animate(delta);
    }
};

export default Game;
