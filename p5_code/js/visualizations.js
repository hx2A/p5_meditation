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
