const game = new Game();

/** 
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
const beginGame = document.getElementById('begin-game');

beginGame.addEventListener('click', function() {
  game.startGame();

  document.getElementById('begin-game-wrapper').style.display = 'none';
  $('#game-scene').animate({ opacity: 1 }, 1500);

  document.querySelector('#player-1 .name').textContent = game.players[0].name;
  document.querySelector('#player-2 .name').textContent = game.players[1].name;
});

/** 
 * Listen for keyboard presses
 */
document.addEventListener('keydown', function(event) {
  game.handleKeyDown(event);
});