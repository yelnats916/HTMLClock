"use script"
window.onload = getTime();
function getTime() {
  var clockDivElement = document.getElementById("clock");
  var d = new Date();
  clockDivElement.innerHTML = d.getHours() + ": " + 
  	d.getMinutes() + ": " + d.getSeconds();
}

setInterval(getTime, 100);