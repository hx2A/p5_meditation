/*
 * Great Heart
 *
 * Midterm/final project for Introduction to Physical Computing
 * Fall 2017
 * Camilla Padgitt-Coles
 * Jim Schmitz
 *
 * Arduino code. Receive pulse data from Pulse Sensor library and
 * transmit to P5 sketch via serial library along with buttons press
 * events.
 */

// interrupts definition must be before PulseSensorPlayground.h include file
#define USE_ARDUINO_INTERRUPTS true
#include <PulseSensorPlayground.h>

// button status variables
boolean sustainOn;
boolean voiceButtonOn;
boolean noteButtonOn;
boolean offButtonOn;

// button pins
const int sustainPin = 11; //red
const int voicePin = 9; // red
const int notePin = 12; // blue
const int offPin = 10; // orange

// pulse sensor settings
const int OUTPUT_TYPE = SERIAL_PLOTTER;
const int PIN_INPUT = A0;
const int PIN_BLINK = 13;    // Pin 13 is the on-board LED
const int PIN_FADE = 4;
const int THRESHOLD = 550;   // Adjust this number to avoid noise when idle

PulseSensorPlayground pulseSensor;

/**
 * Setup function, run once on Arduino startup.
 * 
 * Serial connection to computer and connection to pulse sensor should both be ready to go.
 */
void setup() {
  Serial.begin(9600);

  pinMode(sustainPin, INPUT); // configure sustain for reading later
  pinMode(voicePin, INPUT); // configure voice for reading later
  pinMode(notePin, INPUT); // configure note for reading later
  pinMode(offPin, INPUT); // configure off button for reading later

  pulseSensor.analogInput(PIN_INPUT);
  pulseSensor.blinkOnPulse(PIN_BLINK);
  pulseSensor.fadeOnPulse(PIN_FADE);

  pulseSensor.setSerial(Serial);
  pulseSensor.setOutputType(OUTPUT_TYPE);
  pulseSensor.setThreshold(THRESHOLD);

  // Now that everything is ready, start reading the PulseSensor signal.
  // if something is wrong, make a sign of some kind.
  if (!pulseSensor.begin()) {

    for (;;) {
      // Flash the led to show things didn't work.
      digitalWrite(PIN_BLINK, LOW);
      delay(50);
      digitalWrite(PIN_BLINK, HIGH);
      delay(50);
    }
  }

  // button status variables
  sustainOn = false;
  voiceButtonOn = false;
  noteButtonOn = false;
  offButtonOn = false;
}

/**
 * Loop function run repeatedly.
 * 
 * Check for button presses and pass heartbeat event information.
 */
void loop() {
  if (pulseSensor.sawStartOfBeat()) {
    Serial.println("heartbeat");
    Serial.print("pulse,");
    Serial.println(pulseSensor.getBeatsPerMinute());    
  }

  int sustainRead = digitalRead(sustainPin);
  if (sustainOn == false && sustainRead == HIGH) {
    Serial.println("sustain_on");
    sustainOn = true;
  } else if (sustainOn == true && sustainRead == LOW) {
    Serial.println("sustain_off");
    sustainOn = false;
  }

  int voicePress = digitalRead(voicePin);
  if (voiceButtonOn == false && voicePress == HIGH) {
    Serial.println("change_instrument");
    voiceButtonOn = true;
  } else if (voiceButtonOn == true && voicePress == LOW) {
    voiceButtonOn = false;
  }

  int notePress = digitalRead(notePin);
  if (noteButtonOn == false && notePress == HIGH) {
    Serial.println("change_note");
    noteButtonOn = true;
  } else if (noteButtonOn == true && notePress == LOW) {
    noteButtonOn = false;
  }

  int offButtonRead = digitalRead(offPin);
  if (offButtonOn == false && offButtonRead == HIGH) {
    Serial.println("off");
    offButtonOn = true;
  } else if (offButtonOn == true && offButtonRead == LOW) {
    offButtonOn = false;

  }

  /*
   * Wait a bit.
   * We don't output every sample, because our baud rate
   * won't support that much I/O.
   */
  delay(20);
}

