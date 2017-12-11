/*
Great Heart - A Heartbeat Meditation Device by Jim Schmitz and Camilla Padgitt-Coles - ITP-NYU 2017
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


/*
Main P5 Sketch
*/

var patterns = {
  'simple': [4, 4, 8, 8],
  'square': [4, 8, 12, 16],
  'hard': [4, 8, 14, 16]
};
var patternName = Object.keys(patterns);
var visualizations = {
  'Circle Visualization 1': CircleVisualization1,
  'Circle Visualization 2': CircleVisualization2,
  'Ring Visualization 1': RingVisualization
};
var visualizationName = Object.keys(visualizations);
var currentVisualizationName = visualizationName[0];

var visualization;
var gui;
var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name herev
var note = 0;
var notes = ["a", "b", "c", "d", "e", "f", "g"];
var sounds = Object();
var instrument = 0;
var instruments = ["spacepiano", "sinebells", "nylonguitar", "heavensshores",
  "bowingtitanium", "heavenshores", "dusk"
];
var echo = "regular";

function preload() {
  for (var i = 0; i < instruments.length; i++) {
    sounds[instruments[i]] = Object();
    sounds[instruments[i]]["sustain"] = Object();
    sounds[instruments[i]]["regular"] = Object();
    for (var j = 0; j < 7; j++) {
      sounds[instruments[i]]["sustain"][j] = loadSound(`../audio/${instruments[i]}/sustain/${notes[j]}.mp3`);
      sounds[instruments[i]]["regular"][j] = loadSound(`../audio/${instruments[i]}/regular/${notes[j]}.mp3`);
    }
  }

}

function setup() {
  console.log("in setup");
  createCanvas(windowWidth, windowHeight);
  ellipseMode(RADIUS);
  imageMode(CENTER);

  // serial connection setup
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.open(portName); // open a serial port

  // user interface gui
  gui = createGui('User Controls');
  gui.hide();
  gui.addGlobals('patternName', 'visualizationName');

  // heartbeat / breathing visualization
  visualization = new visualizations[currentVisualizationName]();
  visualization.setup();
}

function draw() {
  if (mouseX < 250 && mouseY < 250) {
    gui.show();
  } else {
    gui.hide();
  }

  if (currentVisualizationName != visualizationName) {
    currentVisualizationName = visualizationName;
    visualization = new visualizations[currentVisualizationName]();
    visualization.setup();
  }

  visualization.updateBreathingVal(getBreathingValue(patterns[patternName]));
  visualization.draw();
}

function getBreathingValue(pattern) {
  var t = millis() / 1000.0 % pattern[3]; // breathing pattern repeats itself every 16 seconds
  var h = 0;
  if (t < pattern[0]) {
    //breathe in
    h = 0.5 - 0.5 * cos(PI * t / pattern[0]);
  } else if (t < pattern[1]) {
    //hold
    h = 1;
  } else if (t < pattern[2]) {
    //breathe out
    h = 0.5 + 0.5 * cos(PI * (t - pattern[1]) / (pattern[2] - pattern[1]));
  } else {
    //hold
    h = 0;
  }
  return h; // return where user is in breathing pattern
}


function serialEvent() {
  //read a line from the serial port (ASCII-encoded data):
  var input = serial.readLine();
  //store it in a global variable
  if (input == "heartbeat") {
    heartbeatEvent();
  } else if (input == "change_note") {
    changeNote();
  } else if (input == "change_instrument") {
    changeInstrument();
  } else if (input == "sustain_on") {
    sustainOn();
  } else if (input == "sustain_off") {
    sustainOff();
  } else if (input == "off") {
    offButton();
  }
}


function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function heartbeatEvent() {
  visualization.reportHeartbeat();

  sounds[instruments[instrument]][echo][note].play();
  console.log('heartbeat');
}

function changeNote() {
  note = (note + 1) % 7;
  console.log('change note');
}

function changeInstrument() {
  instrument = (instrument + 1) % instruments.length;
  console.log('change instrument');
}

function sustainOn() {
  echo = "sustain";
  console.log('sustain on');
}

function sustainOff() {
  echo = "regular";
  console.log('sustain off');
}

function offButton() {
  console.log('off');
}
