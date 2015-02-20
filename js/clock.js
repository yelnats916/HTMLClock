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

function showAlarmPopup() {
	$("#mask").removeClass("hide");
	$("#popup").removeClass("hide");	
}

function hideAlarmPopup() {
	$("#mask").addClass("hide");
	$("#popup").addClass("hide");	
}



function insertAlarm(hours, mins, ampm, alarmName) {
	var div = $("<div>");
	var name = $("<div>");
	var time = $("<div>");
	
	$(div).addClass(".flexable");
	
	name.addClass("name");
	name.html(alarmName);
	name.appendTo(div);
	
	time.addClass("time");
	time.html("" + hours + ":" + mins+ " " + ampm);
	
	$(div).append(name);
	$(div).append(time);
	
	$("#alarms").append(div);
	
	var deleteButton = $("<input type=\"button\" value=\"Delete\">");
	deleteButton.click(function() {
		deleteAlarm(hours, mins, ampm, alarmName);
	});
	
	$("#alarms").append(deleteButton);	
}

function addAlarm(username) {
        var hours = $("#hours option:selected").text();
        var mins = $("#mins option:selected").text();
        var ampm = $("#ampm option:selected").text();
        var alarmName = $("#alarmName").val();


        var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
        alarmObject.save({"hours": hours, "mins": mins, "ampm": ampm, "alarmName": alarmName, "username": username}, {
                success: function(object) {
                        insertAlarm(hours, mins, ampm, alarmName);
                        hideAlarmPopup();
                }
    });
}


function deleteAlarm(hours, mins, ampm, alarmName) {
	var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);
	
	query.equalTo("hours", hours);
	query.equalTo("mins", mins);
	query.equalTo("ampm", ampm);
	query.equalTo("alarmName", alarmName);
	
	query.find({
		success: function(results) {
			var toDelete = results[0];
			toDelete.destroy({
				success: function(toDelete) {				
					getAllAlarms(); 
				}
			});
		}
	});
	
	$("#" + this.document.activeElement.alarmName).parent().parent().remove(); 
}

function getAllAlarms(username) {
        $("#alarms").html("");
        Parse.initialize("EKs3E7ICtmGoA5G8gLv9WJrYIsSnwwD1WTnMh9bZ", "mviQyXcG2mPvGlICGcfIMfb3eAVVeelqwvGP8OnS");

        var AlarmObject = Parse.Object.extend("Alarm");
        var query = new Parse.Query(AlarmObject);
        query.equalTo("username", username);
        query.find({
                success: function(results) {
                        console.log(results);

                        for (var i = 0; i < results.length; i++) {
                                insertAlarm(results[i].get("hours"),
                                                        results[i].get("mins"),
                                                        results[i].get("ampm"),
                                                        results[i].get("alarmName"));
                        }
                }
        });
}


function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
     gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({'userId': 'me'});
        request.execute(function(resp) {
          getAllAlarms(resp.id);
          $("#addAlarm").on('click', function() {
                addAlarm(resp.id)
          });
        });
      });

     document.getElementById('signinButton').setAttribute('style', 'display: none');
  } else {
    $('#alarms').children().remove()
     //"user_signed_out" - User is signed-out
    // "access_denied" - User denied access to your app
    // "immediate_failed" - Could not automatically log in the user
     console.log('Sign-in state: ' + authResult['error']);
  }
}


setInterval(getTime, 100);
