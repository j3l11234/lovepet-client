Date.prototype.format = function (mask){
  var d = this;
  var zeroize = function (value, length){
    if (!length) length = 2;
    value = String(value);
    for (var i = 0, zeros = ''; i < (length - value.length); i++){
      zeros += '0';
    }
    return zeros + value;
  };

  return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0){
    switch ($0){
      case 'd': return d.getDate();
      case 'dd': return zeroize(d.getDate());
      case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
      case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
      case 'M': return d.getMonth() + 1;
      case 'MM': return zeroize(d.getMonth() + 1);
      case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
      case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
      case 'yy': return String(d.getFullYear()).substr(2);
      case 'yyyy': return d.getFullYear();
      case 'h': return d.getHours() % 12 || 12;
      case 'hh': return zeroize(d.getHours() % 12 || 12);
      case 'H': return d.getHours();
      case 'HH': return zeroize(d.getHours());
      case 'm': return d.getMinutes();
      case 'mm': return zeroize(d.getMinutes());
      case 's': return d.getSeconds();
      case 'ss': return zeroize(d.getSeconds());
      case 'l': return zeroize(d.getMilliseconds(), 3);
      case 'L': var m = d.getMilliseconds();
      if (m > 99) m = Math.round(m / 10);
      return zeroize(m);
      case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
      case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
      case 'Z': return d.toUTCString().match(/[A-Z]+$/);
      // Return quoted strings with the surrounding quotes removed
      default: return $0.substr(1, $0.length - 2);
    }
  });
};


(function($) {
  'use strict';

  $(function() {
    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
      $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
      $.AMUI.fullscreen.isFullscreen ? $fullText.text('关闭全屏') : $fullText.text('开启全屏');
    });
  });
})(jQuery);

document.cookie ='JSESSIONID=36E46075770F065B9B72E60FDC6770DD; Path=/'
//var HOST = 'http://192.168.5.10:8080/lovepet';
var HOST = 'http://127.0.0.1:8080/lovepet';
var URL = {
  getProfileInfo: HOST + '/profile/getProfileInfo',
  user_login: HOST + '/user/login',
  user_logout: HOST + '/user/logout',
  feed_postFeed: HOST + '/feed/postFeed',
  feed_getFollowFeed: HOST + '/feed/getFollowFeed',
  feed_replyFeed: HOST + '/feed/replyFeed',
}
var RESPOND_CODE = {
  OK : 0,
  ERROR : 1,
  NOT_LOGIN :2
}



$(function(){
  //modal-loading


});

function CommonController(){
  var _this = this; 

  var $modal_loading = $('' +
    '<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1">' +
    '  <div class="am-modal-dialog">' +
    '    <div class="am-modal-hd">正在载入...</div>' +
    '    <div class="am-modal-bd">' +
    '      <span class="am-icon-spinner am-icon-spin"></span>' +
    '    </div>' +
    '  </div>' +
    '</div>');
  var $modal_alert = $('' +
    '<div class="am-modal am-modal-alert" tabindex="-1">' +
    '  <div class="am-modal-dialog">' +
    '    <div class="am-modal-hd"></div>' +
    '    <div class="am-modal-bd"></div>' +
    '    <div class="am-modal-footer">' +
    '      <span class="am-modal-btn">确定</span>' +
    '    </div>' +
    '  </div>' +
    '</div>');
  $('body').append($modal_loading);
  $('body').append($modal_alert);

  $(document).ajaxSend(function(event,xhr,options){
    //console.log(xhr.getAllResponseHeaders());
    $modal_loading.modal('open');
  });
  $(document).ajaxComplete(function(event,xhr,options){
    //console.log(xhr.getAllResponseHeaders());
    $modal_loading.modal('close');
  });

  this.showModalAlert =  function(title,text,closed){
    $modal_alert.find('.am-modal-hd').html(title);
    $modal_alert.find('.am-modal-bd').html(text);
    if(closed){
      $modal_alert.on('closed.modal.amui', function(){
        closed();
        $modal_alert.off('closed.modal.amui'); 
      });
    }
    $modal_alert.modal('open');
  },

  this.ajaxError = function(jqXHR, textStatus, errorMsg){
    setTimeout(function(){
      _this.showModalAlert('错误','服务器或网络错误');
    },0); 
  }
}

