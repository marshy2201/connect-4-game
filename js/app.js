let game = new Game();

/** 
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
const beginGame = document.getElementById('begin-game');

beginGame.addEventListener('click', function() {
  game.startGame();

  document.getElementById('begin-game-wrapper').style.display = 'none';
  $('#game-scene').animate({ opacity: 1 }, 1000, () => {
    document.getElementById('reset-game').style.display = "block";
  });

  document.querySelector('#player-1 .name').textContent = game.players[0].name;
  document.querySelector('#player-2 .name').textContent = game.players[1].name;
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