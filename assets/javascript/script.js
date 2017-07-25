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
	//This empties out schedule
	$('#trainBody').empty();
	//This will return an object with all train schedules 
	var trainSchedule = snapshot.val();
	//This will give me an array of all the keys in the javascript object
	var keys = Object.keys(trainSchedule);
	//makes sure to only update the latest one
	for (var i = 0; i <keys.length; i++) {
		var k = keys[i];
		var trainName = trainSchedule[k].trainName;
		var destination = trainSchedule[k].destination;
		var trainTime = trainSchedule[k].trainTime;
		var frequency = trainSchedule[k].frequency;
		var trainRow = $('<tr>');
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
});


