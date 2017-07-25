var intervalId;
var counter = 0;
function militaryToStandard(militaryTime){
	//Converts to standard time
	//First I convert to array, spliting it by the ':'
	var militaryTimeArr = militaryTime.split(':');
	//I then get indexes that match the hours and minutes
	var militaryHours = Number(militaryTimeArr[0]);
	var militaryMinutes = Number(militaryTimeArr[1]);
	//I make a global variable to use within my if statement
	var standardTime;
	if (militaryHours > 0 && militaryHours <= 12) { //do nothing if between 0 and 12 (including 12)
		if (militaryHours > 0 && militaryHours < 10) {
			standardTime = "0";
		}
		else {
			standardTime = "";
		}
		standardTime += militaryHours;
	} else if (militaryHours > 12) { //subtract 12 if greater than 12
		if (militaryHours < 22) {
			standardTime = "0";
		}
		else {
			standardTime = "";
		}
		standardTime += (militaryHours - 12);
	} else if (militaryHours == 0) { //change to 12 if equals 0 
	  	standardTime = "12";
	}
	standardTime += (militaryMinutes < 10) ? ":0" + militaryMinutes : ":" + militaryMinutes;  // get militaryMinutes
	standardTime += (militaryHours >= 12) ? " P.M." : " A.M.";  // get AM/PM
	// show
	return standardTime;
}
function subtractMilitaryTimesMinutes(minuendTime, subtrahendTime){
	var minuendTimeArr = minuendTime.split(':');
	var minuendHours = Number(minuendTimeArr[0]);
	var minuendMinutes = Number(minuendTimeArr[1]);
	var subtrahendTimeArr = subtrahendTime.split(':');
	var subtrahendHours = Number(subtrahendTimeArr[0]);
	var subtrahendMinutes = Number(subtrahendTimeArr[1]);
	var differenceHours = minuendHours - subtrahendHours;
	if(minuendHours <= subtrahendHours) {
		differenceHours = differenceHours + 24;
	}
	var differenceMinutes = (minuendMinutes - subtrahendMinutes) + (differenceHours * 60);
	return differenceMinutes;
}
// Transforms user input into military time
$('.timepicker').timepicker({
    timeFormat: 'HH:mm',
    interval: 60,
    minTime: '00:00',
    maxTime: '23:59',
    startTime: '10:00',
    dynamic: false,
    dropdown: false,
    scrollbar: false
});
// Initialize Firebase
var config = {
	apiKey: "AIzaSyAlK7n7MIDiYtkY6DUFejIibWAX07Vq2Ck",
	authDomain: "trainschedule-171f1.firebaseapp.com",
	databaseURL: "https://trainschedule-171f1.firebaseio.com",
	projectId: "trainschedule-171f1",
	storageBucket: "",
	messagingSenderId: "526326343076"
};
firebase.initializeApp(config);
//Creating an instance of firebase to reference
var database = firebase.database();
var ref = database.ref('trainSchedule');
//Getting a snapshot of the local data
// This function allows me to update the page in real-time when the firebase database changes.
ref.on('value', function(snapshot){
	//This will stop the active timer
	//Note it is better to do it here incase there is a change from firebase
	clearInterval(intervalId);
	//This empties out schedule
	$('#trainBody').empty();
	//Gets current Military Time 
	var currentTime = new Date($.now());
	//This also handles for a leading zero in the minutes
	var actualTime = currentTime.getHours() + ':' + (currentTime.getMinutes()<10?'0':'') + currentTime.getMinutes();
	//This will return an object with all train schedules 
	var trainSchedule = snapshot.val();
	//This will give me an array of all the keys in the javascript object
	var keys = Object.keys(trainSchedule);
	function timerMinute() {
		intervalId = setInterval(updateMinutesAway, 1000*60);
	}
	function updateMinutesAway(){
		$('.minutesAway').remove();
		currentTime = new Date($.now());
		actualTime = currentTime.getHours() + ':' + (currentTime.getMinutes()<10?'0':'') + currentTime.getMinutes();
		for (var j = 0; j <keys.length; j++) {
			k = keys[j];
			trainMinutesAway = subtractMilitaryTimesMinutes(trainSchedule[k].trainTime, actualTime);
			trainDataMinutesAway = $('<td>');
			$(trainDataMinutesAway).addClass('minutesAway').append(trainMinutesAway);
			$('#'+j).append(trainDataMinutesAway);
		}
	}
	timerMinute();
	for (var i = 0; i <keys.length; i++) {
		var k = keys[i];
		var trainName = trainSchedule[k].trainName;
		var destination = trainSchedule[k].destination;
		var trainTime = trainSchedule[k].trainTime;
		trainTime = militaryToStandard(trainTime);
		var frequency = trainSchedule[k].frequency;
		var trainMinutesAway = subtractMilitaryTimesMinutes(trainSchedule[k].trainTime, actualTime);
		var trainRow = $('<tr>');
		trainRow.attr('id', i);
		//trainName
		var trainDataName = $('<td>');
		$(trainDataName).append(trainName);
		$(trainRow).append(trainDataName);
		$('#trainBody').append(trainRow);
		//destination
		var trainDataDestination = $('<td>');
		$(trainDataDestination).append(destination);
		$(trainRow).append(trainDataDestination);
		$('#trainBody').append(trainRow);
		//frequency
		var trainDataFrequency = $('<td>');
		$(trainDataFrequency).append(frequency);
		$(trainRow).append(trainDataFrequency);
		$('#trainBody').append(trainRow);
		//trainTime
		var trainDataTime = $('<td>');
		$(trainDataTime).append(trainTime);
		$(trainRow).append(trainDataTime);
		$('#trainBody').append(trainRow);
		//trainMinutes Away
		var trainDataMinutesAway = $('<td>');
		$(trainDataMinutesAway).addClass('minutesAway').append(trainMinutesAway);
		$(trainRow).append(trainDataMinutesAway);
		$('#trainBody').append(trainRow);
	}
});
$('#submitBtn').on('click', function(event) {
	//prevent form from trying to submit
	event.preventDefault();
	
	//Get the input values
	var trainName = $('#trainName').val().trim();
	var destination = $('#destination').val().trim();
	var trainTime = $('#trainTime').val().trim();
	var frequency = $('#frequency').val().trim();
	//Whenever I submit the form, I create a js object and it has the data that I want
	var data = {
		trainName: trainName,
		destination: destination,
		trainTime: trainTime,
		frequency: frequency
	}
	//I then access the reference of where I am going to place that data
	var ref = database.ref('trainSchedule');
	ref.push(data);
	$('#trainForm')[0].reset();
});