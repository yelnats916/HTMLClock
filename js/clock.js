"use script"
window.onload = getTime();
window.onload = getTemp();
function getTime() {
  var clockDivElement = document.getElementById("clock");
  var d = new Date();
  clockDivElement.innerHTML = d.getHours() + ": " + 
  	d.getMinutes() + ": " + d.getSeconds();
}

function getTemp() {
  
  $.ajax({
    url: "https://api.forecast.io/forecast/532b8d8cb00fde6b2cd56ab58fee0a43/35.300399,-120.662362?callback=?",
    type: "GET",
	dataType: "json",
	success: function(data) {
	
		console.log("I WAS SUCCESSFUL!")
		console.log(data.daily.icon)
	
		var temp = data.daily.data[0].temperatureMax
		$("#forecastLabel").html(data.daily.summary)
		$("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png")
		
		var dynamicTempClass;
		if (temp >= 90) {
			dynamicTempClass = "coldclass";
		} else if (temp >= 80) {
			dynamicTempClass = "warmclass";
		} else if (temp >= 70) {
			dynamicTempClass = "niceclass";
		} else if (temp >= 60) {
			dynamicTempClass = "chillyclass";
		} else {
			dynamicTempClass = "coldclass";
		}
		
		$("body").attr("class", dynamicTempClass);
	}
  })
}
setInterval(getTime, 100);
