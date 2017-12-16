/*
 * Great Heart
 *
 * Midterm/final project for Introduction to Physical Computing
 * Fall 2017
 * Camilla Padgitt-Coles
 * Jim Schmitz
 *
 * Main P5 sketch launching the project. This uses the P5 scene manager library
 * to organize the project flow.
 */

// Names of instruments to preload sounds for
// TODO: this is duplicated in great_heart.js
var instruments = ["spacepiano", "nylonguitar", "heavensshores", "bowingtitanium"];
    //removed "sinebells", "magicwaters", "dusk"
var notes = ["a", "b", "c", "d", "e", "f", "g"];
var sounds;
var audioguide;

/**
 * Standard P5 function to preload our many audio files.
 */
function preload() {
  audioguide = loadSound("audio/audioguide.mp3");

  sounds = Object();
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

/**
 * Standard P5 function run once at the beginning of the sketch.
 *
 * Because this sketch uses the P5 SceneManager library, the SceneManager drives
 * the animation thread.
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  var mgr = new SceneManager();
  // attach preloaded sound files to the scene manager for retrieval by scene code
  mgr.sounds = sounds;
  mgr.audioguide = audioguide;
  // connect P5 events
  mgr.wire();
  // start the first scene
  mgr.showScene(Intro);
}
