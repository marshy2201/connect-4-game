class Game {
  constructor() {
    this.board = new Board();
    this.ready = false;
  }

  /** 
   * Return active player
   * @return {object} the active player
   */
  get activePlayer() {
    return this.players.find(player => player.active);
  }

  /** 
   * Creates two player objects
   * @return  {Array}    An array of two Player objects.
   */
  createPlayers() {
    const { value: player1 } = document.getElementById('player-1-name');
    const { value: player2 } = document.getElementById('player-2-name');

    return [
      new Player(player1 ? player1 : "Player 1", 1, "#e15258", true),
      new Player(player2 ? player2 : "Player 2", 2, "#e59a13")
    ];
  }

  /** 
   * Initializes game. 
   */
  startGame() {
    this.players = this.createPlayers();
    this.board.drawHTMLBoard();
    this.activePlayer.activeToken.drawHTMLToken();
    this.ready = true;
  }

  /**
   * Branches code, depending on what key player presses
   * @param   {Object}    e - Keydown event object
   */
  handleKeyDown(e) {
    if (this.ready) {
      if (e.key === "ArrowLeft") {
        this.activePlayer.activeToken.moveLeft();
      } else if (e.key === "ArrowRight") {
        this.activePlayer.activeToken.moveRight(this.board.columns);
      } else if (e.key === "ArrowDown") {
        this.playToken();
      }
    }
  }

  /**
   * Find Space object to drop Token into, drops Token
   */
  playToken() {
    const spaces = this.board.spaces;
    const activeToken = this.activePlayer.activeToken;
    const targetColumn = spaces[activeToken.columnLocation - 1];

    const freeSpaces = targetColumn.filter(space => !space.token);

    if (freeSpaces.length) {
      game.ready = false;

      const targetSpace = freeSpaces[freeSpaces.length - 1];

      activeToken.drop(targetSpace, () => this.updateGameState(activeToken, targetSpace));
    }
  }

  /** 
   * Checks if there a winner on the board after each token drop.
   * @param   {Object}    Targeted space for dropped token.
   * @return  {boolean}   Boolean value indicating whether the game has been won (true) or not (false)
   */
  checkForWin(target) {
    const owner = target.token.owner;
    let win = false;

    // vertical
    for (let x = 0; x < this.board.columns; x++) {
      for (let y = 0; y < this.board.rows - 3; y++) {
        if (this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x][y + 1].owner === owner &&
          this.board.spaces[x][y + 2].owner === owner &&
          this.board.spaces[x][y + 3].owner === owner) {
          win = true;
        }
      }
    }

    // horizontal
    for (let x = 0; x < this.board.columns - 3; x++) {
      for (let y = 0; y < this.board.rows; y++) {
        if (this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x + 1][y].owner === owner &&
          this.board.spaces[x + 2][y].owner === owner &&
          this.board.spaces[x + 3][y].owner === owner) {
          win = true;
        }
      }
    }

    // diagonal
    for (let x = 3; x < this.board.columns; x++) {
      for (let y = 0; y < this.board.rows - 3; y++) {
        if (this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x - 1][y + 1].owner === owner &&
          this.board.spaces[x - 2][y + 2].owner === owner &&
          this.board.spaces[x - 3][y + 3].owner === owner) {
          win = true;
        }
      }
    }

    // diagonal
    for (let x = 3; x < this.board.columns; x++) {
      for (let y = 3; y < this.board.rows; y++) {
        if (this.board.spaces[x][y].owner === owner &&
          this.board.spaces[x - 1][y - 1].owner === owner &&
          this.board.spaces[x - 2][y - 2].owner === owner &&
          this.board.spaces[x - 3][y - 3].owner === owner) {
          win = true;
        }
      }
    }

    return win;
  }

  /** 
 * Switches active player. 
 */
  switchPlayers() {
    game.players.forEach(player => player.active = player.active ? false : true);

    const player1Turn = document.getElementById('player-1-turn');
    const player2Turn = document.getElementById('player-2-turn');

    if (game.players[0].active) {
      player1Turn.style.display = "block";
      player2Turn.style.display = "none";
    } else {
      player1Turn.style.display = "none";
      player2Turn.style.display = "block";
    }
  }

  /** 
   * Displays game over message.
   * @param {string} message - Game over message.      
   */
  gameOver(message) {
    const gameOver = document.getElementById('game-over');
    gameOver.textContent = message;
    gameOver.style.display = "block";
  }

  /** 
   * Updates game state after token is dropped. 
   * @param   {Object}  token  -  The token that's being dropped.
   * @param   {Object}  target -  Targeted space for dropped token.
   */
  updateGameState(token, target) {
    target.mark(token);

    if (this.checkForWin(target)) {
      this.hidePlayersTurn();
      this.gameOver(`${token.owner.name} has won!`);
    } else {
      this.switchPlayers();

      if (this.activePlayer.checkTokens()) {
        this.activePlayer.activeToken.drawHTMLToken();
        this.ready = true;
      } else {
        this.hidePlayersTurn();
        this.gameOver(`All players have no more tokens`);
      }
    }
  }

  /** 
   * Hide players turn message 
   */
  hidePlayersTurn() {
    const playerTurns = document.querySelectorAll('.player-turn');

    for (const turn of playerTurns) {
      turn.style.display = "none";
    }
  }
}