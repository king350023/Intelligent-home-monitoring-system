#include <dht11.h>
dht11 DHT11;
const byte dataPin = 2;
const int COAOUTpin=A0;
const int CODOUTpin=3;
const int GASAOUTpin=A1;
const int GASDOUTpin=4;
const int buzzer=6;
int tem=0;
int gas=0;
int co=0;
const int elc=7;
int COvalue;
int GASvalue;
char reply[4];
const byte RLED = 10;
const byte GLED = 9;
const byte YLED = 8;
char cmd;     		// 儲存接收資料的變數，採字元類型
void setup() {
  pinMode(RLED, OUTPUT);
  pinMode(GLED, OUTPUT);
  pinMode(YLED, OUTPUT);
  pinMode(elc, OUTPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(CODOUTpin, INPUT);
  pinMode(GASDOUTpin, INPUT);
  digitalWrite(elc, LOW);
  digitalWrite(buzzer, LOW);
  Serial.begin(9600);
  Serial.println("Welcome to Arduino!");
}

void loop() {
  
COvalue = analogRead(COAOUTpin);
  GASvalue = analogRead(GASAOUTpin);
  int chk = DHT11.read(dataPin);
  if( Serial.available() ) {
    cmd = Serial.read();
    switch(cmd) 
    {
      case '1':
        digitalWrite(YLED, HIGH);
        delay(500);
        digitalWrite(YLED, LOW);
        delay(500);
        sprintf(reply,"%c",'1');
        Serial.println(reply);
        break;
      case '2':
        sprintf(reply,"%c,%d",'2',GASvalue);
        Serial.println(reply);
        break;
      case '3':
        sprintf(reply,"%c,%d",'3',COvalue);
        Serial.println(reply);
        break;
      case '4':
        sprintf(reply,"%c,%d,%d",'4',(int)DHT11.temperature,  (int) DHT11.humidity);
        Serial.println(reply);
        break;
    }
  }
    temfan();
    gasbuzzer();
    cobuzzer();
}

void temfan(){
    tem=DHT11.temperature;
      if(tem>23)
     {
       digitalWrite(elc, HIGH);
     }
    else
     {
       digitalWrite(elc, LOW);
     } 
   }

  void gasbuzzer(){
     if(GASvalue>700)
      {
         tone(buzzer,650,230);
         delay(230);
         noTone(buzzer);
         tone(buzzer,1150,100);
         delay(100);
         noTone(buzzer);
      }
    else
      {
        digitalWrite(buzzer, LOW);
      }
   }

  void cobuzzer(){
    if(COvalue>150)
      {
        tone(buzzer,650,230);
        delay(230);
        noTone(buzzer);
        tone(buzzer,1150,100);
        delay(100);
        noTone(buzzer);
      }
    else
      {
       digitalWrite(buzzer, LOW);
      }
   }
