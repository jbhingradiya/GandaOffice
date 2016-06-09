var CONFIG = {};
(function ($) {
  /** Load config and then initiate App */
  function fetchConfig() {
    var systemEnvironment = "local";

    if (systemEnvironment != 'local') {
      $.ajax({
        url: configUrl,
        dataType: 'JSONP',
        type: 'GET',
        jsonpCallback: 'callback',
        crossDomain: true,
        success: function (json) {
          CONFIG = json;
          console.log('config loaded');
          $(document).trigger('configLoaded');
        },
        error: function (error) {
          console.log("Failed to Load JSON File");
        }
      });
    } else {
      domain = "realmile.com";
      CONFIG = {
        siteUrl: 'http://www.myoffice.com/',
        apiUrl: 'https://mfo-api-' + systemEnvironment + '.' + domain + '/app/1.0/',
      };
      setTimeout(function () {
        console.log('config loaded');
        $(document).trigger('configLoaded');
      }, 300);
    }
  }
  fetchConfig();
})(jQuery);
