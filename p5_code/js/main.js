/*
Test Gui
*/
class TestGui {
  constructor() {
    this.breathingState = "breathe in";
    this.breathingVal = 0;
    this.radius = min(width,height)/2;
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

  draw() {
    background(128);
    // draw visualization to the screen
    //console.log(this.breathing_state, this.breathing_val);
  ellipse(width/2,height/2,this.radius*this.breathingVal,this.radius*this.breathingVal);
  }
}

/*
Main P5 Sketch
*/

var pattern = 0;
var patterns = [[4, 4, 8, 8], [4, 8, 12, 16], [4, 8, 14, 16]];
var gui;
var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name herev
var note = 0;
var notes = ["a", "b", "c", "d", "e", "f", "g"];
var sounds = Object();
var instrument = 0;
var instruments = ["spacepiano", "analogchimes", "angelicmorph", "cometstar",
                   "heavensshores", "pianofreeze", "sinebells"];
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
  createCanvas(windowWidth,windowHeight);
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.open(portName); // open a serial port
  gui = new TestGui();
  gui.setup();
}

function draw() {
  gui.updateBreathingVal(getBreathingValue(patterns[pattern]));
  gui.draw();
}

function getBreathingValue(pattern) {
  var t = millis() / 1000.0%pattern[3]; // breathing pattern repeats itself every 16 seconds
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
    playHeartbeat();
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

function playHeartbeat() {
  sounds[instruments[instrument]][echo][note].play();
  console.log('heartbeat');
}
function changeNote() {
  note = (note+1)%7;
  console.log('change note');
}
function changeInstrument() {
  instrument = (instrument+1)%instruments.length;
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
