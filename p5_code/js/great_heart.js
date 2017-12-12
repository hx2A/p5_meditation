var patterns = {
  'simple': [4, 4, 8, 8],
  'square': [4, 8, 12, 16],
  'hard': [4, 8, 14, 16]
};
var patternName = Object.keys(patterns);
var visualizations;
var visualizationName;
var currentVisualizationName;
var lastNoteTime;
var noteInterval;
var hideMenu = ["No", "Yes"];
var pulse;
var initialPulse;

function GreatHeart() {
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
  var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name herev
  var note = 0;
  var notes = ["a", "b", "c", "d", "e", "f", "g"];
  var sounds;
  var instrument = 0;
  var instruments = ["spacepiano", "sinebells", "nylonguitar", "heavensshores",
    "magicwaters", "bowingtitanium", "dusk"
  ];

  var echo = "regular";

  var stopTest;
  var startTime;

  var me = this;

  this.enter = function() {
    console.log("in great heart enter function");

    lastNoteTime = millis();
    noteInterval = 1200;

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
    // heartbeat / breathing visualization
    visualization = new visualizations[currentVisualizationName]();
    visualization.setup();

    // stopping conditions
    startTime = millis();
    initialPulse = undefined;

    if (this.sceneArgs == '1') {
      stopTest = stopChallenge;
    } else {
      stopTest = stopDuration;
    }
  }

  this.draw = function() {
    stopTest();

    if (millis() > lastNoteTime + noteInterval) {
      visualization.reportHeartbeat();
      sounds[instruments[instrument]][echo][note].play();
      lastNoteTime = millis();
    }
    if (hideMenu == "Yes") {
      if (mouseX < 250 && mouseY < 250) {
        gui.show();
      } else {
        gui.hide();
      }
    }
    if (currentVisualizationName != visualizationName) {
      currentVisualizationName = visualizationName;
      visualization = new visualizations[currentVisualizationName]();
      visualization.setup();
    }

    visualization.updateBreathingVal(getBreathingValue(patterns[patternName]));
    visualization.draw();
  }

  this.keyPressed = function() {
    if (key == 'q' || key == 'Q') {
      this.sceneManager.showScene(Intro);
      gui.hide();
    }
  }

  function stopChallenge() {
    if (startTime + 30 * 1000 < millis() && pulse < initialPulse * 0.9) {
      gui.hide();
      me.sceneManager.showScene(Finish, [pulse, initialPulse]);
    }
  }

  function stopDuration() {
    if (startTime + 120 * 1000 < millis()) {
      gui.hide();
      me.sceneManager.showScene(Finish, [pulse, initialPulse]);
    }
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
      h = 0.0001;
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
    } else if (input.startsWith("pulse")) {
      pulseMessage(int(input.split(",")[1]));
    }
  }

  function serialError(err) {
    console.log('Something went wrong with the serial port. ' + err);
  }

  function heartbeatEvent() {
    // visualization.reportHeartbeat();

    // sounds[instruments[instrument]][echo][note].play();
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

  function pulseMessage(bpm) {
    console.log('bpm:', bpm);
    if (initialPulse == undefined) {
      initialPulse = 2 * bpm;
      console.log(initialPulse);
    }
    pulse = bpm;
    noteInterval = 60000 / bpm;
  }
}
