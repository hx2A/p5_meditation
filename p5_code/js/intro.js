function Intro() {
  let logo;

  // layout variables
  let centerX = width / 2;
  let logoY = height / 4;
  let logoCaptionOffset = 100;
  let buttonY = height / 2;
  let buttonWidth = 200;
  let buttonHeight = 100;
  let leftButtonX = width / 3;
  let rightButtonX = 2 * width / 3;
  let textVerticalOffset = 150;

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
  this.setup = function() {
    logo = loadImage("images/great-heart.png");
  }
  this.enter = function() {
    imageMode(CENTER);
    textSize(16);
    textAlign(CENTER);
    buttons = {};
    buttons.challenge = initButton("Challenge", leftButtonX, buttonY, function() {
      buttons.challenge.remove();
      buttons.duration.remove();
      me.sceneManager.showScene(GreatHeart, 1);
    });

    buttons.duration = initButton("Duration", rightButtonX, buttonY, function() {
      buttons.challenge.remove();
      buttons.duration.remove();
      me.sceneManager.showScene(GreatHeart, 2);
    });
  }

  this.draw = function() {
    background(220);
    image(logo, centerX, logoY, logo.width / 7, logo.height / 7);
    text("Please put on headphones to continue.", centerX, logoY + logoCaptionOffset);
    text("Reduce your heartrate\n by 10%", leftButtonX, buttonY + textVerticalOffset);
    text("Two minute meditation", rightButtonX, buttonY + textVerticalOffset);
  }
}
