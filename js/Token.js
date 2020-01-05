class Token {
  constructor(index, owner) {
    this.owner = owner;
    this.id = `token-${index}-${owner.id}`;
    this.dropped = false;
    this.columnLocation = 1;
  }

  /*
   * Get the token HTML element by its id
   */
  get htmlToken() {
    return document.getElementById(this.id);
  }

  /** 
   * Gets left offset of html element.
   * @return  {number}   Left offset of token object's htmlToken.
   */
  get offsetLeft() {
    return this.htmlToken.offsetLeft;
  }

  /*
   * Create HTML element for the token
   */
  drawHTMLToken() {
    const divElement = document.createElement('div');

    document.getElementById('game-board-underlay').appendChild(divElement);

    divElement.setAttribute('id', this.id);
    divElement.setAttribute('class', 'token');
    divElement.style.backgroundColor = this.owner.color;
  }

  /** 
   * Moves html token one column to left.
   */
  moveLeft() {
    if (this.columnLocation - 1) {
      this.htmlToken.style.left = this.offsetLeft - 76;
      this.columnLocation--;
    }
  }

  /** 
   * Moves html token one column to right.
   * @param   {number}    columns - number of columns in the game board
   */
  moveRight(columns) {
    if (columns !== this.columnLocation) {
      this.htmlToken.style.left = this.offsetLeft + 76;
      this.columnLocation++;
    }
  }

  /** 
   * Drops html token into targeted board space.
   * @param   {Object}   target - Targeted space for dropped token.
   * @param   {function} reset  - The reset function to call after the drop animation has completed.
   */
  drop(target, reset) {
    this.dropped = true;
    target.mark(this);

    $(this.htmlToken).animate({ 
      top: target.y * target.diameter
    }, 750, "easeOutBounce", reset);
  }
}