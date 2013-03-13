$(document).ready(function(){   


function myTweets () {

  var numTweets  = 10;
  var usersList  = null;
  var content    = null;
  var users      = new Array();

  this.setNumTweets = function(n){
    numTweets = n;
  }

  this.setUsersList = function(l){
    usersList = l;
  }

  this.setContent = function(c){
    content = c;
  }

  this.loadUsers = function(){

    jQuery.ajax({
      type: "GET", 
      url: "data.xml",
      dataType: "xml", 
      success: function(xml) {
        var l = '';
        jQuery(xml).find('user').each(
          function()
          {
            var user = jQuery(this).find('login').text();
            addUsers(user);
          });     
      }
    });

  }

  addUsers = function (user) {
        $.ajax({
            url: 'https://api.twitter.com/1/users/show.json/',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                screen_name: user,
                include_entities: true
            },
            success: function(data, textStatus) {
              users[user] = data;
              createBtnUser(user);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log('error addUsers');
            }
        });

  }

  createBtnUser = function(user) {

        var btn = $('<div>', {
            'data-logo': user
        });

        btn.append('<img src="'+users[user].profile_image_url+'"><span>'+users[user].name+'</span>');

        btn.click(function(){
            viewProfile(user);
            getTweets(user,1);
            activeuser(user)
        });

        $(usersList).append(btn);

  }

  activeuser = function(u) {
    $(usersList).children().each(function(n){
        if($(this).data('logo') == u){
            $(this).addClass("active");
        }else{
            $(this).removeClass("active");
        }
    });
  }

  viewProfile = function (user) {

    $('#userinfo a').each(function(){
        $(this).attr("href","https://twitter.com/"+user);
    });

    $('#userinfo .profile-field').text(users[user].name);
    $('#userinfo .screen-name').text('@'+user);
    $('#userinfo .avatar').attr( 'src', users[user].profile_image_url.replace('normal','bigger') );
    $('#userinfo .bio').text(users[user].description);
    $('#userinfo .location').text(users[user].location);
    $('#userinfo .url').text(users[user].url).attr("href",users[user].url);

    $('body').css("background-image", "url("+users[user].profile_background_image_url+")");
  }


  getTweets = function(user, p) {

    $(content).prepend("<div id='loading'><img src='img/loading.gif' alt='loading'></div>");


           $.ajax({
            url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                screen_name: user,
                include_rts: true,
                count: numTweets,
                page: p,
                include_entities: true
            },
            success: function(data, textStatus) {
                $(content).text('');
                showPages(user,p);
 
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

    showPages = function(user,p) {

      $("#pag").text('');
      $("#pag").attr('data-user', user);

      var n = Math.ceil(users[user].statuses_count/numTweets);
      if(n == 1) return true;
      var pg = new Array();

      var i = 1;
      while(i <= n){
 
      pg[i] = $('<span>');

      if(i == p){pg[i].addClass('no-active')}

      pg[i].text(i);

      pg[i].click(function(){
            getTweets($(this).parent().data('user'),$(this).text()*1);
      });

      $("#pag").append(pg[i]);

      if(n > 15){
        if(i > 2 && i < (p - 3)){ i = (p - 3); $("#pag").append(' ... ');}
        if(i > (p + 1) && i < (n - 3)){ i = (n - 3); $("#pag").append(' ... ');}
      }
         i++;
      };
        
    }
// 12 (120)
// 1 2 3 4 5 ... 10 11 12 13 14 .. 116 117 118 119 120
    timeAgo = function(dateString) {

        var then = new Date(dateString);

        var month = then.getMonth()+1;
        var day = then.getDate();
        var hour = then.getHours();
        var minute = then.getMinutes();

        var time = ((''+hour).length<2 ? '0' :'') + hour + ':' + ((''+minute).length<2 ? '0' :'') + minute;

        var date = ((''+day).length<2 ? '0' : '') + day + '.' +
                  ((''+month).length<2 ? '0' : '') + month + '.' +
                  then.getFullYear();
    
        return date + ' в ' + time;
        
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