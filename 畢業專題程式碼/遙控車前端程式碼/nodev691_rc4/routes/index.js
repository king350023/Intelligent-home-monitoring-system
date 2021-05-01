// 蔡杰恩javascript和C一樣使用//表示單行註解，使用/* */表示多行註解
var IntervalId, monitoringstatus="stop";
var request = require('request'); // 匯入request模組
var dateformat=require('dateformat'); //匯入dateformat模組

module.exports = function(io){
	// 此處擺放處理web socket通訊的程式碼
	io.on('connection', function(socket) {
		// 設定每個1秒發送date事件夾帶目前時間資訊JSON訊息給Client端(瀏覽器)
		setInterval(function() {
			// 建立格式如2016-12-04 21:17:58之日期字串
			var datestring = dateformat(Date().toString(), "yyyy-mm-dd HH:MM:ss"); 
			// 透過發送currenttime事件的方式將日期字串發給前端網頁
			socket.emit('currenttime', {'date': datestring});
		}, 1000);
	});
// 載入express模組 
var express = require('express');
/* 使用express.Router類別來建立可裝載的模組路由的物件
   路由是指應用程式端點 (URI) 的定義，以及應用程式如何回應用戶端的要求。*/
var router = express.Router();
//載入socket.io
// 載入serialport模組並建立串列埠物件serialport (預設serial port也會被打開)
var com = require('serialport');
var serialport = new com.SerialPort("/dev/ttyACM0",{
	baudrate: 9600,  // 設定串列埠之傳輸速度為9600 bit/sec
	parser: com.parsers.readline("\n") // 設定列的結束符號為\n
	}, function (err) {
		if (err) 
			console.log('Error: ', err.message);
		else
			console.log("Serial Port is opened"); 
    });

// 載入request, querystring, serialport模組
var request = require('request');
var querystring = require('querystring');




// 取得Server端的ip，請記得在專案中安裝underscore模組: npm install underscore
var sip = require('underscore')
    .chain(require('os').networkInterfaces())
    .values()
    .flatten()
    .find({family: 'IPv4', internal: false})
    .value()
    .address;
console.log('Server IP='+sip);
// 建造傳回給各網頁(.ejs)的伺服器ip物件，分成4部分:
//<例如：server ip=10.0.2.205，則serverip0=10, serverip1=0, serverip2=2, serverip3=205  -->
sip_array = sip.split('.');
reply_obj = {serverip0: sip_array[0], serverip1: sip_array[1], serverip2: sip_array[2], serverip3: sip_array[3]};

// 建立Web Video Streaming的狀態儲存檔wvs_status.txt(初始值為off)
fs = require('fs');
fs.writeFileSync('./wvs-status.txt', 'off');
console.log('The wvs-status.txt is created!');

// 建立Web Video Streaming的pid儲存檔wvs_pid.txt(初始值為0)
fs = require('fs');
fs.writeFileSync('./wvs-pid.txt', '0');
console.log('The wvs-pid.txt is created!');

fs = require('fs');
fs.writeFileSync('./alert-emails.txt', 'ddcop5120@gmail.com');
console.log('The alert_emails.txt is created!');

//**************************************************************************
//************ 根據Client端送來之請求命令顯示相對應網頁之方法 ************
//**************************************************************************
// 建立(附加)一個客戶端對應用程式提出 GET / 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他GET不同路徑的路由處理方法
// 顯示首頁
serverip_obj = {serverip:sip};

router.get('/', function(req, res) {
	res.render('index');
});

// 顯示數學服務操作介面
router.get('/air', function(req, res) {
	res.render('air');
});

// 顯示樂透服務操作介面
router.get('/callserviceapis', function(req, res) {
	res.render('callserviceapis');
});

// 顯示天氣查詢服務操作介面
router.get('/weather', function(req, res) {
	res.render('weather');
});

// 顯示資料收集與查詢服務操作介面
router.get('/data_collection', function(req, res) {
	res.render('data-collection');
});
router.get('/voice', function(req, res) {
	res.render('voice');
});

// 顯示遠端監控服務操作介面
router.get('/remotecontrol', function(req, res) {

	// 讓遠端監控網頁載入時，就顯示影像串流
	// 讀取Web Video Streaming的狀態
	fs=require('fs');
    wvs_status = fs.readFileSync('./wvs-status.txt','utf8'); 
	
    // 若影像串流關閉著，則啟動影像串流
	if(wvs_status=='off')
	{
		exec = require('child_process').exec;
		web_vs = exec('python3 ./web-vs-server.py', shell=false);
		wvs_pid = web_vs.pid+1;
		console.log('pid='+wvs_pid);
		
		// 將pid of Web Video Streaming存入檔案中
		fs = require('fs');
		fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
		
		// 將on存入Web Video Streaming的狀態檔中
		fs = require('fs');
		fs.writeFileSync('./wvs-status.txt', 'on'); 
		console.log('The pid and status of web video streaming is saved!');
	}
	// 然後顯示遠端監控網頁
	res.render('remotecontrol', reply_obj);
});




//*****************************************************************************************
//*********************** 使用Yahoo API查詢天氣狀況之服務方法 *****************************
//*****************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /weather/:woeid 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/weather/:woeid', function(req, res){
	woeid=req.params.woeid;
	console.log(woeid);
	// 引用相同目錄(routes)下的ywq-json.js
	var ywq = require('./ywq-json.js');
	ywq.ywq_json(woeid, handle_citydata);
	
	// define the callback function the for the function ywq_json(woeid, cb)
	function handle_citydata(city_data){
		res.send(city_data);	
	}
});



