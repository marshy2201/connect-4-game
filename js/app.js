let game = new Game();

/** 
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
const beginGame = document.getElementById('begin-game');

beginGame.addEventListener('click', function() {
  game.startGame();
});

/** 
 * Listen for keyboard presses
 */
document.addEventListener('keydown', function(event) {
  game.handleKeyDown(event);
});

/**
 * Listen for click on `#reset-game` and call reset game on game object
 */
 const resetGame = document.getElementById('reset-game');
 resetGame.addEventListener('click', () => game.resetGame());

 /**
  * Listen for click `#next-game` and call next game on game object 
  */
 const nextGame = document.getElementById('next-game');
 nextGame.addEventListener('click', () => game.nextGame());