var Profile = {
  getProfileInfo : function() {
    $.ajax({
      type: 'post',
      url: URL.getProfileInfo ,
      success: function(data,status,jqXHR){
        setTimeout(function(){
          if(data.error == RESPOND_CODE.OK){
            console.log(data.data);
            //localStorage.setItem('', data.data);
            //window.location.href = "login.html";
          }else if(data.error == RESPOND_CODE.NOT_LOGIN){
            window.location.href = "login.html";
          }else if(data.error == RESPOND_CODE.ERROR){
            commonController.showModalAlert('获取个人信息错误', data.data);
          }
        },0); 
      },
      error: commonController.ajaxError
      //, global: false // 可以禁止触发全局的Ajax事件
    });
  },

  onLogout: function(){
    $.ajax({
      type: 'post',
      url: URL.user_logout ,
      success: function(data,status,jqXHR){
        setTimeout(function(){
          if(data.error == RESPOND_CODE.OK){
            commonController.showModalAlert('注销成功', data.data, function(){
              window.location.href = "login.html";
            });
          }else if(data.error == RESPOND_CODE.ERROR){
            commonController.showModalAlert('注销错误', data.data);
          }
        },0); 
      },
      error: commonController.ajaxError
    });
  }
};

var Login = {
  onSubmit: function(){
    var $submit_button = $("#login-submit");
    $.ajax({
      type: 'post',
      url: URL.user_login,
      data: $('#login-form').serialize(),
      beforeSend: function(){
        $submit_button.button('loading');
      },
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
              document.location.href = "profile.html";
            }else{
              commonController.showModalAlert('登录错误', data.data);
            }
          },0);
        }
        catch(err){}
      },
      error: commonController.ajaxError,
      complete: function(){
        $submit_button.button('reset');
      }
    });
    return false;
  },
};

