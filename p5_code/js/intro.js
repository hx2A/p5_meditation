function Intro() {
  let logo;

  // layout variables
  let centerX = width / 2;
  let logoY = height / 5;
  let logoCaptionOffset = 100;
  let instructionButtonOffset = 120;
  let buttonY = height / 1.7;
  let buttonWidth = 250;
  let buttonHeight = 100;
  let leftButtonX = width / 3;
  let rightButtonX = 2 * width / 3;
  let textVerticalOffset = 130;

  var me = this;

  function initButton(text, x, y, mouseClickedCallback) {
    var button = createButton(text);
    button.size(buttonWidth, buttonHeight);
    button.position(x - buttonWidth / 2, y);
    button.style("font-family", "Arial");
    button.style("font-size", "32px");
    button.mouseClicked(mouseClickedCallback)

    return button;
  }

function removeAllButtons () {
  buttons.challenge.remove();
  buttons.duration.remove();
  buttons.instructions.remove();

}

  this.setup = function() {
    logo = loadImage("images/great-heart.png");
  }
  this.enter = function() {
    fill(0);
    imageMode(CENTER);
    textSize(16);
    textAlign(CENTER);
    buttons = {};
    buttons.challenge = initButton("Challenge", leftButtonX, buttonY, function() {
      removeAllButtons ();
      me.sceneManager.showScene(GreatHeart, 1);
    });

    buttons.duration = initButton("Duration", rightButtonX, buttonY, function() {
      removeAllButtons ();
      me.sceneManager.showScene(GreatHeart, 2);
    });

    buttons.instructions = initButton("Instructions", centerX, logoY + instructionButtonOffset, function() {
      removeAllButtons ();

    });
  }


  this.draw = function() {
    background(255-(50*sin(millis()/1000)));
    image(logo, centerX, logoY, logo.width / 5, logo.height / 5);
    text("Please put on headphones to continue.", centerX, logoY + logoCaptionOffset);
    text("Reduce your heartrate by 10%", leftButtonX, buttonY + textVerticalOffset);
    text("Two minute meditation", rightButtonX, buttonY + textVerticalOffset);
  }
}
