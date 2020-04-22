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
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
              //if(xhr.response.errors)
                if (JSON.parse(xhr.response)) {
                                callback(JSON.parse(xhr.response));
                }else {
                  errorCallback()
                }
            }
        }
        xhr.send(JSON.stringify(request));
    }
};

TweetJs.Search("TitleIX",
function (data) {
    console.log(data, data.statuses[0].text, data.statuses[0].id_str);
}, function() {
  console.log('something is wrong')
});
