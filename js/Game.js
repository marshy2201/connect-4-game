class Game {
  constructor() {
    this.board = new Board();
    this.ready = false;
    this.bestOf = 3;
  }

  /** 
   * Return active player
   * @return {object} the active player
   */
  get activePlayer() {
    return this.players.find(player => player.active);
  }

  /**
   * Returns boolean if the active player has won best of games
   * @return {Boolean}
   */
  get activePlayerWonBestOf() {
    return (this.bestOf / this.activePlayer.wins) < 2;
  }

  /**
   * Returns boolean if the players have drawn
   * @return {Boolean}
   */
  get gameDraw() {
    const players = this.players.filter(player => player.wins === (this.bestOf / 2));

    return players.length === 2 ? true : false;
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

    if (document.getElementById('best-out-of').value) {
      this.bestOf = parseInt(document.getElementById('best-out-of').value);
    }
    
    this.board.drawHTMLBoard();
    this.activePlayer.activeToken.drawHTMLToken();

    document.getElementById('begin-game-wrapper').style.display = 'none';
    document.querySelector('.best-out-of span').textContent = this.bestOf;
    document.querySelector('.table .best-out-of').style.opacity = 1;
    document.querySelector('.arrow-buttons').style.opacity = 1;

    $('#game-scene').animate({ opacity: 1 }, 1000, () => {
      document.getElementById('reset-game').style.display = "block";
    });

    document.querySelector('#player-1 .name').textContent = game.players[0].name;
    document.querySelector('#player-2 .name').textContent = game.players[1].name;

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
   * Moves token depending on which arrow was clicked
   */
  handleArrowLeft() {
    if (this.ready) {
      this.activePlayer.activeToken.moveLeft();
    }
  }
  handleArrowRight() {
    if (this.ready) {
      this.activePlayer.activeToken.moveRight(this.board.columns);
    }
  }
  handleArrowDown() {
    if (this.ready) {
      this.playToken();
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
      player1Turn.style.opacity = 1;
      player2Turn.style.opacity = 0;
    } else {
      player1Turn.style.opacity = 0;
      player2Turn.style.opacity = 1;
    }
  }

  /** 
   * Displays game over message.
   * Disable Arrow Buttons
   * @param {string} message - Game over message.      
   */
  gameOver(message) {
    const gameOver = document.getElementById('game-over');
    gameOver.textContent = message;
    gameOver.style.display = "block";

    document.querySelectorAll('.arrow-button').forEach(button => button.disabled = true);
  }

  /** 
   * Updates game state after token is dropped. 
   * @param   {Object}  token  -  The token that's being dropped.
   * @param   {Object}  target -  Targeted space for dropped token.
   */
  updateGameState(token, target) {
    target.mark(token);

    if (this.checkForWin(target)) {
      this.increaseActivePlayerWins(token.owner);
      this.hidePlayersTurn();
      
      if (this.activePlayerWonBestOf) {
        this.gameOver(`${this.activePlayer.name} has won best of ${this.bestOf}!`)
      } else if (this.gameDraw) {
        this.gameOver(`Its a draw!`);
      } else {
        this.gameOver(`${token.owner.name} has won!`);
        document.getElementById('next-game').style.display = "block";
      }
    } else {
      this.switchPlayers();

      if (this.activePlayer.checkTokens()) {
        this.activePlayer.activeToken.drawHTMLToken();
        this.ready = true;
      } else {
        this.hidePlayersTurn();
        this.gameOver(`All players have no more tokens`);

        document.getElementById('next-game').style.display = "block";
      }
    }
  }

  /** 
   * Hide players turn message 
   */
  hidePlayersTurn() {
    const playerTurns = document.querySelectorAll('.player-turn');

    for (const turn of playerTurns) {
      turn.style.opacity = 0;
    }
  }

  /**
   * Reset the game back to default
   */
  resetGame() {
    game = new Game();
    game.board.resetHTMLBoard();

    document.getElementById('game-scene').style.opacity = 0;
    document.getElementById('begin-game-wrapper').style.display = 'block';
    document.querySelector('.table .best-out-of').style.opacity = 0;
    document.querySelector('.arrow-buttons').style.opacity = 0;
    document.getElementById('reset-game').style.display = "none";
    document.getElementById('next-game').style.display = "none";
    document.getElementById('game-over').style.display = "none";
    document.getElementById('player-1-name').value = null;
    document.getElementById('player-2-name').value = null;
    document.getElementById('player-1-turn').style.opacity = 1;
    document.getElementById('player-2-turn').style.opacity = 0;
    document.getElementById('player-1-wins').textContent = 0;
    document.getElementById('player-2-wins').textContent = 0;
    document.getElementById('best-out-of').value = null;

    document.querySelectorAll('.arrow-button').forEach(button => button.disabled = false);
  }

  /**
   * Increase active players wins by 1 
   * Update the HTML displaying players wins
   */
  increaseActivePlayerWins(owner) {
    owner.wins++;
    
    if (game.activePlayer.id === 1) {
      document.getElementById('player-1-wins').textContent = owner.wins;
    } else {
      document.getElementById('player-2-wins').textContent = owner.wins;
    }
  }

  /**
   * Reset the board for the next game
   * The loser starts first in the next game
   */
  nextGame() {
    this.board.resetHTMLBoard();
    this.board.reCreateSpaces();
    this.board.drawHTMLBoard();

    this.switchPlayers();

    // Recreate players tokens
    this.players.forEach(player => player.reCreateTokens());

    this.activePlayer.activeToken.drawHTMLToken();
    
    document.getElementById('next-game').style.display = "none";
    document.getElementById('game-over').style.display = "none";

    document.querySelectorAll('.arrow-button').forEach(button => button.disabled = false);

    this.ready = true;
  }
}