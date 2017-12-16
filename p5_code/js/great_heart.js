/*
 * Great Heart
 *
 * Midterm/final project for Introduction to Physical Computing
 * Fall 2017
 * Camilla Padgitt-Coles
 * Jim Schmitz
 *
 * Main scene for Great Heart. Shows breathing exercises and breathing visualization.
 */

// breathing patterns, in seconds. to add a breathing pattern, add it here.
var patterns = {
  'simple': [4, 4, 8, 8],
  'square': [4, 8, 12, 16],
  'hard': [4, 8, 14, 16]
};
var patternName = Object.keys(patterns);
// visualization management variables
var visualizations;
var visualizationName;
var currentVisualizationName;
// time last note was played and time interval between notes, in ms
var lastNoteTime;
var noteInterval;
// hide menu dropdown
var hideMenu = ["No", "Yes"];
// pulse rates, current and initial
var pulse;
var initialPulse;

/**
 * Great Heart main scene
 */
function GreatHeart() {
  // visualization options
  visualizations = {
    'Ring Visualization 1': RingVisualization,
    'Circle Visualization 1': CircleVisualization1,
    'Circle Visualization 2': CircleVisualization2,
    'Rectangle Visualization 1': RectangleVisualization,
    'Polygon Visualization 1': PolygonVisualization
  };
  visualizationName = Object.keys(visualizations);
  currentVisualizationName = visualizationName[0];
  var visualization;

  var gui;
  var serial; // variable to hold an instance of the serialport library
  var portName = '/dev/cu.usbmodem1421';
  var sounds; // tree datastructure of sounds

  var note = 0; // index of current note being played
  var notes = ["a", "b", "c", "d", "e", "f", "g"];

  var instrument = 0; // index of current instrument being played
  var instruments = ["spacepiano", "nylonguitar", "heavensshores","bowingtitanium"];
    //removed "sinebells", "magicwaters", "dusk"

  var echo = "regular"; // sustain?

  var stopTest; // function testing stopping condition
  var startTime; // start of meditation

  var me = this;

  /**
   * Scene manager enter function
   *
   * Run each time the scene manager returns to this scene
   */
  this.enter = function() {
    // make sure user starts hearing a pulse of some kind to enhance user experience.
    // this will be adjusted as the pulse sensor reads information.
    lastNoteTime = millis();
    noteInterval = 1200;

    // local reference to sounds
    sounds = this.sceneManager.sounds;

    // serial connection setup
    serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.open(portName); // open a serial port

    // user interface gui
    if (gui == undefined) {
      gui = createGui('Breathing Visualization Options');
      gui.addGlobals('patternName', 'visualizationName', 'hideMenu');
    } else {
      gui.show();
      hideMenu = "No";
    }
    // initialize heartbeat / breathing visualization
    visualization = new visualizations[currentVisualizationName]();
    visualization.setup();

    // setup stopping conditions
    startTime = millis();
    initialPulse = undefined;
    if (this.sceneArgs == '1') {
      stopTest = stopChallenge;
    } else {
      stopTest = stopDuration;
    }
  }

  /**
   * Scene manager draw function
   *
   * Run once per frame
   */
  this.draw = function() {
    // test if it is time to stop meditation
    stopTest();

    // is it time to play another note?
    if (millis() > lastNoteTime + noteInterval) {
      visualization.reportHeartbeat();
      // note the clever use of nested objects
      sounds[instruments[instrument]][echo][note].play();
      lastNoteTime = millis();
    }
    // show/hide menu only if user requests this
    if (hideMenu == "Yes") {
      if (mouseX < 250 && mouseY < 250) {
        gui.show();
      } else {
        gui.hide();
      }
    }
    // if the user picked a different visualization, create a new visualization
    // object. it would be better if this could be implemented with callbacks.
    if (currentVisualizationName != visualizationName) {
      currentVisualizationName = visualizationName;
      visualization = new visualizations[currentVisualizationName]();
      visualization.setup();
    }

    // update the visualization object with the current breathing state, ie, where
    // in the breathing pattern the user currently is.
    visualization.updateBreathingVal(getBreathingValue(patterns[patternName]));
    visualization.draw();
  }

  /**
   * Key pressed event. Let the user quit.
   */
  this.keyPressed = function() {
    if (key == 'q' || key == 'Q') {
      this.sceneManager.showScene(Intro);
      gui.hide();
    }
  }

  /**
   * Stop test for heart rate reduction
   */
  function stopChallenge() {
    if (startTime + 30 * 1000 < millis() && pulse < initialPulse * 0.9) {
      gui.hide();
      me.sceneManager.showScene(Finish, [pulse, initialPulse]);
    }
  }

  /**
   * Stop test for fixed length of time
   */
  function stopDuration() {
    if (startTime + 120 * 1000 < millis()) {
      gui.hide();
      me.sceneManager.showScene(Finish, [pulse, initialPulse]);
    }
  }

  /**
   * Using the current time, figure out where in the current breathing pattern the user is
   */
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
      h = 0.0001;
    }
    return h; // return where user is in breathing pattern
  }

  /**
   * Serial event handler
   */
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
    } else if (input.startsWith("pulse")) {
      pulseMessage(int(input.split(",")[1]));
    }
  }

  /**
   * Serial error handler
   */
  function serialError(err) {
    console.log('Something went wrong with the serial port. ' + err);
  }

  /**
   * Handle "heartbeat" message from device
   */
  function heartbeatEvent() {
    // visualization.reportHeartbeat();
    // sounds[instruments[instrument]][echo][note].play();
    console.log('heartbeat');
  }

  /**
   * Handle "change_note" message from device
   */
  function changeNote() {
    note = (note + 1) % 7;
    console.log('change note');
  }

  /**
   * Handle "change_instrument" message from device
   */
  function changeInstrument() {
    instrument = (instrument + 1) % instruments.length;
    console.log('change instrument');
  }

  /**
   * Handle "sustain_on" message from device
   */
  function sustainOn() {
    echo = "sustain";
    console.log('sustain on');
  }

  /**
   * Handle "sustain_off" message from device
   */
  function sustainOff() {
    echo = "regular";
    console.log('sustain off');
  }

  /**
   * Handle "off" message from device.
   *
   * Currently not used. Reserved for future enhancements.
   */
  function offButton() {
    console.log('off');
  }

  /**
   * Handle "pulse" message from device
   *
   * Play notes using tempo specified by this pulse rate message. This provides
   * a better user experience than one that plays a note only when an individual
   * heartbeat is played.
   */
  function pulseMessage(bpm) {
    console.log('bpm:', bpm);
    if (initialPulse == undefined) {
      initialPulse = bpm;
      console.log(initialPulse);
    }
    pulse = bpm;
    noteInterval = 60000 / bpm;
  }
}
