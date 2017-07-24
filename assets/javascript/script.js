function FormInputs(trainName, destination, trainTime, frequency){
    this.trainName = trainName;
    this.destination = destination;
    this.trainTime = trainTime;
    this.frequencyInput = frequency;
}
$('#trainForm').submit(function(e){
    e.preventDefault();
    var data = JSON.stringify( $('#trainForm').serializeArray() );
    console.log(data);
});
