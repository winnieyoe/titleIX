// TweetJS.com - Display your tweets on your website using Javascript alone
// Copyright 2019 Infinite Loop Development Ltd - InfiniteLoop.ie
// Do not remove this notice.

TweetJs = {
    ListTweetsOnUserTimeline : function(screenName, callback) {
        TweetJs._callApi({
                Action: "ListTweetsOnUserTimeline",
                ScreenName: screenName
            },
        callback);
    },
    Search: function (query, callback, errorCallback) {
        TweetJs._callApi({
            Action: "Search",
            Query: query
        }, callback, errorCallback);
    },
    _callApi: function (request, callback, errorCallback) {
        var xhr = new XMLHttpRequest();
        URL = "https://www.tweetjs.com/API.aspx";
        xhr.open("POST", URL);
        xhr.onload = function() {
          let data = JSON.parse(xhr.response);
          console.log(data);
          if(data.errors !== undefined) {
            errorCallback();
          } else {
            callback(data);
          }
        }
        xhr.onerror = function() { errorCallback(); }
        // xhr.onreadystatechange = function () {
        //
        //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        //       console.log('success');//callback(JSON.parse(xhr.response))
        //     } else {
        //       console.log('error');//errorCallback()
        //     };
        //
        // }
        xhr.send(JSON.stringify(request));
    }
};

/// Create Object with latest Title IX tweets
let placeholder;

function preload() {
  placeholder = loadJSON("assets/tweets_placeholder.json");
}

function setup(){
  placeholder = placeholder.mydata;
}

//let tweet = {}
let tweets = [];
// let uniqueTweets;
let seenTweets = [];

function gotTweets(data) {
  for (let i=0; i< data.statuses.length; i++){
    data.statuses[i].text = data.statuses[i].text.replace(/\n/ig, " ");
    if( ! seenTweets.includes(data.statuses[i].text) ) {
      let tweet = {
        text: data.statuses[i].text,
        url: "https://twitter.com/i/web/status/" + data.statuses[i].id_str
      }
      tweets.push(tweet)
    }
    seenTweets.push(data.statuses[i].text);
  }
  displayTweets(tweets);
}

function gotError() {
  console.log("Can't load tweets")
  // uniqueTweets = placeholder
  // console.log(uniqueTweets)
  displayTweets(placeholder);
}

TweetJs.Search("TitleIX", gotTweets, gotError);
  // console.log(data, data.statuses.length, data.statuses[0].text, data.statuses[0].id_str);


    /// Display Tweets
  function displayTweets(tweet_data){
    let showTweets = document.getElementById("tweets");

    for (let i=0; i<tweet_data.length; i++){
      let a = document.createElement("a")
      a.href = tweet_data[i].url ;
      a.target = "_blank";
      a.innerHTML = tweet_data[i].text;
      showTweets.appendChild(a).className = "one-tweet";
    }
    // console.log(uniqueTweets)
    $('.marquee').marquee({
    	//duration in milliseconds of the marquee
    	duration: 15000,
    	//gap in pixels between the tickers
    	gap: 0,
    	//time in milliseconds before the marquee will start animating
    	delayBeforeStart: 0,
    	//'left' or 'right'
    	direction: 'left',
    	//true or false - should the marquee be duplicated to show an effect of continues flow
    	duplicated: false
    });
  }
