$(function(){

  //Whitehorse var stoURL = "https://api.darksky.net/forecast/e7ea57ca52da5ae872c7c0c343f312be/60.7216,-135.0549?callback=?&units=ca";
	var stoURL = "https://api.darksky.net/forecast/e7ea57ca52da5ae872c7c0c343f312be/43.9713,-79.2468?callback=?&units=ca";
  //Winnipeg var torURL = "https://api.darksky.net/forecast/e7ea57ca52da5ae872c7c0c343f312be/49.884,-97.1686?callback=?&units=ca";
	var torURL = "https://api.darksky.net/forecast/e7ea57ca52da5ae872c7c0c343f312be/43.654,-79.3872?callback=?&units=ca";

	$.getJSON(stoURL, function(data) {
		var icons = new Skycons({"color": $('.button').css('color')});
		icons.set('weathericon-sto', data.currently.icon);
		icons.play();
		$('#stouffville #temperature').html(data.currently.temperature+"°C");
		$('#stouffville #conditions').html(data.currently.summary);
		if(data.currently.apparentTemperature){
			$('#stouffville #feels-like').html("<b>Feels Like: </b>"+data.currently.apparentTemperature.toFixed(1)+"°C");
		}
		else{
			$('#stouffville #feels-like').remove();
		}
    if (!data.alerts) 
      $("#sto-alerts").remove();
    else{
      for (var i = data.alerts.length - 1; i >= 0; i--) {
        $("#alert-body-sto").append($("<span/>").addClass("alert-title").html(data.alerts[i].title)).append($("<br/>")).append($("<br/>"));
        $("#alert-body-sto").append($("<span/>").addClass("alert-body").html(data.alerts[i].description)).append($("<br/>")).append($("<br/>"));
        if (i!=0) {$("#alert-body-sto").append($("<hr>"))}
      }
    }
		$('#stouffville #high').html("<b>H/L: </b>"+data.daily.data[0].temperatureHigh.toFixed(1)+"°C/"+data.daily.data[0].temperatureLow.toFixed(1)+"°C");
		$('#stouffville #wind').html("<b>Wind: </b>"+data.currently.windSpeed+"km/h "+getDirection(data.currently.windBearing));
	});
	$.getJSON(torURL, function(data) {
		var icons = new Skycons({"color": $('.button').css('color')});
		icons.set('weathericon-tor', data.currently.icon);
		icons.play();
		$('#toronto #temperature').html(data.currently.temperature+"°C");
		$('#toronto #conditions').html(data.currently.summary);
		if(data.currently.apparentTemperature){
			$('#toronto #feels-like').html("<b>Feels Like: </b>"+data.currently.apparentTemperature.toFixed(1)+"°C");
		}
		else{
			$('#toronto #feels-like').remove();
		}
    if (!data.alerts) 
      $("#tor-alerts").remove();
    else{
      for (var i = data.alerts.length - 1; i >= 0; i--) {
        $("#alert-body-tor").append($("<span/>").addClass("alert-title").html(data.alerts[i].title)).append($("<br/>")).append($("<br/>"));
        $("#alert-body-tor").append($("<span/>").addClass("alert-body").html(data.alerts[i].description)).append($("<br/>")).append($("<br/>"));
        if (i!=0) {$("#alert-body-tor").append($("<hr>"))}
      }
    }
		$('#toronto #high').html("<b>H/L: </b>"+data.daily.data[0].temperatureHigh.toFixed(1)+"°C/"+data.daily.data[0].temperatureLow.toFixed(1)+"°C");
		$('#toronto #wind').html("<b>Wind: </b>"+data.currently.windSpeed+"km/h "+getDirection(data.currently.windBearing));
	});
});

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};


function getDirection(bearing)
{
  var directions = [
  	[0, 22.5],
  	[22.5, 67.5],
  	[67.5, 112.5],
  	[112.5, 157.5],
  	[157.5, 202.5],
  	[202.5, 247.5],
  	[247.5, 292.5],
  	[292.5, 337.5],
  	[337.5, 360]
  ];

  var arrows = ["↓","↙","←","↖","↑","↗","→","↘","↓"];
  var x = 0;
  var arrow = "";
  directions.forEach(function(dir){
  	if (bearing>=dir[0] && bearing<dir[1]) {
  		// console.log(arrows[x]);
  		arrow =  arrows[x];
  	}
  	x++;
  });
  return arrow;
}

