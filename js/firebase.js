// Initialize Firebase
var config = {
	apiKey: "AIzaSyBP6KLfzsYrYfMb66aQKjPaupm_JJT2uHI",
	authDomain: "homepage-events.firebaseapp.com",
	databaseURL: "https://homepage-events.firebaseio.com",
	projectId: "homepage-events",
	storageBucket: "",
	messagingSenderId: "111058101137"
};
firebase.initializeApp(config);
$(function(){
  readFromFire();
  $('.delete').click(deleteEvent);
});

this.deleteEvent = function(e){
	var box = $(e.target);
	console.log(box.closest('.eventTitle').html());
}.bind(this);


var db = firebase.database();
var events = db.ref("events");
var eventsList;
events.on("value", function(snapshot) {
  eventsList = (snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function writeToFire(){
	var title = $('#eventName').val();
	var date = $('#eventDate').val();
	var time = $('#eventTime').val();
	var desc = $('#eventBody').val();
	events.child(date+"-"+time+"-"+title).set({
		title: title,
		date: date,
		time: time,
		description: desc,
	});
	readFromFire();
	$('#eventName').val("");
	$('#eventDate').val("");
	$('#eventTime').val("");
	$('#eventBody').val("");
}

function readFromFire(){
	
	var query = events.orderByValue();
	query.once("value")
	  .then(function(snapshot) {
	  	$('#todo-container').html("");
	    snapshot.forEach(function(child) {
			var title = child.child("title").val();
			var date = child.child("date").val();
			var time = child.child("time").val();
			var description = child.child("description").val();
			$('#todo-container').append(
				$('<span/>').attr('class','todo').append(
					$('<span/>').attr('class','eventHead').html(title)
				).append(
					$('<span/>').attr('class','eventDate').html(date)
				).append(
					$('<span/>').attr('class','eventTime').html(time)
				).append(
					$('<span/>').attr('class','eventBody').html("- "+description)
				).append(
					$('<span/>').attr('class','delete').click(deleteEvent).html('×')
				)
			);
	    });
	});
    // $('.delete').click(deleteEvent);
	hideModal();
}

var deleteEvent = function(e){
	var box = $(e.target);
	var key = box.parent().find('.eventDate').html()+"-"+box.parent().find('.eventTime').html()+"-"+box.parent().find('.eventHead').html();
	events.child(key).remove();
	readFromFire();
}.bind(this);
