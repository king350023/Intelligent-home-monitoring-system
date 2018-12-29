#include<ICCI.h>
ICCI MOTOR;
const byte dataPin = 2;
char reply[5];

char cmd;         // 儲存接收資料的變數，採字元類型

void setup(){
MOTOR.Motor_setup();
Serial.begin(9600);
}
void loop() {
  if( Serial.available() ) {
    cmd = Serial.read();
    Serial.println(cmd);
    switch(cmd) 
    {
      
      case '1':
       MOTOR.Car_forward(250);
        Serial.println(reply);
        break;
      case '2':
     MOTOR.Car_back(250);
        Serial.println(reply);
        break;
      case '3':
         MOTOR.Car_left(250);
           Serial.println(reply);
        break;
      case '4':
       MOTOR.Car_right(250);
        Serial.println(reply);
        break;
    case '5':
       MOTOR.Car_stop();
       Serial.println(reply);
       break;

    }
    delay(1000);
  }
 
}
 



