/**
 * Application Config File
 */

'use strict';

var AppConfig = {

  // Paint Area for this application
  container: document.getElementById('main'),
  dWidth: $(window).width(),
  getUserData: function() {
    return $.extend({}, JSON.parse(localStorage.getItem('userdata')))
  },
  ajax: function (options, xhrReadyCallback) {
    //$(document).trigger('ajaxBegin');
    var deferred = $.Deferred();
    var defaultOptions = {
      type: 'GET',
      dataType: 'json'
    };
    //Append timezone to each API call
    var tz = jstz.determine();
    var zone = tz.name();
    var ds = options.url.indexOf('?') > 0 ? '&' : '?';
    var url = options.url + ds + 'timezone=' + zone;
    options.url = url;
    var o = $.extend({}, defaultOptions, options);
    var xhr = $.ajax(o)
      .done(function () {
        var res = arguments[0];
        if(res.message.id == 1180) {
          localStorage.removeItem('userdata');
          window.location.href = '';
        }
        if(res.message.id == 100) {
          res.message.description = 'Error connecting server, please try again later.'
        }
        deferred.resolve.apply(this, arguments);
        xhrReadyCallback(res);
      })
      .fail(function () {
        var res = arguments[0];
        /** Expire session if error and not local or dev environment : uncomment below lines to enable this */
        /**
        if (!res.status || (options.url && options.url.indexOf('local') == -1 && options.url.indexOf('dev') == -1)) {
          localStorage.removeItem('userdata');
          window.location.href = '';
        }
        */
        deferred.reject.apply(this, arguments);
        //xhrReadyCallback(res);
      });
    //$(document).trigger('ajaxEnd');
    return deferred.promise();
  },
  g_ajax: function (options, xhrReadyCallback) {
    var deferred = $.Deferred();
    var defaultOptions = {
      type: 'GET',
      dataType: 'json'
    };
    var o = $.extend({}, defaultOptions, options);
    var xhr = $.ajax(o)
      .done(function () {
        var res = arguments[0];
        deferred.resolve.apply(this, arguments);
        xhrReadyCallback(res);
      })
      .fail(function () {
        var res = arguments[0];
        deferred.reject.apply(this, arguments);
      });
    return deferred.promise();
  },
  flash: function(options) {
    var o = $.extend({
      message: 'Error!',
      time: 5000,
      alert: 'danger', //'primary', 'success', 'info', 'warning', 'danger', 'system', 'alert'
      icon: 'remove', //'trophy', 'check', 'info', 'warning', 'remove', 'cubes', 'check'
      autoClose: true
    }, options);
    var messageBlock =
      '<div class="special-alerts">' +
        '<div class="alert alert-'+o.alert+' alert-micro">' +
          '<i class="fa fa-'+o.icon+' pr10"></i>' +
          o.message +
        '</div>' +
      '</div>';
    $('body').append(messageBlock);
    if(o.autoClose) {
      setTimeout(function () {
        $('.special-alerts').remove();
      }, o.time);
    }
  }
};

module.exports = AppConfig;
