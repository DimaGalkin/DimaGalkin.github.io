import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/PointerLockControls.js";

// global vars
import { camera } from "./warehouse/GameName/Game.js";

class FPSControls {
    constructor(state) {
        this.keyMap = {};

        this.game = state;

        this.speed = 0.02;
        this.reloading = false;

        this.sprint = false;
        this.walk = false;

        this.controls = new PointerLockControls( camera, document.body );
        this.controls.minPolarAngle = 1.25;
        this.controls.maxPolarAngle = 2;

        document.addEventListener('keydown', this.handleKey.bind(this));
        document.addEventListener('keyup', this.handleKey.bind(this));

        document.addEventListener('mousedown', this.handleClick.bind(this));
        document.addEventListener('mouseup', this.handleClick.bind(this));
    }

    handleKey(event) {
        if (this.game.loaded)
            this.keyMap[event.code] = event.type == 'keydown';
    }
    
    handleClick(event) {
        if (this.game.loaded)
            this.fire = event.type == 'mousedown';
    }

    revert() {
        if (!this.keyMap['KeyW']) {
            this.controls.moveForward(this.speed);
        }
        if (!this.keyMap['KeyS']) {
            this.controls.moveForward(-this.speed);
        }
        if (!this.keyMap['KeyA']) {
            this.controls.moveRight(-this.speed);
        }
        if (!this.keyMap['KeyD']) {
            this.controls.moveRight(this.speed);
        }
    }

    updateCamera() {
        if (this.keyMap['KeyW']) {
            this.walk = true;
            this.controls.moveForward(this.speed);
        }

        if (this.keyMap['KeyS']) {
            this.walk = true;
            this.controls.moveForward(-this.speed);
        }

        if (this.keyMap['KeyA']) {
            this.walk = true;
            this.controls.moveRight(-this.speed);
        }

        if (this.keyMap['KeyD']) {
            this.walk = true;
            this.controls.moveRight(this.speed);
        }

        if (this.keyMap['KeyR']) {
            this.reloading = true;
        } else {
            this.reloading = false;
        }

        if (!this.keyMap['KeyW'] && !this.keyMap['KeyS'] && !this.keyMap['KeyA'] && !this.keyMap['KeyD']) {
            this.walk = false;
        }
    }
};

export default FPSControls;
