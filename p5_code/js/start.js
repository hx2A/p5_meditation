var instruments = ["spacepiano", "sinebells", "nylonguitar", "heavensshores",
  "bowingtitanium", "magicwaters", "dusk"
];
var notes = ["a", "b", "c", "d", "e", "f", "g"];
var sounds;
var audioguide;

function preload() {
  sounds = Object();
  audioguide = loadSound("audio/audioguide.mp3");

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
  createCanvas(windowWidth, windowHeight);

  var mgr = new SceneManager();
  mgr.sounds = sounds;
  mgr.audioguide = audioguide;
  mgr.wire();
  mgr.showScene(Intro);
}
