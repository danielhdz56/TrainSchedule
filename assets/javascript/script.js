var intervalId;
var haveClicked = false;
var regexTime = /^([01]\d|2[0-3]):?([0-5]\d)$/;
var regexFrequency = /^[1-9]\d*$/;
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
	standardTime += (militaryHours >= 12) ? " PM" : " AM";  // get AM/PM
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
$(document).on('click', '.trashBtn', function(){
	//This allows clients to delete the specific key in firebase
	ref.child($(this).closest('tr').attr('id')).remove();
});
$(document).on('click', '.editBtn', function(){
	var isEditValid = true;
	var isFrequencyNumber = true;
    $("td input").each(function(){
        if ($.trim($(this).val()).length == 0){
            isEditValid = false;
            $(this).addClass('highlightTable');
            if($(this).attr("name")==='frequency'){
            	isFrequencyNumber = false;
            	$(this).attr('placeholder', 'Please enter a valid integer');
            }
            else {
            	$(this).attr('placeholder', 'Please fill in all fields');
            }
        }
        else{
            $(this).removeClass('highlightTable').attr('placeholder', '');
        }
    });
    if(!isFrequencyNumber && !isEditValid){
    	return isFrequencyNumber;
    	return isEditValid;
    }
    else if (!isEditValid){
    	return isEditValid;
    }
    else {
    	//This allows clients to edit the specific key in firebase
		//I first get all of the input fields of the row that I want to edit
		var changes = $(this).closest('tr').children().children('input.tableData');
		//Create an empty array
		var data = {};
		//For each input i am going to get its name and declare that as a property
		//I am going to define the property with the value
		$(changes).each(function() {
			if($(this).attr("name")==='frequency'){
				if($(this).val().match(regexFrequency)){
					data[$(this).attr("name")] = $(this).val();
				}
				else{
					$(this).addClass('highlightTable').val('').attr('placeholder', 'Please enter a valid integer');
				}
			}
			else if($(this).attr("name")==='trainTime'){
				data[$(this).attr("name")] = moment($(this).val(), ["h:mm a"]).format("HH:mm");
			}
			else{
				data[$(this).attr("name")] = $(this).val();
			}
		});
		ref.child($(this).closest('tr').attr('id')).update(data);
		haveClicked = false;
    } 
});
//This changes the next arrival time only when the user hasn't clicked on it
$(document).on('click', "input[name='trainTime']", function() {
	//This grabs the input field fron the database and sets it the new time
	if (haveClicked === false){
		$(this).val(trainSchedule[$(this).closest('tr').attr('id')].trainTime);
		haveClicked = true;
	}
});
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
	apiKey: "AIzaSyCA4-muvFHMNKuOnxHy-n_GTo0bi7BmoVg",
	authDomain: "trainschedule-f8b02.firebaseapp.com",
	databaseURL: "https://trainschedule-f8b02.firebaseio.com",
	projectId: "trainschedule-f8b02",
	storageBucket: "trainschedule-f8b02.appspot.com",
	messagingSenderId: "677528095608"
};
firebase.initializeApp(config);
//Creating an instance of firebase to reference
var database = firebase.database();
var ref = database.ref('trainSchedule');
var trainSchedule;
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
	trainSchedule = snapshot.val();
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
			$(trainDataMinutesAway).addClass('minutesAway').append(trainMinutesAway).insertBefore($('#'+k).children('.editData'));
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
		trainRow.attr('id', keys[i]);
		//trainName
		var trainDataName = $('<td>');
		var trainInputName = $('<input>');
		$(trainDataName).append(trainInputName);
		$(trainInputName).addClass('tableData').attr('name', 'trainName').val(trainName);
		$(trainRow).append(trainDataName);
		$('#trainBody').append(trainRow);
		//destination
		var trainDataDestination = $('<td>');
		var trainInputDestination = $('<input>');
		$(trainDataDestination).append(trainInputDestination);
		$(trainInputDestination).addClass('tableData').attr('name', 'destination').val(destination);
		$(trainRow).append(trainDataDestination);
		$('#trainBody').append(trainRow);
		//frequency
		var trainDataFrequency = $('<td>');
		var trainInputFrequency = $('<input>');
		$(trainDataFrequency).append(trainInputFrequency);
		$(trainInputFrequency).addClass('tableData').attr('name', 'frequency').attr('type', 'number').val(frequency);
		$(trainRow).append(trainDataFrequency);
		$('#trainBody').append(trainRow);
		//trainTime
		var trainDataTime = $('<td>');
		var trainInputTime = $('<input>');
		$(trainDataTime).append(trainInputTime);
		$(trainInputTime).addClass('tableData').attr('name', 'trainTime').val(trainTime);
		$(trainRow).append(trainDataTime);
		$('#trainBody').append(trainRow);
		//trainMinutes Away
		var trainDataMinutesAway = $('<td>');
		$(trainDataMinutesAway).addClass('minutesAway').append(trainMinutesAway);
		$(trainRow).append(trainDataMinutesAway);
		$('#trainBody').append(trainRow);
		//table edit button
		var editData = $('<td>');
		var editBtn = $('<button>');
		var editSpan = $('<span>')
		$(editSpan).addClass('glyphicon glyphicon-floppy-disk');
		$(editBtn).addClass('btn btn-default editBtn').attr('type', 'button').append(editSpan);
		$(editData).addClass('editData').append(editBtn);
		$(trainRow).append(editData);
		//table trash button
		var trashData = $('<td>');
		var trashBtn = $('<button>');
		var trashSpan = $('<span>')
		$(trashSpan).addClass('glyphicon glyphicon-trash');
		$(trashBtn).addClass('btn btn-default trashBtn').append(trashSpan);
		$(trashData).addClass('trashData').append(trashBtn);
		$(trainRow).append(trashData);
	}
});

$("#trainForm").submit(function(event){
    var isFormValid = true;
    $(".form-group input").each(function(){
        if ($.trim($(this).val()).length == 0){
            isFormValid = false;
            $(this).addClass('highlightForm');
            $(this).val('');
			$(this).attr('placeholder', 'Please fill in all fields');
        }
        else{
        	$(this).removeClass('highlightForm');
        	$(this).attr('placeholder', '');
        }
    });
    if (!isFormValid){
    	return isFormValid;
    } 
    else{
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
		if(trainTime.match(regexTime) && frequency.match(regexFrequency)){
			//I then access the reference of where I am going to place that data
			var ref = database.ref('trainSchedule');
			ref.push(data);
			$('#trainForm')[0].reset();
		}
		else if (!trainTime.match(regexTime)){
			event.preventDefault();
			$('#trainTime').val('').attr('placeholder', 'Please enter a valid time in the following form: ##:##').addClass('highlightForm');
		}
		else if (!frequency.match(regexFrequency)){
			event.preventDefault();
			$('#frequency').val('').attr('placeholder', 'Please enter a valid integer').addClass('highlightForm');
		}
	}
});