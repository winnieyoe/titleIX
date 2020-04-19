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
  console.log("0", ans)
});

$('.q1-button').click(function() {
  ans = $(this).text();
  $('.q1-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q1 = ans;
  console.log("1", ans)
});

$('.q2-button').click(function() {
  ans = $(this).text();
  $('.q2-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q2 = ans;
  console.log("2", ans)
});

/// Survey Hide and show
$("#q0-next").click(function(){
  $("#survey-intro").hide();
  $("#all-questions").css('display', 'flex');
  $("#q1-container").css('display', 'flex');
})

$("#q0-end").click(function(){
  $("#survey-intro").hide();
  $("#visualize").css('display', 'flex');
  $("#all-questions").css('height', '0');

  ref = database.ref("result");
  ref.push(userData);
  ref.on("value", gotData, errData);
})

$("#q1-next").click(function(){
  $("#q1-container").hide();
  $("#q2-container").css('display', 'flex');
})

$("#q1-lastQ").click(function(){
  $("#q1-container").hide();
  $("#q3-container").css('display', 'flex');
})

$(".q2-button").click(function(){
  $("#q2-container").hide();
  $("#q3-container").css('display', 'flex');
})

/// Submit all answers, send to Firebase
$("#submit").click(function(){
  userData.q3 = $('#textbox').val();
  $(this).addClass('selected');
  console.log("3", userData.q3)
  ref = database.ref("result");
  ref.push(userData);
  ref.on("value", gotData, errData);

  $("#q1-container").hide();
  $("#q2-container").hide();
  $("#q3-container").hide();
  $("#visualize").css('display', 'flex');
  $("#all-questions").css('height', '0');
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
  let q2Neutral = 0;
  let q2No = 0;
  let ans3 = [];

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

      case "Neutral":
      ++q2Neutral;
      break;

      case "No":
      ++q2No;
      break;
    }
    ans3.push(q3);
  }
  console.log("ans3", ans3)

  /// Visualize Rectangles
  let maxWidth = 600;
  let firebaseCount = userID.length;
  resultDiv = document.getElementsByClassName("result-container");

  // Q0
  q0YesRect = document.getElementById("yes-0Rect");
  q0NoRect = document.getElementById("no-0Rect");

  q0YesRect.style.width = map_range(q0Yes, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("yes-0L").innerHTML = "Yes: " + "<br>" + percent(q0Yes/firebaseCount) + "%"
  q0NoRect.style.width = map_range(q0No, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("no-0L").innerHTML = "No: " + "<br>" + percent(q0No/firebaseCount) + "%"

  // Q1
  q1YesRect = document.getElementById("yes-1Rect");
  q1NoRect = document.getElementById("no-1Rect");

  q1YesRect.style.width = map_range(q1Yes, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("yes-1L").innerHTML = "Yes: " + "<br>" + percent(q1Yes/firebaseCount) + "%"
  q1NoRect.style.width = map_range(q1No, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("no-1L").innerHTML = "No: " + "<br>" + percent(q1No/firebaseCount) + "%"

  // Q2
  q2YesRect = document.getElementById("yes-2Rect");
  q2NeutralRect = document.getElementById("ok-2Rect");
  q2NoRect = document.getElementById("no-2Rect");

  q2YesRect.style.width = map_range(q2Yes, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("yes-2L").innerHTML = "Yes: " + "<br>" + percent(q2Yes/firebaseCount) + "%"
  q2YesRect.style.width = map_range(q2Neutral, 0, firebaseCount, 0, maxWidth) + "px";
  document.getElementById("ok-2L").innerHTML = "Neutral: " + "<br>" + percent(q2Neutral/firebaseCount) + "%"
  q2NoRect.style.width = map_range(q2No, 0, firebaseCount, 0, maxWidth)+ "px";
  document.getElementById("no-2L").innerHTML = "No: " + "<br>" + percent(q2No/firebaseCount) + "%"

  // Q3
  q3Results = document.getElementById("q3-results");
  let ansList = ""
  for (let i=0; i<ans3.length; i++){
    ansList += "<div class='ans3'>" + ans3[i] + "</div>"
  }
  q3Results.innerHTML = ansList;
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
