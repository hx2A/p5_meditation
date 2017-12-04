// define user constants

#define USE_ARDUINO_INTERRUPTS true
#include <PulseSensorPlayground.h>

// declare variables
boolean sustainOn;
boolean voiceButtonOn;
boolean noteButtonOn;
boolean offButtonOn;
const int OUTPUT_TYPE = SERIAL_PLOTTER;
const int sustainPin = 11; //red
const int voicePin = 9; // red
const int notePin = 12; // blue
const int offPin = 10; // orange
const int PIN_INPUT = A0;
const int PIN_BLINK = 13;    // Pin 13 is the on-board LED
const int PIN_FADE = 5;
const int THRESHOLD = 550;   // Adjust this number to avoid noise when idle
int channelNumber;
int noteNumber;
byte midiChannel;

PulseSensorPlayground pulseSensor;

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
  if (!pulseSensor.begin()) {

    for (;;) {
      // Flash the led to show things didn't work.
      digitalWrite(PIN_BLINK, LOW);
      delay(50);
      digitalWrite(PIN_BLINK, HIGH);
      delay(50);
    }
  }

  // initialize variables
  sustainOn = false;
  channelNumber = 0;
  voiceButtonOn = false;
  noteNumber = 50;
  noteButtonOn = false;
  offButtonOn = false;
}

void loop() {
  if (pulseSensor.sawStartOfBeat()) {
    //   pulseSensor.outputBeat();
    Serial.println("heartbeat");
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
     Wait a bit.
     We don't output every sample, because our baud rate
     won't support that much I/O.
  */
  // pause 20 ms
  delay(20);
}
