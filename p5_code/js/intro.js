/*
 * Great Heart
 *
 * Midterm/final project for Introduction to Physical Computing
 * Fall 2017
 * Camilla Padgitt-Coles
 * Jim Schmitz
 *
 * Introduction scene for Great Heart. Shows a screen with a few buttons and plays
 * audio introduction.
 */

/**
 * Great Heart Introduction scene
 */
function Intro() {
  let logo;

  // layout variables
  let centerX = width / 2;
  let logoY = height / 5;
  let logoCaptionOffset = 125;
  let instructionButtonOffset = 150;
  let buttonY = height / 1.7;
  let buttonWidth = 275;
  let buttonHeight = 100;
  let leftButtonX = width / 3;
  let rightButtonX = 2 * width / 3;
  let textVerticalOffset = 130;

  var me = this;
  var audioguide;

  /**
   * Helper function for creating identical buttons
   */
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
   * Destroy buttons
   *
   * Necessary before moving to next scene so that when the scene manager comes
   * back to this scene, we don't display duplicated buttons
   */
  function removeAllButtons() {
    buttons.challenge.remove();
    buttons.duration.remove();
    buttons.instructions.remove();

  }

  /**
   * Setup function, run *once* the first time the scene is run and never again
   */
  this.setup = function() {
    logo = loadImage("images/great-heart.png");
  }

  /**
   * Scene manager enter function
   *
   * Run each time the scene manager returns to this scene
   */
  this.enter = function() {
    audioguide = this.sceneManager.audioguide;
    fill(0);
    imageMode(CENTER);
    textSize(20);
    textAlign(CENTER);

    // Create 2 buttons with callbacks to stop audio guide if it is playing and remove buttons.
    buttons = {};
    buttons.challenge = initButton("Challenge", leftButtonX, buttonY, function() {
      removeAllButtons();
      audioguide.stop();
      me.sceneManager.showScene(GreatHeart, 1);
      console.log("stop audio guide if playing");
    });

    buttons.duration = initButton("Duration", rightButtonX, buttonY, function() {
      removeAllButtons();
      audioguide.stop();
      me.sceneManager.showScene(GreatHeart, 2);
      console.log("stop audio guide if playing");
    });

    // Create button to play audio guide
    buttons.instructions = initButton("Instructions", centerX, logoY + instructionButtonOffset, function() {
      audioguide.stop();
      audioguide.play();
      console.log("play audio guide");


    });
  }

  /**
   * Scene manager draw function
   *
   * Run once per frame
   */
  this.draw = function() {
    background(255 - (50 * sin(millis() / 1000)));
    image(logo, centerX, logoY, logo.width / 4, logo.height / 4);
    text("Please put on headphones to continue.", centerX, logoY + logoCaptionOffset);
    text("Reduce your heartrate by 10%", leftButtonX, buttonY + textVerticalOffset);
    text("Two minute meditation", rightButtonX, buttonY + textVerticalOffset);
  }
}
