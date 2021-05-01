//*****************************************************************
//  利用城市之woeid透過呼叫Yahoo Weather API查詢城市天氣資訊之函數
//*****************************************************************
module.exports.ywq_json = ywq_json;

// 定義ywq_json(woeid, cb)函數，cb為其callback函數
function ywq_json(woeid, cb)
{
	var request = require('request');
	var querystring = require('querystring');
	// create the url for querying yahoo weather API
	baseurl = 'https://query.yahooapis.com/v1/public/yql?';
	yql_query = 'select * from weather.forecast where woeid=' + woeid;
	//console.log(yql_query);
	yql_url = baseurl + querystring.stringify({'q':yql_query}) + '&format=json';
	console.log(yql_url);
	//
	request(
		{
			url: yql_url,
			method: 'GET'
		},
		function (err, response, body){
			if (err) 
				console.log(err);
			else 
			{
				try
				{
					console.log(body);
					// 將回傳的JSON字串轉成javascript的JSON物件
					sdata = JSON.parse(body);
					// 取出城市、溫度、濕度、天氣狀況及建立時間等資訊
					// 取得城市名稱
					city = sdata['query']['results']['channel']['location']['city'];
					console.log(city);
					// 取得相對溼度
					humidity = sdata['query']['results']['channel']['atmosphere']['humidity'];
					console.log(humidity);
					// 取得華氏溫度
					temperature = sdata['query']['results']['channel']['item']['condition']['temp'];
					// 換算成攝氏溫度，只取到小數2位
					degreeC = ((Number(temperature)-32.0)*5/9).toFixed(2);
					console.log(degreeC);
					// 取的天氣狀況
					condition = sdata['query']['results']['channel']['item']['condition']['text'];
					console.log(condition);
					// 取得天氣資訊建立時間
					date = sdata['query']['results']['channel']['item']['condition']['date'];
					console.log(date);
					//
					var htemps=[];
					var ltemps=[];
					// 取得華氏溫度
					for(i=0; i<=9; i++)
					{
						tempHigh = sdata['query']['results']['channel']['item']['forecast'][i]['high'];
						htemps.push(((Number(tempHigh)-32.0)*5/9).toFixed(2));
						tempLow = sdata['query']['results']['channel']['item']['forecast'][i]['low'];
						ltemps.push(((Number(tempLow)-32.0)*5/9).toFixed(2));		
					}
					// 建立城市簡單天氣資訊之JSON物件
					city_data = {'city':city, 'degreeC':degreeC, 'humidity':humidity, 'condition':condition, 'date':date, 'high':htemps, 'low':ltemps};
					cb(city_data);
				}
				catch(ex)
				{
					console.log(ex.toString());
					city_data = {};
					cb(city_data);
				}
			}
				
		}
	); 
}