function FeedController(){
  var _this = this; 
  var $feedTpl = $('' +
    '<li class="am-list-item-desced">' +
    '  <div class="feed-header">' +
    '    <img src="" alt="portrait" class="am-img-thumbnail am-radius feed-portrait"/>' +
    '    <div class="feed-info am-text-middle">' +
    '      <h3 class="am-list-item-hd"></h3>' +
    '      <div class="am-list-item-text"></div>' +
    '    </div>' +
    '  </div>' +
    '  <div class="am-list-main am-list-item-text feed-content"></div>' +
    '  <img src="" alt="thumb" class="am-img-thumbnail am-radius feed-thumb"/>' +
    '  <div class="am-panel am-panel-default feed-origin">' +
    '    <div class="feed-header">' +
    '      <img src="" alt="portrait" class="am-img-thumbnail am-radius feed-portrait"/>' +
    '      <div class="feed-info am-text-middle">' +
    '        <h3 class="am-list-item-hd"></h3>' +
    '        <div class="am-list-item-text"></div>' +
    '      </div>' +
    '    </div>' +
    '    <div class="am-list-main am-list-item-text feed-content">' +
    '    </div>' +
    '    <img src="" alt="portrait" class="am-img-thumbnail am-radius feed-thumb"/>' +
    '  </div>' +
    '  <div class="am-btn-group am-btn-group-xs am-btn-group-justify">' +
    '    <button type="button" class="am-btn am-btn-default feed-reply"></button>' +
    '    <button type="button" class="am-btn am-btn-default feed-repost"></button>' +
    '    <button type="button" class="am-btn am-btn-defaultf feed-favorite"></button>' +
    '  </div>' +
    '</li>');

  var feedList = null;

  this.showFeed = function(){
    var feedListStorage = localStorage.getItem('feedList');
    if(feedListStorage){
      feedList = JSON.parse(feedListStorage); 
      renderFeed();
    }else{
      getFollowFeed();
    }
  }

  var getFollowFeed = function(){
    $.ajax({
      type: 'post',
      url: URL.feed_getFollowFeed,
      data: $('#post-feed-form').serialize(),
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
            feedList = data.data;
            localStorage.setItem('feedList', JSON.stringify(data.data));
            renderFeed();
          }else{
            commonController.showModalAlert('获取错误', data.data);
          }
        },0);
        }
        catch(err){}
      },
      error: commonController.ajaxError
    });
    return false;
  };

  var onReplyClick = function(event){
    var index = $(event.target).parent().parent().attr('index');
    localStorage.setItem('feedReply',feedList[index].id);
    window.location.href = "feed_reply.html";
  }

  var renderFeed = function(){
    var $feed_list = $('#feed-list');
    var length = feedList.length;
    for (var i = 0 ; i < length; i++){
      var feed = feedList[i];
      var $feed = $feedTpl.clone();

      $feed.attr('index', i);
      var $feed_info = $feed.find('.feed-info');
      $feed_info.find('.am-list-item-hd').text(feed.user.alias);
      $feed_info.find('.am-list-item-text').text(new Date(feed.submitTime).format('yyyy-MM-dd HH:mm:ss'));
      $feed.find('.feed-portrait').attr('src', HOST + feed.user.portrait);
      $feed.find('.feed-content').text(feed.content);
      var i = i;
      $feed.find('.feed-reply').text('评论' + ' (' + feed.replyNum + ')').click(onReplyClick);
      $feed.find('.feed-repost').text('转发' + ' (' + feed.repostNum + ')');
      $feed.find('.feed-favorite').text('赞' + ' (' + feed.favNum + ')');
      if(feed.photo){
        $feed.find('.feed-thumb').attr('src', HOST + feed.photo);
      }else{
        $feed.find('.feed-thumb').remove();
      }

      if(feed.original){
        var origin_feed = feed.original;
        var $origin_feed = $feed.find('.feed-origin');

        var $origin_feed_info = $origin_feed.find('.feed-info');
        $origin_feed_info.find('.am-list-item-hd').text(origin_feed.user.alias);
        $origin_feed_info.find('.am-list-item-text').text(new Date(origin_feed.submitTime).format('yyyy-MM-dd HH:mm:ss'));
        $origin_feed.find('.feed-portrait').attr('src', HOST + origin_feed.user.portrait);
        $origin_feed.find('.feed-content').text(origin_feed.content);
        if(origin_feed.photo){
          $origin_feed.find('.feed-thumb').attr('src', HOST + origin_feed.photo);
        }else{
          $origin_feed.find('.feed-thumb').remove();
        }
      }else{
        $feed.find('.feed-origin').remove();
      }

      $feed_list.append($feed);
    }
  };
}


function FeedReplyController(){
  var feed = localStorage.getItem('feedReply');
  if(!feed){
    history.back();
  }
  $('#feed-reply-id').val(feed);

  this.onSubmit = function(){
    $.ajax({
      type: 'post',
      url: URL.feed_replyFeed,
      data: $('#feed-reply-form').serialize(),
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
              commonController.showModalAlert('提交成功', data.data, function(){
                localStorage.removeItem('feedList');
                history.back();
              });
            }else{
              commonController.showModalAlert('提交错误', data.data);
            }
          },0);
        }
        catch(err){}
      },
      error: commonController.ajaxError
    });

    return false;
  };
}


var PostFeed = {
  onSubmit: function(){
    $.ajax({
      type: 'post',
      url: URL.feed_postFeed,
      data: $('#post-feed-form').serialize(),
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
              commonController.showModalAlert('发布成功', data.data, function(){
                localStorage.removeItem('feedList');
                history.back();
              });
            }else{
              commonController.showModalAlert('发布错误', data.data);
            }
          },0);
        }
        catch(err){}
      },
      error: commonController.ajaxError
    });
    return false;
  },
};

$(function(){
  commonController = new CommonController();
});