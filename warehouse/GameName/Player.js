import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";

// global vars
import { scene, camera, renderer } from "./Game.js";

// custom modules
import Gun from "/warehouse/Gun.js";
import FPSControls from "/warehouse/FPSController.js";

class Player {
    constructor(state, listener) {
        this.listener = listener;
        this.game = state;

        this.mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            prevMouseX: 0,
            prevMouseY: 0
        };

        this.hitBox = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 1, 10),
            new THREE.MeshBasicMaterial({ wireframe: true })
        );

        this.health = 3;

        this.gun = new Gun(state, this.listener);
        this.playerController = new FPSControls(state);

        scene.add(this.playerController.controls.getObject());
    }

    collider() {
        let colls = false;

        if (this.game == null) return false;
        if (this.game.level == null) return false;

        let playerBB = new THREE.Box3().setFromObject(this.hitBox);

        this.game.level.children.forEach(child => {
            if (child == null) return;

            if (child.userData.name != "FLOOR" && child.userData.name != "OUTER_WALL" && child.userData.name != "MARKINGS" && child.userData.name != "OUTER_WALL.001" && child.userData.name != "OUTER_WALL.002") {
                let enemyBB = new THREE.Box3().setFromObject(child);

                enemyBB.position = new THREE.Vector3(child.position.x, child.position.y, child.position.z);
                enemyBB.rotation = new THREE.Vector3(child.rotation.x, child.rotation.y, child.rotation.z);

                if(playerBB.intersectsBox(enemyBB)) {
                    colls = true;
                }
            }
        });

        // this.game.enemies.forEach(enemy => {
        // let enemyBB = new THREE.Box3().setFromObject(this.game.enemy);
        // enemyBB.position = new THREE.Vector3(this.game.enemy.position.x, this.game.enemy.position.y, this.game.enemy.position.z);
        // enemyBB.rotation = new THREE.Vector3(this.game.enemy.rotation.x, this.game.enemy.rotation.y, this.game.enemy.rotation.z);

        // if(playerBB.intersectsBox(enemyBB)) {
        //     colls = true;
        // }
        // });

        return colls;
    }

    moveHitBox() {
        this.hitBox.position.set(
            this.playerController.controls.getObject().position.x,
            this.playerController.controls.getObject().position.y,
            this.playerController.controls.getObject().position.z
        );
    }

    shotAt(hit) {
        if (hit) {
            this.health -= 1;
            if (this.health <= 0) {
                this.game.gameOver();
            }
        }

        console.log("Shot: " + hit);
    }

    animate(delta) {
        // original animation speed too low
        if (this.playerController.fire) delta *= 1.5;
        if ( this.gun.gunMixer ) this.gun.gunMixer.update( delta ); // advance gun animation

        // misc. based on movement
        this.playerController.updateCamera();
        this.moveHitBox();

        if (this.collider()) {
            this.playerController.revert();
        } else {
            this.gun.updateState(camera.position, camera.rotation);
        }
    
        // tell gun what state it's in
        this.gun.animationActions.shoot = this.playerController.fire;
        this.gun.animationActions.reload = this.playerController.reloading;
    
        // tell gun to animate itself
        this.gun.animate(this.playerController.walk, this.playerController.sprint);
    
        // update renderer
        renderer.render(scene, camera);
    }
};

export default Player;
