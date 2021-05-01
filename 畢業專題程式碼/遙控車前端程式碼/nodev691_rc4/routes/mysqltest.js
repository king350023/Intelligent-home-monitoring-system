var mysqlfuns = require('./mysqlfuns.js');


// 資料儲存測試
var d = new Date();
console.log(d);
var temp = (25.0 + Math.random()*2).toFixed(1);  
var humid = (60.0 + Math.random()*5).toFixed(1);
mysqlfuns.savedata(d, temp, humid, showstatus);


// 資料查詢測試
n=10;
mysqlfuns.querydata(n, displayresult);



// 資料刪除測試
n=1;
mysqlfuns.deletedata(n, showstatus);


// callback function1
function showstatus(message)
{
	console.log(message.dbstatus);
	console.log(message.result);
}

// callback function2
function displayresult(message)
{
	console.log(message.dbstatus);
	qdata = message.result;
	for(i=0; i<qdata.length; i++)
	{
		console.log(qdata[i]['timestamp'].toLocaleString());
		console.log(qdata[i]['temperature']);
		console.log(qdata[i]['humidity']);
	}
		
}

