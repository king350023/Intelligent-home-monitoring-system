#include <ld3320.h>

VoiceRecognition Voice;                         //聲明一個語音識别對象

#define electric 8                                   
#define LED 10
#define Light 7
#define Smart 2

void setup() 
{
    Serial.begin(115200); 
    pinMode(electric,OUTPUT);                        //初始化electric pin脚為輸出模式
    pinMode(Light,OUTPUT);                          //初始化buzzer pin脚為輸出模式
    pinMode(LED,OUTPUT);                            //初始化LED pin脚為輸出模式
    digitalWrite(electric,LOW);                      //electric pin脚低電位
    digitalWrite(Light, LOW);                       //buzzer pin脚低電位
    digitalWrite(LED, LOW);                           //LED pin脚低電位
    Voice.init();                                    //初始化VoiceRecognition模塊   
    Voice.addCommand("jr neng jia dian", Smart);        // 加入語音辨識關鍵字"智能家電"
    Voice.addCommand("kai deng",0);                  //加入語音辨識關鍵字"開燈"
    Voice.addCommand("guan deng",1);                //加入語音辨識關鍵字"關燈"
    Voice.addCommand("kai feng shan",4);            //加入語音辨識關鍵字"開電扇"
    Voice.addCommand("guan feng shan",5);          //加入語音辨識關鍵字"關風扇"
    Voice.addCommand("ni hao",2);                   //加入垃圾詞彙
    Voice.addCommand("wei",3);                      //加入垃圾詞彙
    Voice.addCommand("gan",6);                   //加入垃圾詞彙
    Voice.addCommand("ha ha",7);                   //加入垃圾詞彙
    Serial.println("Test Start");                    //用來偵錯的
    Voice.start();                                  //開始識别
    
}
void loop()
{
 int SmartTime;
 switch (Voice.read())            // 語音識別函式
 {
 case Smart:
  Serial.println("智能家電");        // 用來偵錯的  
  for (int i = 0; i < 2; i++)    // 辨識到智能家電後, 蜂鳴器回應跟LED閃爍
  {                              
   digitalWrite(LED, HIGH);
     delay(50);
   digitalWrite(LED, LOW);
     delay(50);
  }
  //--------- 開關可識別區 -----------
  SmartTime = 0;
  while (SmartTime < 3000)               // 開始計時約 3second
  {
   switch (Voice.read())               // 語音識別函式 
   {
    case 0:                            //若是指令“kai chi(開啟)”                
        Serial.println("開燈");           // 用來偵錯的
        digitalWrite(Light,HIGH);   //通電electric  
        SmartTime = 0;                   // 計時計數歸0
        break;
    case 1:                            //若是指令“guan bi(關閉)”
        Serial.println("關燈");          // 用來偵錯的
        digitalWrite(Light,LOW);    //斷電electric
        SmartTime = 0;                   // 計時計數歸0
        break;
    case 2:
        Serial.println("你好");
        break;
    case 3:
        Serial.println("喂");
        break;
    case 4:                            //若是指令“kai chi(開啟)”                
        Serial.println("開風扇");           // 用來偵錯的
        digitalWrite(electric,HIGH);   //通電electric  
        SmartTime = 0;                   // 計時計數歸0
        break;
    case 5:                            //若是指令“guan bi(關閉)”
        Serial.println("關風扇");          // 用來偵錯的
        digitalWrite(electric,LOW);    //斷電electric
        SmartTime = 0;                   // 計時計數歸0
        break;
    case 6:
        Serial.println("幹");
        break;
    case 7:
        Serial.println("哈哈");
        break;
    default:
        break;
   }
   if ((SmartTime % 200) == 0)           // LED閃爍代表目前在開關可識別區
   {
    digitalWrite(LED, HIGH);
   }
   if ((SmartTime % 200) == 100)
   {
    digitalWrite(LED, LOW);
   }
   SmartTime++;                       // 計時計數加1
   delay(1);                        // 計時計數單位1msec, 計數3000次, 大約等於3秒
  }  
  //--------- 開關可識別區 ------------
  break;
 default:
  Serial.println("Not define!");     // 用來偵錯的  
 
  break;
 }
} 

    
    
        
  
