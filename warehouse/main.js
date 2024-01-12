import Game from "./GameName/GameName.js";

const game = new Game();

// pointer lock controls give lock
document.onclick = () => game.player.playerController.controls.lock();

// called every frame
function animate () {
    requestAnimationFrame( animate );

    var delta = game.clock.getDelta();

    // animate children
    game.animate(delta);
}

animate()