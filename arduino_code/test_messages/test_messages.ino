int pauseDuration = 1000;

void setup() {
  Serial.begin(9600);

  Serial.println("start");
}

void loop() {
  Serial.println("heartbeat");
  delay(pauseDuration);
  Serial.println("heartbeat");
  delay(pauseDuration);
  Serial.println("heartbeat");
  delay(pauseDuration);
  Serial.println("change_note");

  Serial.println("heartbeat");
  delay(pauseDuration);
  Serial.println("heartbeat");
  delay(pauseDuration);
  Serial.println("heartbeat");
  delay(pauseDuration);
  Serial.println("change_instrument");
}
