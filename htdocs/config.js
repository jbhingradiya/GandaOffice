var CONFIG = {};
(function ($) {
  /** Load config and then initiate App */
  function fetchConfig() {
    var systemEnvironment = "local";
    //var domain = "agitix.com";
    //var configUrl = systemEnvironment != 'prod' ? "//bfd-config-" + systemEnvironment + "." + domain + "/config.json" : "//config." + domain + "/config.json";
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
        siteUrl: 'http://www.bookiefoodie.com/',
        apiUrl: 'https://bfd-api-' + systemEnvironment + '.' + domain + '/app/1.0/',
        bookApi: 'https://www.googleapis.com/books/v1/volumes'
      };
      setTimeout(function () {
        console.log('config loaded');
        $(document).trigger('configLoaded');
      }, 300);
    }
  }
  fetchConfig();
})(jQuery);
