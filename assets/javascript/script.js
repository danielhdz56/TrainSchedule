//Global Variables
var database;
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
//Creating an instance of firebase
database = firebase.database();
//Where I am going to store the data
var ref = database.ref('TrainData');
$('#submitBtn').on('click', function(){
	event.preventDefault();
	var data = {
		trainName: $('#trainName').val().trim(),
		destination: $('#destination').val().trim(),
		trainTime: $('#trainTime').val().trim(),
		frequency: $('#frequency').val().trim()
	}
	ref.push(data);
	//This retrieves the data from firebase by binding an event called value and running two callback functions
	//A success and error 
	ref.on('value', gotData, errData);
	$('#trainForm')[0].reset();
});
function gotData(data) {
	//console.log(data.val());
	var trainData = data.val();
	//This basically makes every form submission have an iterator starting at 0
	var keys = Object.keys(trainData);
	console.log(keys);
}
function errData(err) {
	console.log('Error');
	console.log(err)
}