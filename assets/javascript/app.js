$( document ).ready(function() {
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCwR-YmXti4u9GwG4UCVj50lq6iOOhkgxA",
    authDomain: "train-schedule-1fc06.firebaseapp.com",
    databaseURL: "https://train-schedule-1fc06.firebaseio.com",
    projectId: "train-schedule-1fc06",
    storageBucket: "train-schedule-1fc06.appspot.com",
    messagingSenderId: "733825059512"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrainTime = 0;
  var frequency = 0;
  var firstTrainTimeConverted;
  var currentTime;
  var diffTime;
  var tRemainder;
  var MinutesTillTrain;
  var nextTrain;


  
  $("#addTrain").on("click", function(event)
  {
      //make page not reload on form submit click
    event.preventDefault();

    //get the value of the text boxes
      trainName = $("#trainNameInput").val().trim();
      destination = $("#destinationInput").val().trim();
      firstTrainTime = $("#trainTimeInput").val().trim();
      frequency = $("#frequencyInput").val().trim();


      // First Time (pushed back 1 year to make sure it comes before current time)
      firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "days");
    
      // Current Time
      currentTime = moment().format("hh:mm A");
    
      // Difference between the times
      diffTime = moment().diff(firstTrainTimeConverted, "minutes");
    
      // Time apart (remainder)
      tRemainder = diffTime % frequency;
    
      // Minute Until Train
      MinutesTillTrain = frequency - tRemainder;
    
      // Next Train
      nextTrain = moment().add(MinutesTillTrain, "minutes").format("hh:mm A");

      //reset text boxes to blank
      $("#trainNameInput").val("");
      $("#destinationInput").val("");
      $("#trainTimeInput").val("");
      $("#frequencyInput").val("");
      

      // push variables to database
      database.ref().push({
        TrainName: trainName,
        Destination: destination,
        Frequency: frequency,
        MinutesTillTrain: MinutesTillTrain,
        NextTrain: nextTrain
    }); 

  });


  database.ref().on("child_added", function(snapshot)
  {
    console.log(snapshot.val());

    var newInfoRow = $("<tr>").append
    (
      $("<td>").text(snapshot.val().TrainName),
      $("<td>").text(snapshot.val().Destination),
      $("<td>").text(snapshot.val().Frequency),
      $("<td>").text(snapshot.val().NextTrain),
      $("<td>").text(snapshot.val().MinutesTillTrain)
    );
    

      $("#trainTable").append(newInfoRow);
    
  });
  

});