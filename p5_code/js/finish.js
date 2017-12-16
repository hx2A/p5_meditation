/*
 * Great Heart
 *
 * Midterm/final project for Introduction to Physical Computing
 * Fall 2017
 * Camilla Padgitt-Coles
 * Jim Schmitz
 *
 * Final scene for Great Heart. Shows a screen with a beginning and ending
 * heart rate and thank-you message
 */

 /**
  * Great Heart Finish scene
  */
function Finish() {
  // layout variables
  let centerX = width / 2;
  let buttonY = height / 2;
  let buttonWidth = 300;
  let buttonHeight = 100;
  let textVerticalOffset = 50;

  let button;
  var me;

  /**
   * Helper function for creating identical buttons
   */
  // TODO: this button function is duplicated in intro.js
  function initButton(text, x, y, mouseClickedCallback) {
    var button = createButton(text);
    button.size(buttonWidth, buttonHeight);
    button.position(x - buttonWidth / 2, y);
    button.style("font-family", "Arial");
    button.style("font-size", "32px");
    button.mouseClicked(mouseClickedCallback)

    return button;
  }

  /**
   * Scene manager enter function
   *
   * Run each time the scene manager returns to this scene
   */
  this.enter = function() {
    me = this;
    fill(0);
    imageMode(CENTER);
    textSize(32);
    textAlign(CENTER);
    console.log('parameters', this.sceneArgs);

    var button = initButton("Back to start page", centerX, buttonY,
      function() {
        console.log("Back to intro");
        button.remove();
        me.sceneManager.showScene(Intro);
      });
  }

  /**
   * Scene manager draw function
   *
   * Run once per frame
   */
    this.draw = function() {
    background(255 - (50 * sin(millis() / 1000)));
    text("Thank you for participating in our project!", centerX, buttonY - textVerticalOffset * 2);
    text("Your initial pulse: " + this.sceneArgs[1] + "   Final pulse: " + this.sceneArgs[0],
      centerX, buttonY - textVerticalOffset);
  }

  /**
   * P5 key-pressed event.
   *
   * Run when user hits a key. This works because of the `wire()` call in start.js
    */
  this.keyPressed = function() {
    if (key == ' ') {
      this.sceneManager.showScene(Intro);
    }
  }
}
