class Player {
  constructor(name, id, color, active = false) {
    this.name = name;
    this.id = id;
    this.color = color;
    this.active = active;
    this.tokens = this.createTokens(21);
    this.wins = 0;
  }

  /** 
   * All tokens that have not been dropped
   * @return {array} Array of unused tokens 
   */
  get unusedTokens() {
    return this.tokens.filter(token => !token.dropped);
  }

  /** 
   * Gets an unused token by returning the first one in the array
   * @return {object} First token object in the array of unused tokens
   */
  get activeToken() {
    return this.unusedTokens[0];
  }

  /**
   * Creates token objects for player
   * @param     {number}    num - Number of token objects to be created
   * @return   {Array}     An array of the newly created token objects
   */
  createTokens(num) {
    const tokens = [];

    for (let i = 0; i < num; i++) {
      let token = new Token(i, this);
      tokens.push(token);
    }

    return tokens;
  }

  /**
   * Check if a player has any undropped tokens left
   * @return {Boolean} 
   */
  checkTokens() {
    return this.unusedTokens.length ? true : false;
  }
}