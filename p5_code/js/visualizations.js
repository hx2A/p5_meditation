/*
 * Great Heart
 *
 * Midterm/final project for Introduction to Physical Computing
 * Fall 2017
 * Camilla Padgitt-Coles
 * Jim Schmitz
 *
 * Collection of visualization objects. Instances of these classes can be swapped
 * in and out to change the visual experience. New visualizations can also be
 * created very easily.
 */


/**
 * Simple circle visualization class
 */
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

/**
 * Simple circle visualization class
 */
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

/**
 * Ring visualization class
 */
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

/**
 * Rectangle visualization class
 */
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

/**
 * Growing polygon visualization class
 */
class PolygonVisualization {
  constructor() {
    this.breathingState = "breathe in";
    this.breathingVal = 0;
    this.radius = min(width, height) / 2;
    this.lastHeartbeat = 0;

  }

  setup() {
    fill(83, 187, 186)
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
      var polygonHeartbeat = (millis() - this.lastHeartbeat) / 50;
      var polygonFade = lerpColor(color(6, 38, 104), color(9, 70, 149), polygonHeartbeat);
      background(polygonFade);
    } else {
      background(6, 38, 104);
    }
    this.polygon(width / 2, height / 2, this.breathingVal * 375, floor(this.breathingVal * 20) + 3);
  }

  polygon(x, y, radius, npoints) {
    var angle = TWO_PI / npoints;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
      var sx = x + cos(a) * radius;
      var sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}