router.post('/store_email/:email', function(req, res){
	email=req.params.email;
	emails="ddcop5120@gmail.com" + " " + email; //預設第1個為我的Gmail帳號
	// 將emails清單字串存alert_emails.txt中
	fs = require('fs');
	fs.writeFileSync('./alert-emails.txt', emails);
	//	
	message = {"message": emails};
	console.log(message.message);
	res.send(message);
});
//**************************************************************************************************
//************************* 啟動與關閉即時網頁視訊串流之服務方法 ***********************************
//**************************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /web_video_streaming/:cmd 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/web_video_streaming/:cmd', function(req, res){
	cmd=req.params.cmd;
	if(cmd=='on')
	{
		// 讀取Web Video Streaming的狀態
		fs=require('fs');
		wvs_status = fs.readFileSync('./wvs-status.txt','utf8'); 
		
		//
		if(wvs_status=='off')
		{
			exec = require('child_process').exec;
			web_vs = exec('python3 ./web-vs-server.py', shell=false);
			wvs_pid = web_vs.pid+1;
			console.log('pid='+wvs_pid);
			
			// 將pid of Web Video Streaming存入檔案中
			fs = require('fs');
			fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
			
			// 將on存入Web Video Streaming的狀態檔中
			fs = require('fs');
			fs.writeFileSync('./wvs-status.txt', 'on'); 
			console.log('The pid and status of web video streaming is saved!');
		}
		// 回傳訊息給網頁端
		message={'message':'網頁即時影像串流已經開啟!'};
		res.set({
			'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
		});
		res.send(message);
	}
  
	if(cmd=='off') 
	{
		// 讀取Web Video Streaming的狀態
		fs=require('fs');
		wvs_status=fs.readFileSync('./wvs-status.txt','utf8');
		
		//
		if(wvs_status=='on')
		{
			// 讀取pid of Web Video Streaming
			fs=require('fs');
			wvs_pid=fs.readFileSync('./wvs-pid.txt','utf8');
			
			// 透過pid關閉(殺掉)Web Video Streaming
			exec = require('child_process').exec;
			exec('sudo kill ' + wvs_pid);
			console.log('The ' + wvs_pid + ' process is killed!');
			
			// 將off存入Web Video Streaming的狀態檔中
			fs = require('fs');
			fs.writeFileSync('./wvs-status.txt', 'off');
		}
			
		// 回傳訊息給網頁端
		message={'message':'網頁即時影像串流已經關閉!'};
		res.set({
			'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
		});
		res.send(message);
	}
});




