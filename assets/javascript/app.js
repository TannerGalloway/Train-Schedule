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
  var trainInfo = [];
  var trainEntries = 0;
  
setInterval(TrainInfoUpdate, 30000);
  
  $("#addTrain").on("click", function(event)
  {
      //make page not reload on form submit click
    event.preventDefault();

    //get the value of the text boxes
      trainName = $("#trainNameInput").val().trim();
      destination = $("#destinationInput").val().trim();
      firstTrainTime = $("#trainTimeInput").val().trim();
      frequency = $("#frequencyInput").val().trim();

      // First Time (pushed back 1 day to make sure it comes before current time)
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
        FirstTrainTime: firstTrainTime,
        Frequency: frequency
    }); 

  });
  
   

  database.ref().on("child_added", function(snapshot)
  {
    //put info from the database into an array
    trainInfo.push(snapshot.val());
    
    var newInfoRow = $("<tr>").append
    (
      $("<td>").text(snapshot.val().TrainName),
      $("<td>").text(snapshot.val().Destination),
      $("<td>").text(snapshot.val().Frequency),
      $("<td>").text(nextTrain).attr("id", "NextArival" + trainEntries),
      $("<td>").text(MinutesTillTrain).attr("id", "MinsAway" + trainEntries)
    );
      $("#trainTable").append(newInfoRow);
      trainEntries++;
  });

    function TrainInfoUpdate()
    {
      for(i = 0; i < trainInfo.length; i++)
      {
        // First Time (pushed back 1 year to make sure it comes before current time)
        firstTrainTimeConverted = moment(trainInfo[i].FirstTrainTime, "HH:mm").subtract(1, "days");
        
        // // Current Time
        currentTime = moment().format("hh:mm A");
       
        // // Difference between the times
        diffTime = moment().diff(firstTrainTimeConverted, "minutes");

        // Time apart (remainder)
        tRemainder = diffTime % trainInfo[i].Frequency;

        //  // Minute Until Train
         MinutesTillTrain = trainInfo[i].Frequency - tRemainder;

        //  // Next Train
        nextTrain = moment().add(MinutesTillTrain, "minutes").format("hh:mm A");

        $("#NextArival" + i).text(nextTrain);
        $("#MinsAway" + i).text(MinutesTillTrain);
      }
    }

});