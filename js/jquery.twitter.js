$(document).ready(function(){   

// var numTweets = 10;
// var user      = 'MadonnaWorld';
// var appendTo  = '#jstwitter';

// $('#left').append(user);

// $.ajax({
//     url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
//     type: 'GET',
//     dataType: 'jsonp',
//         data: {
//             screen_name: user,
//             include_rts: true,
//             count: numTweets,
//             include_entities: true
//         },
//         success: function(data, textStatus, xhr) {

//              var html = '<div class="tweet">TWEET_TEXT<div class="time">AGO</div></div>';
     
//              // append tweets into page
//              for (var i = 0; i < data.length; i++) {
//                 $(appendTo).append(
//                     html.replace('TWEET_TEXT', data[i].text )
//                         .replace(/USER/g, data[i].user.screen_name)
//                         .replace('AGO', data[i].created_at )
//                         .replace(/ID/g, data[i].id_str)
//                 );
//              }

//         }   
// });
    

JQTWEET = {
     
    // Set twitter username, number of tweets & id/class to append tweets
    user: '',
    numTweets: 10,
    appendTo: '#jstwitter',
 
    // core function of jqtweet
    loadTweets: function(u) {
        JQTWEET.user = u;

        $.ajax({
            url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                screen_name: JQTWEET.user,
                include_rts: true,
                count: JQTWEET.numTweets,
                include_entities: true
            },
            success: function(data, textStatus, xhr) {

                $(JQTWEET.appendTo).text(' ');
 
                 var html = '<div class="tweet"><img src="IMG_SRC">TWEET_TEXT<div class="time">AGO</div>';
         
                 // append tweets into page
                 for (var i = 0; i < data.length; i++) {
                    $(JQTWEET.appendTo).append(
                        html.replace('TWEET_TEXT', JQTWEET.ify.clean(data[i].text) )
                            .replace(/USER/g, data[i].user.screen_name)
                            .replace('AGO', JQTWEET.timeAgo(data[i].created_at) )
                            .replace(/ID/g, data[i].id_str)
                            .replace('IMG_SRC', data[i].user.profile_image_url)
                    );
                 }                  
            }   
 
        });
         
    }, 
     
         
    /**
      * relative time calculator FROM TWITTER
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    timeAgo: function(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);
         
        if ($.browser.msie) {
            // IE can't parse these crazy Ruby dates
            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
        }
 
        var diff = rightNow - then;
 
        var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
 
        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }
 
        if (diff < second * 2) {
            // within 2 seconds
            return "щойно";
        }
 
        if (diff < minute) {
            return Math.floor(diff / second) + " секунд тому";
        }
 
        if (diff < minute * 2) {
            return "бльзько хвилини тому";
        }
 
        if (diff < hour) {
            return Math.floor(diff / minute) + " хвилин тому";
        }
 
        if (diff < hour * 2) {
            return "бльзько години тому";
        }
 
        if (diff < day) {
            return  Math.floor(diff / hour) + " годин тому";
        }
 
        if (diff > day && diff < day * 2) {
            return "вчора";
        }
 
        if (diff < day * 365) {
            return Math.floor(diff / day) + " дня тому";
        }
 
        else {
            return "більше року тому";
        }
    }, // timeAgo()
     
     
    /**
      * The Twitalinkahashifyer!
      * http://www.dustindiaz.com/basement/ify.html
      * Eg:
      * ify.clean('your tweet text');
      */
    ify:  {
      link: function(tweet) {
        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
          var http = m2.match(/w/) ? 'http://' : '';
          return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
        });
      },
 
      at: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
        });
      },
 
      list: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        });
      },
 
      hash: function(tweet) {
        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        });
      },
 
      clean: function(tweet) {
        return this.hash(this.at(this.list(this.link(tweet))));
      }
    } // ify
 
     
};
 
 
 JQTWEET.loadTweets('ua_yanukovych');


function viewtweet (user) {
    JQTWEET.loadTweets(user);
}

function activeuser (i) {
    $('#left').children().each(function(n){
        if(n == i){
            $(this).addClass("active");
        }else{
            $(this).removeClass("active");
        }
    });
}

$('#left').children().each(function(i){
            $(this).click(function(){
                viewtweet($(this).text());
                activeuser(i)
            });
});

});