router.post('/take_picture', function(req, res){
  
	// 讀取Web Video Streaming的狀態
	fs=require('fs');
    wvs_status=fs.readFileSync('./wvs-status.txt','utf8');
	
	// 若影像串流開著，先把它關掉
	if(wvs_status=='on')
	{
		// 讀取pid of Web Video Streaming
		fs=require('fs');
		wvs_pid=fs.readFileSync('./wvs-pid.txt','utf8');
		
		// 透過pid關閉(殺掉)Web Video Streaming
		exec = require('child_process').exec;
		exec('sudo kill ' + wvs_pid);
		console.log('The ' + wvs_pid + ' process is killed!');
		// 將off存入Web Video Streaming的狀態檔中
		fs = require('fs');
		fs.writeFileSync('./wvs-status.txt', 'off');
	}
	
	// 建立日期時間字串
	dateformat=require('dateformat'); //匯入dateformat模組
	datestring = dateformat(Date().toString(), "yyyy-mm-dd_HH:MM:ss"); //產生格式如2016-12-04_21:17:58之日期字串
		
	picture_name = 'img' + datestring + '.jpg'; //以時間戳記當作檔名的一部分使檔名具有唯一性
	
	// 開始拍照 (用同步方式進行，以確保在傳送Email之前就有照片了)
	execSync = require('child_process').execSync;
	command = 'sudo raspistill -w 640 -h 480 -o ' + picture_name;
	execSync(command);
	console.log('像片' + picture_name + '已經拍攝!');
	
	// 傳送警訊(含拍攝的照片)Email給主人
	// 讀取警訊接收者emails清單
	fs=require('fs');
	emails=fs.readFileSync('./alert-emails.txt','utf8');
	console.log(emails);
	//
	subject = "入侵警示!";
	email_body = "警告：有人入侵(時間：" + datestring + ")，請看照片!";
	command = 'echo "' + email_body + '" | sudo mutt -s "' + subject + '" -a ' + picture_name.toString() + ' -- ' + emails;
	console.log(command);
	exec = require('child_process').exec;
	exec(command);
	console.log('已傳送警示Emails!');
	
	// 再次打開影像串流
	exec = require('child_process').exec;
	web_vs = exec('python3 ./web-vs-server.py', shell=false);
	wvs_pid = web_vs.pid+1;
	console.log('pid='+wvs_pid);
	// 將pid of Web Video Streaming存入檔案中
	fs = require('fs');
	fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
	
	// 將on存入Web Video Streaming的狀態檔中
	fs = require('fs');
	fs.writeFileSync('./wvs-status.txt', 'on'); 
	console.log('The pid and status of web video streaming is saved!');
	
	// 回傳訊息給網頁端
	message={'message':'已經拍照並傳送警訊電郵!'};
	res.set({
		'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	});
    res.send(message);

});



//*************************************************************************************
//*************************** 控制Arduino之服務方法 ***************************
//*************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /read_dht11 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/control_arduino/:cmd', function(req, res){
	cmd=req.params.cmd;
	console.log(cmd);
	var count = 0;
	var result = [];
	if(!serialport.isOpen())
	{
		serialport.open(function (err) {
		if (err) 
			console.log('Error: ', err.message);
		else
			console.log("Serial Port is opened"); 
		});
	}
	//
	serialport.write(cmd); // non-blocking
	serialport.drain(); // Waits until all output data has been transmitted to the serial port
	//
	serialport.on("data", readSerialData); 
	
	function readSerialData(data)
	{
		try
		{
			if(count==0)
			{
				count++;
				console.log("count: " + count);
				result = data.split(','); // split the string into an array
				console.log("The command is: ", result[0]); // result[0] is the command
				if(result[0]=='4') // if the command is '4', 
				{
					var temperature = result[1]; // result[1] is temperature 
					var humidity = result[2];    // result[2] is humidity
					console.log("Temperature: ", temperature); // Here, just print the result.
					console.log("Humidity: ", humidity);        
				}
				else
				{
					result.push(0);
					result.push(0);
				}
				message = {"cmd": cmd, "value1":result[1], "value2":result[2]};	
				console.log(message);
				res.send(message);
			}
		}
		catch(ex)
		{
			//console.log(ex.message);
			//message = {"cmd":cmd, "value1":"", "value2":""}
			//res.send(message);
		}
	}
});

//*************************************************************************************
//**** 讀取DHT11溫、溼度，然後儲存於mySQL資料庫，並且取出與回傳資料庫最近10筆紀錄 *****
//*************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /data_collection方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/save_retrieve_thdata', function(req, res){
	var count = 0;
	var result = [];
	if(!serialport.isOpen())
	{
		serialport.open(function (err) {
		if (err) 
			console.log('Error: ', err.message);
		else
			console.log("Serial Port is opened"); 
		});
	}
	//
	serialport.write('4'); // non-blocking，cmd=4 means read temperature and humidity
	serialport.drain(); // Waits until all output data has been transmitted to the serial port
	
	//
	serialport.on("data", readSerialData); 
	
	function readSerialData(data)
	{
		try
		{
			if(count==0)
			{
				count++;
				console.log("count: " + count);
				result = data.split(','); // split the string into an array
				console.log("The command is: ", result[0]); // result[0] is the command
				var temperature = result[1]; // result[1] is temperature 
				var humidity = result[2];    // result[2] is humidity
				console.log("Temperature: ", temperature); // Here, just print the result.
				console.log("Humidity: ", humidity);        
				
				//
				var d = new Date();
				var mysqlfuns = require('./mysqlfuns.js');
				// save the temperature and humidity data
				mysqlfuns.savedata(d, temperature, humidity, showstatus);
				// retrieve and send back the latest 10 records of temperature and humidity data
				mysqlfuns.querydata(10, getresult);
	
				// callback function1
				function showstatus(message)
				{
					console.log(message.dbstatus);
				}

				// callback function2
				function getresult(message)
				{
					console.log(message.dbstatus);
					qdata = message.result;
					res.send(qdata);
				}
			}
		}
		catch(ex)
		{
			console.log(ex.message);
		}
	}
});


