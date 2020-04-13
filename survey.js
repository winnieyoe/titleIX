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
});

$('.q2-button').click(function() {
  ans = $(this).text();
  $('.q2-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q2 = ans;
});

$('.q3-button').click(function() {
  ans = $(this).text();
  $('.q3-button').removeClass('selected');
  $(this).addClass('selected');
  userData.q3 = ans;
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

  for (let i = 0; i < userID.length; i++) {
    let u = userID[i];
    let q0 = answers[u].q0;
    let q1 = answers[u].q1;
    let q2 = answers[u].q2;
    let q3 = answers[u].q3;
  }
}

function errData(data){
  console.log("error")
}
