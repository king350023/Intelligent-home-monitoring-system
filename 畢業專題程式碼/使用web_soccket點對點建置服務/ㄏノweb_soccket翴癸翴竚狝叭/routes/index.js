// javascript和C一樣使用//表示單行註解，使用/* */表示多行註解
// 載入express模組 
var express = require('express');
/* 使用express.Router類別來建立可裝載的模組路由的物件
   路由是指應用程式端點 (URI) 的定義，以及應用程式如何回應用戶端的要求。*/
var router = express.Router();

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

// 取得Server端的ip，請記得在專案中安裝underscore模組: npm install underscore
var sip = require('underscore')
    .chain(require('os').networkInterfaces())
    .values()
    .flatten()
    .find({family: 'IPv4', internal: false})
    .value()
    .address;
console.log('Server IP='+sip);

//*************************************************************************************
//*************************** 模擬產生感測器資料之RESTful API**************************
//*************************************************************************************
router.get('/get_sensors', function(req, res){
	var temp = (25.0 + (Math.random()*2)).toFixed(2); //限制小數點後只顯示2位
	var humid = (60.0 + (Math.random()*5)).toFixed(2); //限制小數點後只顯示2位
	var ph =  (7.0 + (Math.random()*3)).toFixed(2); //限制小數點後只顯示2位
	var sensor_values = {'temperature':temp, 'humidity':humid, 'ph':ph};
	console.log(sensor_values);
	res.send(sensor_values);
});


//*************************************************************************************
//*************************** 模擬產生感測器資料之RESTful API**************************
//*************************************************************************************

module.exports = router;