router.post('/control_arduino2/:cmd', function(req, res){
	 //取出設備名稱(device)
	var cmd = req.params.cmd;        //取出控制命令(cmd)
	request(
		{
			// 請將以下IP及Port更改為服務所在電腦之網路位址(IP)及服務之連接埠(Port)
			// 以下假設遠端服務部署於本機之3001埠(127.0.0.1:3001)
			url: 'http://172.20.10.2:3000/control_arduino/'+cmd, 
			method: 'POST'
		},
		function (err, response, body){
			if (err)
				res.send(err);
			else 
			{
				// 將回傳的JSON字串轉成javascript的JSON物件
				message = JSON.parse(body);
				console.log(message);
				// JSON物件傳回給網頁
				res.send(message);
			}
				
		}
	); 
});

router.get('/web_video_streaming2/cmd:', function(req, res){
	 //取出設備名稱(device)
	var cmd = req.params.cmd;        //取出控制命令(cmd)
	request(
		{
			// 請將以下IP及Port更改為服務所在電腦之網路位址(IP)及服務之連接埠(Port)
			// 以下假設遠端服務部署於本機之3001埠(127.0.0.1:3001)
			url: 'http://172.20.10.2:8000/web_video_streaming/'+cmd,
			method: 'GET'
		},
		function (err, response, body){
			if (err)
				res.send(err);
			else 
			{
				// 將回傳的JSON字串轉成javascript的JSON物件
				message = JSON.parse(body);
				console.log(message);
				// JSON物件傳回給網頁
				res.send(message);
			}
				
		}
	); 
});


module.exports = router;

//*************************************************************************************
	//*************************** 模擬產生感測器資料之RESTful API**************************
	//*************************************************************************************
	//router.get('/get_sensors/:ip/:port', function(req, res, next){
router.get('/get_sensors/:cmd', function(req, res, next){
		var cmd = req.params.cmd;  //取出控制命令(cmd)
		console.log(cmd)
		if (cmd == 'start' && monitoringstatus=="stop")
		{
			monitoringstatus="start";
			IntervalId = setInterval(function() { // 啟動每秒呼叫遠端Sensor一次
				request(
					{  // 請將以下IP及Port更改為服務所在電腦之網路位址(IP)及服務之連接埠(Port)
					   // 以下假設遠端服務部署於本機之3001埠(127.0.0.1:3001)
						url: 'http://127.20.10.5:3001/get_sensors', 
						method: 'GET'
					}, 
					function (err, response, body){
						if (err)
						{
							sensor_values = {"temperature":"0","humidity":"0","ph":"0"};
							console.log(sensor_values);
							io.emit('envdata', sensor_values);
						}
						else 
						{
							//將回傳的JSON字串轉成javascript的JSON物件
							sensor_values = JSON.parse(body);
							console.log(sensor_values);
							//JSON物件傳回給網頁
							io.emit('envdata', sensor_values);
						}		
					}
				);
			}, 1000);	
			
            res.set(// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
				{
					'charset': 'utf-8'  
				}
			);
			res.send(//傳回一個包含JSON格式狀態訊息給用戶端
				{
					"message": "持續監測環境資訊中!"
				}		
			);			
		}
		if(cmd == 'stop' && monitoringstatus=="start")
		{
			monitoringstatus="stop";
			// 停止setInterval函數的執行
			clearInterval(IntervalId);
			res.set(// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
				{
					'charset': 'utf-8'  
				}
			);
			res.send(//傳回一個包含JSON格式狀態訊息給用戶端
				{
					"message": "停止監測環境資訊!"
				}		
			);
		}
	});


//*************************************************************************************
	//*************************** 模擬產生感測器資料之RESTful API**************************
	//*************************************************************************************
	//router.post('/control_devices/:ip/:port/:device/:cmd', function(req, res){
	router.post('/control_devices/:device/:cmd', function(req, res){
		var device = req.params.device;  //取出設備名稱(device)
		var cmd = req.params.cmd;        //取出控制命令(cmd)
		request(
			{
				// 請將以下IP及Port更改為服務所在電腦之網路位址(IP)及服務之連接埠(Port)
				// 以下假設遠端服務部署於本機之3001埠(127.0.0.1:3001)
				url: 'http://172.20.10.5:3001/control_devices/' + device + '/' + cmd, 
				method: 'POST'
			},
			function (err, response, body){
				if (err)
					res.send(err);
				else 
				{
					// 將回傳的JSON字串轉成javascript的JSON物件
					message = JSON.parse(body);
					console.log(message);
					// JSON物件傳回給網頁
					res.send(message);
				}
					
			}
		); 
	});
	
	return router;
}