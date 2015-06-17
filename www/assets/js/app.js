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


document.cookie ='JSESSIONID=C69359B485FCE85C1F37B86A4533F7EF; Path=/'
var HOST = 'http://127.0.0.1:8080/lovepet';
//var HOST = 'http://172.31.34.184:8080/lovepet';

var URL = {
  getProfileInfo: HOST + '/profile/getProfileInfo',
  user_login: HOST + '/user/login',
  user_logout: HOST + '/user/logout',
  user_getUserInfo: HOST + '/user/getUserInfo',
  user_followUser: HOST + '/user/followUser',
  feed_postFeed: HOST + '/feed/postFeed',
  feed_getFollowFeed: HOST + '/feed/getFollowFeed',
  feed_replyFeed: HOST + '/feed/replyFeed',
  feed_getFeedReply : HOST + '/feed/getFeedReply',
  feed_repostFeed : HOST + '/feed/repostFeed',
  feed_favFeed : HOST + '/feed/favFeed',
  dating_addDating: HOST + '/dating/addDating',
  dating_getDatingList: HOST + '/dating/getDatingList'
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


function ProfileController(){
  var profileInfo = null;

  this.showProfileInfo = function() {
    getProfileInfo();
  };

  var getProfileInfo = function(){
    $.ajax({
      type: 'post',
      url: URL.getProfileInfo ,
      success: function(data,status,jqXHR){
        setTimeout(function(){
          if(data.error == RESPOND_CODE.OK){
            console.log(data.data);
            profileInfo = data.data;
            renderProfileInfo();
          }else if(data.error == RESPOND_CODE.NOT_LOGIN){
            window.location.href = "login.html";
          }else{
            commonController.showModalAlert('获取个人信息错误', data.data);
          }
        },0); 
      },
      error: commonController.ajaxError
    });
  };

  var renderProfileInfo = function(){
    $('#profile-portrait').attr('src', HOST + profileInfo.portrait);
    $('#profile-name').text(profileInfo.alias + ' (' + profileInfo.username + ')');
    $('#profile-profile').text('个性签名: ' + profileInfo.profile);
    $('#profile-feed-num').html(profileInfo.feedMum + '<br>动态');
    $('#profile-fans-num').html(profileInfo.fansNum + '<br>粉丝');
    $('#profile-follow-num').html(profileInfo.followNum + '<br>关注');
  };

  this.onLogout = function(){
    $.ajax({
      type: 'post',
      url: URL.user_logout ,
      success: function(data,status,jqXHR){
        setTimeout(function(){
          if(data.error == RESPOND_CODE.OK){
            commonController.showModalAlert('注销成功', data.data, function(){
              window.location.href = "login.html";
            });
          }else{
            commonController.showModalAlert('注销错误', data.data);
          }
        },0); 
      },
      error: commonController.ajaxError
    });
  };
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
    '    <div class="am-list-main am-list-item-text feed-content"></div>' +
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

  this.refreshFeed = function(){
    localStorage.removeItem('feedList');
    getFollowFeed();
  }

  var getFollowFeed = function(){
    $.ajax({
      type: 'post',
      url: URL.feed_getFollowFeed,
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

  var onDetailClick = function(event){
    event.stopPropagation();
    var $feed = $(event.target);
    if(!$feed.hasClass('am-list-item-desced')){
      $feed = $(event.target).parentsUntil("#feed-list").slice(-1);
    }

    var index = $feed.attr('index');
    localStorage.setItem('feedDetail', JSON.stringify(feedList[index]));

    window.location.href = "feed_detail.html";
  }

  var onUserClick = function(){
    event.stopPropagation();

    var $img = $(event.target);
    if($img.attr('data-user') === undefined){
      return;
    }
    localStorage.setItem('userId', $img.attr('data-user'));

    window.location.href = "user_info.html";
  }

  var onReplyClick = function(event){
    event.stopPropagation();
    var index = $(event.target).parent().parent().attr('index');
    localStorage.setItem('feedReply',feedList[index].id);
    window.location.href = "feed_reply.html";
  }

  var onRepostClick = function(event){
    event.stopPropagation();
    var index = $(event.target).parent().parent().attr('index');
    localStorage.setItem('feedRepost',feedList[index].id);
    window.location.href = "feed_repost.html";
  }

  var onFavClick = function(event){
    event.stopPropagation();
    var index = $(event.target).parent().parent().attr('index');

    $.ajax({
      type: 'post',
      url: URL.feed_favFeed,
      data: {
        feed_id: feedList[index].id
      },
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
              commonController.showModalAlert('提交成功', data.data);
          }else{
            commonController.showModalAlert('提交错误', data.data);
          }
        },0);
        }
        catch(err){}
      },
      error: commonController.ajaxError
    });
  }
  

  var renderFeed = function(){
    var $feed_list = $('#feed-list');
    $feed_list.children().remove();
    var length = feedList.length;
    for (var i = 0 ; i < length; i++){
      var feed = feedList[i];
      var $feed = $feedTpl.clone();

      $feed.attr('index', i);
      $feed.click(onDetailClick);
      var $feed_info = $feed.find('.feed-info');
      $feed_info.find('.am-list-item-hd').text(feed.user.alias);
      $feed_info.find('.am-list-item-text').text(new Date(feed.submitTime).format('yyyy-MM-dd HH:mm:ss'));
      $feed.find('.feed-portrait').attr('src', HOST + feed.user.portrait).attr('data-user',feed.user.id).click(onUserClick);
      $feed.find('.feed-content').text(feed.content);
      $feed.find('.feed-reply').text('评论' + ' (' + feed.replyNum + ')').click(onReplyClick);
      $feed.find('.feed-repost').text('转发' + ' (' + feed.repostNum + ')').click(onRepostClick);
      $feed.find('.feed-favorite').text('赞' + ' (' + feed.favNum + ')').click(onFavClick);
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
          $origin_feed.find('.feed-thumb').attr('src', HOST + origin_feed.photo).attr('data-user',origin_feed.user.id).click(onUserClick);;
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


function FeedDetailController(){
  var feed = null;
  var replyList = null;
  var perPage = 10;
  
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
    '    <div class="am-list-main am-list-item-text feed-content"></div>' +
    '    <img src="" alt="portrait" class="am-img-thumbnail am-radius feed-thumb"/>' +
    '  </div>' +
    '</li>');
var $feedReplyTpl = $('' +
    '<li class="am-list-item-desced">' +
    '  <div class="feed-reply-header">' +
    '    <img src="" alt="portrait" class="am-img-thumbnail am-radius feed-reply-portrait"/>' +
    '    <div class="feed-reply-info am-text-middle">' +
    '      <h3 class="am-list-item-hd"></h3>' +
    '      <div class="am-list-item-text"></div>' +
    '    </div>' +
    '  </div>' +
    '  <div class="am-list-main am-list-item-text feed-reply-content"></div>' +
    '</li>');

  var init = function(){
    var feedStorage = localStorage.getItem('feedDetail');
    localStorage.removeItem('feedDetail');
    if(feedStorage){
      feed = JSON.parse(feedStorage);
    }else{
      history.back();
    }
  };
  init();

  this.showFeed = function(){
    renderFeed();
  };
  this.showFeedReply = function(){
    getFeedReply();
  };

  var renderFeed = function(){
    var $feed_list = $('#feed-detail-list');
    var $feed = $feedTpl.clone();

    var $feed_info = $feed.find('.feed-info');
    $feed_info.find('.am-list-item-hd').text(feed.user.alias);
    $feed_info.find('.am-list-item-text').text(new Date(feed.submitTime).format('yyyy-MM-dd HH:mm:ss'));
    $feed.find('.feed-portrait').attr('src', HOST + feed.user.portrait);
    $feed.find('.feed-content').text(feed.content);
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

  };

  var getFeedReply = function(){
    $.ajax({
      type: 'post',
      url: URL.feed_getFeedReply,
      data: {
        feed_id: feed.id,
        per_page: perPage,
        page: 1
      },
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
            replyList = data.data;
            renderReply();
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

 var renderReply = function(){
    var $feed_reply_list = $('#feed-reply-list');
    var length = replyList.length;
    for (var i = 0 ; i < length; i++){
      var reply = replyList[i];
      var $reply = $feedReplyTpl.clone();

      var $reply_info = $reply.find('.feed-reply-info');
      $reply_info.find('.am-list-item-hd').text(reply.user.alias);
      $reply_info.find('.am-list-item-text').text(new Date(reply.submitTime).format('yyyy-MM-dd HH:mm:ss'));
      $reply.find('.feed-reply-portrait').attr('src', HOST + reply.user.portrait);
      $reply.find('.feed-reply-content').text(reply.content);
      $feed_reply_list.append($reply);
    }
  };
}


function FeedReplyController(){
  var feed = null;

  var init = function(){
    feed = localStorage.getItem('feedReply');
    localStorage.removeItem('feedReply');
    if(!feed){
      history.back();
    }
    $('#feed-reply-id').val(feed);
  };
  init();
  
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


function FeedRepostController(){
  var feed = null;

  var init = function(){
    feed = localStorage.getItem('feedRepost');
    localStorage.removeItem('feedRepost');
    if(!feed){
      history.back();
    }
    $('#feed-original-id').val(feed);
  };
  init();
  
  this.onSubmit = function(){
    $.ajax({
      type: 'post',
      url: URL.feed_repostFeed,
      data: $('#feed-repost-form').serialize(),
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


function DatingController(){
  var _this = this; 
  var $datingTpl = $('' +
    '<li class="am-list-item-desced" index="0">' +
    '  <div class="feed-header">' +
    '    <img src="" alt="portrait" class="am-img-thumbnail am-radius dating-portrait">' +
    '    <div class="dating-info am-text-middle">' +
    '      <h3 class="am-list-item-hd"></h3>' +
    '      <div class="am-list-item-text"></div>' +
    '    </div>' +
    '  </div>' +
    '  <div class="am-list-main am-list-item-text dating-content"></div>' +
    '  <span class="am-icon-github-square dating-pet"></span><br>' +
    '  <span class="am-icon-calendar dating-time"></span>  <br>' +
    '  <span class="am-icon-location-arrow dating-location"></span>' +
    '</li>');

  var datingList = null;

  this.getDatingList = function(){
    $.ajax({
      type: 'post',
      url: URL.dating_getDatingList,
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
            datingList = data.data;
            renderDating();
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


  var renderDating = function(){
    var $dating_list = $('#dating-list');
    $dating_list.children().remove();
    var length = datingList.length;
    for (var i = 0 ; i < length; i++){
      var dating = datingList[i];
      var $dating = $datingTpl.clone();

      $dating.attr('index', i);
      var $dating_info = $dating.find('.dating-info');
      $dating_info.find('.am-list-item-hd').text(dating.user.alias);
      $dating_info.find('.am-list-item-text').text(new Date(dating.submitTime).format('yyyy-MM-dd HH:mm:ss'));
      $dating.find('.dating-portrait').attr('src', HOST + dating.user.portrait);
      $dating.find('.dating-content').text(dating.content);
      $dating.find('.dating-pet').text(" "+dating.pet);
      $dating.find('.dating-time').text(" "+new Date(dating.time).format('yyyy-MM-dd HH:mm:ss'));
      $dating.find('.dating-location').text(" "+dating.location);

      $dating_list.append($dating);
    }
  };
}


function DatingAddController(){
  var _this = this;

  this.getTimeText = function(){
    $('#dating-add-time').val(new Date().format('yyyy-MM-dd HH:mm:ss'));
  };

  this.onSubmit = function(){
    $.ajax({
      type: 'post',
      url: URL.dating_addDating,
      data: $('#dating-add-form').serialize(),
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
              commonController.showModalAlert('发布成功', data.data, function(){
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
  };
}


function UserInfoController(){
  var userInfo = null;
  var userId;

  this.showUserInfo = function() {
    getUserInfo();
  };

  var getUserInfo = function(){
    $.ajax({
      type: 'post',
      url: URL.user_getUserInfo,
      data: {
        'user_id': userId,
      },
      success: function(data,status,jqXHR){
        setTimeout(function(){
          if(data.error == RESPOND_CODE.OK){
            console.log(data.data);
            userInfo = data.data;
            renderUserInfo();
          }else{
            commonController.showModalAlert('获取个人资料错误', data.data);
          }
        },0); 
      },
      error: commonController.ajaxError
    });
  };

  var renderUserInfo = function(){
    $('#user-info-portrait').attr('src', HOST + userInfo.portrait);
    $('#user-info-name').text(userInfo.alias + ' (' + userInfo.username + ')');
    $('#user-info-profile').text('个性签名: ' + userInfo.profile);
    $('#user-info-feed-num').html(userInfo.feedMum + '<br>动态');
    $('#user-info-fans-num').html(userInfo.fansNum + '<br>粉丝');
    $('#user-info-follow-num').html(userInfo.followNum + '<br>关注');

    $follow_btn = $('#user-info-follow-btn');
    if(userInfo.follow == 0){
      $follow_btn.removeClass('am-btn-danger').addClass('am-btn-primary').text('点击关注');
    }else{
      $follow_btn.removeClass('am-btn-primary').addClass('am-btn-danger').text('取消关注');
    }   
  };

  var onFollowClick = function(){
    $.ajax({
      type: 'post',
      url: URL.user_followUser,
      data: {
        'user_id': userId,
      },
      success: function(data,status,jqXHR){
        try{
          setTimeout(function(){
            if(data.error == RESPOND_CODE.OK){
              commonController.showModalAlert('提交成功', data.data);
              getUserInfo();
          }else{
            commonController.showModalAlert('提交错误', data.data);
          }
        },0);
        }
        catch(err){}
      },
      error: commonController.ajaxError
    });
  }

  var init = function(){
    userId = localStorage.getItem('userId');
    localStorage.removeItem('userId');
    if(!userId){
      history.back();
    }
    $('#user-info-follow-btn').click(onFollowClick);
  };
  init();
};


$(function(){
  commonController = new CommonController();
});