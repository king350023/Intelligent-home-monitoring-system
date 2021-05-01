var com = require("serialport");
var serialport = new com.SerialPort("/dev/ttyACM0",{
	baudrate: 9600, 
	parser: com.parsers.readline("\n")
});

var stdin = process.stdin;
stdin.setEncoding('utf8');
serialport.on("open",function(){
	console.log("Serial Port is opened");  
	console.log("Input the command");
    
	serialport.on("data",function(d){
      		var result = d.split(','); // split the string into an array
      		console.log("The command is: ", result[0]); // result[0] is the command
      		if(result[0]=='4') // if the command is '4', 
      		{
      			var  = result[1]; // result[1] is temperature 
      			var  = result[2];// result[2] is humidity
      			console.log("Temperature: ", temperature); // Here, just print the result.
      			console.log("humidity: ", humidity);
      		}
      			
      		
    	});
      		}

	stdin.on("data", function(d){
		var str = d.toString().toLowerCase().trim();
		
		switch(str){
			case '1':
				serialport.write('1');
				break;
			case '2':
			 	serialport.write('2');
			 	break;
			case '3':
				serialport.write('3');
				break;
			case '4':
				serialport.write('4');
				break;
			default:
				console.log("command should be 1~4");
		}
	});
});