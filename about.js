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


    /// Display Tweets
    let showTweets = document.getElementById("tweets");
    // let tweetList = "";
    //
    // for (let i=0; i<uniqueTweets.length; i++){
    //   tweetList += "<a class='one-tweet' href=" + uniqueTweets[i].url + "target='_blank'>" + uniqueTweets[i].text + "</a>";
    // }
    // tweets_text.innerHTML = tweetList;
    // console.log(tweetList)
    for (let i=0; i<uniqueTweets.length; i++){
      let a = document.createElement("a")
      a.href = uniqueTweets[i].url ;
      a.target = "_blank";
      a.innerHTML = uniqueTweets[i].text;
      showTweets.appendChild(a).className = "one-tweet";
    }
    console.log(uniqueTweets)

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
});

// polyfill
// window.requestAnimationFrame = (function(){
//   return  window.requestAnimationFrame       ||
//           window.webkitRequestAnimationFrame ||
//           window.mozRequestAnimationFrame    ||
//           function( callback ){
//             window.setTimeout(callback, 1000 / 60);
//           };
// })();
//
// var speed = 5000;
// (function currencySlide(){
//     var currencyPairWidth = $('.one-tweet:first-child').outerWidth();
//     $("#tweets").animate({marginLeft:-currencyPairWidth},speed, 'linear', function(){
//                 $(this).css({marginLeft:0}).find("a:last").after($(this).find("a:first"));
//         });
//         requestAnimationFrame(currencySlide);
// })();
