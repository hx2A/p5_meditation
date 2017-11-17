// define user constants
#define SPAN 300
#define VOLUME 127

// declare variables
float valEMA;
float alpha;
boolean beat;
boolean sustainOn;
boolean voiceButtonOn;
boolean noteButtonOn;
boolean offButtonOn;
const int sustainPin = 13;
const int voicePin = 9;
const int notePin = 12;
const int offPin = 10;
int channelNumber;
int noteNumber;
byte midiChannel;

void setup() {
  Serial.begin(9600);

  pinMode(sustainPin, INPUT); // configure sustain for reading later
  pinMode(voicePin, INPUT); // configure voice for reading later
  pinMode(notePin, INPUT); // configure note for reading later
  pinMode(offPin, INPUT); // configure off button for reading later

  // initialize variables
  valEMA = 512;
  alpha = 2.0 / (SPAN + 1);
  beat = false;
  sustainOn = false;
  channelNumber = 0;
  voiceButtonOn = false;
  noteNumber = 50;
  noteButtonOn = false;
  offButtonOn = false;
}

void loop() {
  // read heartbeat monitor
  int val = analogRead(A0);

  // update moving average
  valEMA = alpha * val + (1 - alpha) * valEMA;

  // is the new reading significantly above the moving average?
  // if so, this spike means the heart is beating
  if (val > valEMA + 60) {
    // have we not already detected this beat?
    if (!beat) {
      // note on
  Serial.println("heartbeat");
      // update state variables
      beat = true;
    }
    // has the current reading dropped down below the moving average?
    // if so, this beat has ended
  } else if (val < valEMA) {
    beat = false;
  }

  // TODO: read other buttons and compare to state. send MIDI messages where necessary
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


  // pause 10 ms
  delay(10);
}



