//設定開關 pin、蜂鳴器 pin 、紅綠 LED pin 
const int switchPin = 2; 
const int piezoPin = 4; 
const int redLed = 7; 
const int greenLed = 8; 
  
// 設定 pinMode，只有開關裝置為 INPUT 
} 
void setup(){ 
pinMode(switchPin,INPUT); 
pinMode(piezoPin,OUTPUT); 
pinMode(redLed,OUTPUT); 
pinMode(greenLed,OUTPUT); 
  
// 設計一個警告裝置，當右側的開關連接時，綠色 LED 會發光 
// 表示目前為安全狀態 
// 當右側段開時，蜂鳴器會發出警報聲，同時紅色 LED 燈會快速閃爍
void loop(){ 
// 讀取開關狀態開 = 0V/關=5V 
int switchState = digitalRead(switchPin); 
// 當兩線接在一起時，開關狀態 = 5V (HIGH)，使綠色 LED 燈亮起 
if (switchState == HIGH){ 
   digitalWrite(greenLed,HIGH); 
} 
// 當兩線分開時，開關狀態 0V (LOW)，紅色LED 閃爍+蜂鳴器發聲 
else if (switchState == LOW){ 
   tone(piezoPin,650,230); 
   delay(230); 
   noTone(piezoPin);  
   digitalWrite(greenLed,LOW);
   blinkLed();  // 呼叫閃爍 LED function 
   tone(piezoPin,1550,100); 
   delay(100); 
   noTone(piezoPin); 
  
}  
} 
  
// 紅色 LED 快速閃爍的 function 
void blinkLed(){  
digitalWrite(redLed,HIGH); 
delay(10); 
digitalWrite(redLed,LOW); 
delay(10); 
} 
