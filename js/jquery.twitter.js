$(document).ready(function(){   

function myTweets () {

  var numTweets  = 10;
  var usersList  = '1';
  var content    = '2';

  this.setUsersList = function(l){
    usersList = l;
  }

  this.setContent = function(c){
    content = c;
  }

  this.loadUsers = function(){
    var _this = this;

    jQuery.ajax({
      type: "GET", 
      url: "data.xml",
      dataType: "xml", 
      success: function(xml) { 
        var l = '';
        jQuery(xml).find('user').each(
          function()
          {
            var user = jQuery(this).find('name').text();
            $(usersList).append('<div>'+user+'</div>');
          });     
        addevent();
      } 
    });

  }

  addevent = function(){

    var _this = this;

    $(usersList).children().each(function(i){
            $(this).click(function(){
                getTweets($(this).text());
                activeuser(i)
            });
    });
}

  activeuser = function(i) {
    $(usersList).children().each(function(n){
        if(n == i){
            $(this).addClass("active");
        }else{
            $(this).removeClass("active");
        }
    });
}



  getTweets = function(user) {
   

        $.ajax({
            url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                screen_name: user,
                include_rts: true,
                count: numTweets,
                include_entities: true
            },
            success: function(data, textStatus, xhr) {
                $(content).text(' ');
 
                 var html = '<div class="tweet"><img src="IMG_SRC">TWEET_TEXT<div class="time">AGO</div>';

                 for (var i = 0; i < data.length; i++) {
                    $(content).append(
                        html.replace('TWEET_TEXT', ify.clean(data[i].text) )
                            .replace(/USER/g, data[i].user.screen_name)
                            .replace('AGO', timeAgo(data[i].created_at) )
                            .replace(/ID/g, data[i].id_str)
                            .replace('IMG_SRC', data[i].user.profile_image_url)
                    );
                 }
            }   
 
        });
 
    }

    timeAgo = function(dateString) {
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
    } // timeAgo()

    ify =  {
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


}

var tw = new myTweets();

tw.setUsersList('#left');
tw.setContent('#jstwitter');

tw.loadUsers();

});