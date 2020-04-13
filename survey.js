/// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB3H7XoOf4I7In1L50Ra5dB1eutZCsUd84",
  authDomain: "titleix-9fc3f.firebaseapp.com",
  databaseURL: "https://titleix-9fc3f.firebaseio.com",
  projectId: "titleix-9fc3f",
  storageBucket: "titleix-9fc3f.appspot.com",
  messagingSenderId: "942395194345",
  appId: "1:942395194345:web:bfb7336f75676e52bc6978"
};

/// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var userData = {
  "q0": "",
  "q1": "",
  "q2": "",
  "q3": ""
};

/// Survey Questions
let ans0;
let ans1;
let ans2;
let ans3;

$('.q0-button').click(function() {
  ans = $(this).text();
  $('.q0-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q0 = ans;
  console.log(ans)
});

$('.q1-button').click(function() {
  ans = $(this).text();
  $('.q1-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q1 = ans;
  console.log(ans)
});

$('.q2-button').click(function() {
  ans = $(this).text();
  $('.q2-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q2 = ans;
  console.log(ans)
});

$('.q3-button').click(function() {
  ans = $(this).text();
  $('.q3-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q3 = ans;
  console.log(ans)
});

/// Submit all answers, send to Firebase
$("#submit").click(function(){
  ref = database.ref("result");
  ref.push(userData);
  ref.on("value", gotData, errData);
})

/// View and visualize database
function gotData(data) {
  console.log("gotData", data.val())
  let answers = data.val();
  let userID = Object.keys(answers);
  let q0Yes = 0;
  let q0No = 0;
  let q1Yes = 0;
  let q1No = 0;
  let q2Yes = 0;
  let q2No = 0;
  let q3Yes = 0;
  let q3Quite = 0;
  let q3Ok = 0;
  let q3Ugh = 0;
  let q3Hell = 0;


  for (let i = 0; i < userID.length; i++) {
    let u = userID[i];
    let q0 = answers[u].q0;
    let q1 = answers[u].q1;
    let q2 = answers[u].q2;
    let q3 = answers[u].q3;

    /// Get Count of Each Answer for Rect Visualization
    switch(q0){
      case "Yes":
      ++q0Yes;
      break;

      case "No":
      ++q0No;
      break;
    }

    switch(q1){
      case "Yes":
      ++q1Yes;
      break;

      case "No":
      ++q1No;
      break;
    }

    switch(q2){
      case "Yes":
      ++q2Yes;
      break;

      case "No":
      ++q2No;
      break;
    }


    switch(q3){
      case "Yes":
      ++q3Yes;
      break;

      case "Quite":
      ++q3Quite;
      break;

      case "It's ok":
      ++q3Ok;
      break;

      case  "Ugh":
      ++q3Ugh;
      break;

      case  "Hell No":
      ++q3Hell;
      break;
    }
  }

  /// Visualize Rectangles
  let maxWidth = 100;
  let firebaseCount = userID.length;
  resultDiv = document.getElementsByClassName("result-container");

  // Q0
  q0YesRect = document.getElementById("yes-0Rect");
  q0NoRect = document.getElementById("no-0Rect");

  q0YesRect.style.width = map_range(q0Yes, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("yes-0L").innerHTML = "Yes: " + percent(q0Yes/firebaseCount) + "%"
  q0NoRect.style.width = map_range(q0No, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("no-0L").innerHTML = "No: " + percent(q0No/firebaseCount) + "%"

  // Q1
  q1YesRect = document.getElementById("yes-1Rect");
  q1NoRect = document.getElementById("no-1Rect");

  q1YesRect.style.width = map_range(q1Yes, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("yes-1L").innerHTML = "Yes: " + percent(q1Yes/firebaseCount) + "%"
  q1NoRect.style.width = map_range(q1No, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("no-1L").innerHTML = "No: " + percent(q1No/firebaseCount) + "%"

  // Q2
  q2YesRect = document.getElementById("yes-2Rect");
  q2NoRect = document.getElementById("no-2Rect");

  q2YesRect.style.width = map_range(q2Yes, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("yes-2L").innerHTML = "Yes: " + percent(q2Yes/firebaseCount) + "%"
  q2NoRect.style.width = map_range(q2No, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("no-2L").innerHTML = "No: " + percent(q2No/firebaseCount) + "%"

  // Q3
  q3YesRect = document.getElementById("yes-3Rect");
  q3QuiteRect = document.getElementById("quite-3Rect");
  q3OKRect = document.getElementById("ok-3Rect");
  q3UghRect = document.getElementById("ugh-3Rect");
  q3HellRect = document.getElementById("hell-3Rect");

  q3YesRect.style.width = map_range(q3Yes, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("yes-3L").innerHTML = "Yes: " + percent(q3Yes/firebaseCount) + "%"
  q3QuiteRect.style.width = map_range(q3Quite, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("quite-3L").innerHTML = "No: " + percent(q3Quite/firebaseCount) + "%"
  q3OKRect.style.width = map_range(q3Ok, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("ok-3L").innerHTML = "Yes: " + percent(q3Ok/firebaseCount) + "%"
  q3UghRect.style.width = map_range(q3Ugh, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("ugh-3L").innerHTML = "No: " + percent(q3Ugh/firebaseCount) + "%"
  q3HellRect.style.width = map_range(q3Hell, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("hell-3L").innerHTML = "No: " + percent(q3Hell/firebaseCount) + "%"
}

function map_range(value, min1, max1, min2, max2){
  return (value - min1) * (max2 - min2) / (max1 - min1) + min2;
}

function percent(value){
  return Math.round((value)*100)
}

function errData(data){
  console.log("error")
}
