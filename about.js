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
    Search: function (query, callback) {
        TweetJs._callApi({
            Action: "Search",
            Query: query
        }, callback);
    },
    _callApi: function (request, callback) {
        var xhr = new XMLHttpRequest();
        URL = "https://www.tweetjs.com/API.aspx";
        xhr.open("POST", URL);
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                callback(JSON.parse(xhr.response));
            }
        }
        xhr.send(JSON.stringify(request));
    }
};

/// Create Object with latest Title IX tweets
let tweet = {}
let tweets = [];

TweetJs.Search("TitleIX", function (data) {
    // console.log(data, data.statuses.length, data.statuses[0].text, data.statuses[0].id_str);
    for (let i=0; i< data.statuses.length; i++){
      data.statuses[i].text = data.statuses[i].text.replace(/\n/ig, " ");
      tweet = {
        text: data.statuses[i].text,
        url: "https://twitter.com/i/web/status/" + data.statuses[i].id_str
      }
      tweets.push(tweet)
    }

    let uniqueTweets = [...tweets.reduce((map, val) => {
    if (!map.has(val.text)) {
        map.set(val.text, val);
    }
    return map;
    }, new Map()).values()]

    console.log(uniqueTweets)

    /// Display Tweets
    let tweets_text = document.getElementById("tweets");
    let tweetList = "";
    // console.log(tweets[0].text)
    for (let i=0; i<uniqueTweets.length; i++){
      tweetList += i + "/ " + uniqueTweets[i].text + "       ";
      // console.log(tweets[i].text)
      // displayTweets += '"' + tweets[i].text + '"'
      // console.log("tweets", displayTweets)
    }
    console.log(tweetList)
    tweets_text.innerHTML = tweetList;
});
