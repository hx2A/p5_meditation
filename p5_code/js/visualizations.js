class CircleVisualization1 {
  constructor() {
    this.breathingState = "breathe in";
    this.breathingVal = 0;
    this.radius = min(width, height) / 2;
    this.lastHeartbeat = 0;
  }

  setup() {
    ellipseMode(RADIUS);
  }

  updateBreathingState(state) {
    this.breathingState = state;
  }

  updateBreathingVal(val) {
    this.breathingVal = val;
  }

  reportHeartbeat() {
    this.lastHeartbeat = millis();
  }

  draw() {
    background(255);
    // draw visualization to the screen
    if (this.lastHeartbeat + 50 > millis()) {
      fill(255, 0, 0);
    } else {
      fill(128);
    }
    ellipse(width / 2, height / 2, this.radius * this.breathingVal, this.radius * this.breathingVal);
  }
}

class CircleVisualization2 {
  constructor() {
    this.breathingState = "breathe in";
    this.breathingVal = 0;
    this.radius = min(width, height) / 2;
    this.lastHeartbeat = 0;
  }

  setup() {
    ellipseMode(RADIUS);
  }

  updateBreathingState(state) {
    this.breathingState = state;
  }

  updateBreathingVal(val) {
    this.breathingVal = val;
  }

  reportHeartbeat() {
    this.lastHeartbeat = millis();
  }

  draw() {
    background(255);
    // draw visualization to the screen
    if (this.lastHeartbeat + 50 > millis()) {
      fill(0, 255, 255);
    } else {
      fill(128);
    }
    ellipse(width / 2, height / 2, this.radius * this.breathingVal, this.radius * this.breathingVal);
  }
}

class RingVisualization {
  constructor() {
    this.breathingState = "breathe in";
    this.breathingVal = 0;
    this.radius = min(width, height) / 2;
    this.lastHeartbeat = 0;
    this.circle;
    this.circleHeartbeat;
  }

  setup() {
    this.circle = loadImage("images/circle.png");
    this.circleHeartbeat = loadImage("images/pinkcircle.png");
    ellipseMode(RADIUS);
  }

  updateBreathingState(state) {
    this.breathingState = state;
  }

  updateBreathingVal(val) {
    this.breathingVal = val;
  }

  reportHeartbeat() {
    this.lastHeartbeat = millis();
  }

  draw() {
    background(255);
    // draw visualization to the screen
    if (this.lastHeartbeat + 50 > millis()) {
      image(this.circleHeartbeat, width / 2, height / 2, 400 * this.breathingVal, 400 * this.breathingVal);
    } else {
      image(this.circle, width / 2, height / 2, 400 * this.breathingVal, 400 * this.breathingVal);
    }
  }
}

class RectangleVisualization {
  constructor() {
    this.breathingState = "breathe in";
    this.breathingVal = 0;
    this.radius = min(width, height) / 2;
    this.lastHeartbeat = 0;
    this.rectangle;

  }

  setup() {
    this.rectangle = loadImage("images/bluerectangle2.png");
  }

  updateBreathingState(state) {
    this.breathingState = state;
  }

  updateBreathingVal(val) {
    this.breathingVal = val;
  }

  reportHeartbeat() {
    this.lastHeartbeat = millis();
  }

  draw() {
    // draw visualization to the screen
    if (this.lastHeartbeat + 200 > millis()) {
      var rectangleHeartbeat = (millis() - this.lastHeartbeat) / 50;
      var rectangleFade = lerpColor(color(6, 38, 104), color(9, 70, 149), rectangleHeartbeat);
      background(rectangleFade);
    } else {
      background(6, 38, 104);
    }
    image(this.rectangle, width / 2, height / 2, 400, height * this.breathingVal);
  }
}
