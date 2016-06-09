'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var assign = require('react/lib/Object.assign');
var director = require('director');
var AppDispatcher = require('./dispatcher/AppDispatcher');
var ActionTypes = require('./constants/AppConstants');
var AppConfig = require('./appConfig.js');

// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

/**
 * Check if Page component has a layout property; and if yes, wrap the page
 * into the specified layout, then mount to container in config file.
 */
function render(uri, page) {
  var child, props = {
    uri: uri
  };
  var obj = page();
  while (obj.props && obj.props.layout) {
    child = page(props, child);
    props = assign(props, obj.props);
    obj = obj.props.layout;
  }
  if (!obj || typeof obj !== 'function') {
    throw 'Did you set "layout" in "props" for "' + uri + '" route?';
  }
  ReactDOM.render(obj(props, child), AppConfig.container);
}

function verifyToken() {
  var userdata = JSON.parse(localStorage.getItem('userdata'));
  if (userdata && userdata.token) {
    return true;
  } else {
    return true; //Currently always returns
  }
}
$(document).bind('configLoaded', function(){
  console.log('App initialized');
  // Initialize a router
  // Define URL routes
  // See https://github.com/flatiron/director
  var router = new director.Router({
    // Main Route
    '/': function() {
      var page = React.createFactory(require('./pages/Home'));
      render(router.getRoute(), page);
    },
    '/profile': function() {
      if(!verifyToken()) {
        router.setRoute('');
      } else {
        var page = React.createFactory(require('./pages/Profile'));
        render(router.getRoute(), page);
      }
    },
    '/search/:category': function() {
      if(!verifyToken()) {
        router.setRoute('');
      } else {
        var page = React.createFactory(require('./pages/Search'));
        render(router.getRoute(), page);
      }
    },
    '/search/:category/:q': function() {
      if(!verifyToken()) {
        router.setRoute('');
      } else {
        var page = React.createFactory(require('./pages/Search'));
        render(router.getRoute(), page);
      }
    }
  });
  router.configure({
    html5history: false,
    notfound: function() {
      var page = React.createFactory(require('./pages/NotFound'));
      render(router.getRoute(), page);
    }
  });
  router.init('/');

  // Register Main Application Dispatcher
  AppDispatcher.register((payload) => {
    if (payload.actionType === ActionTypes.SET_CURRENT_ROUTE) {
      router.setRoute(payload.route);
    }
    return true; // No errors.  Needed by promise in Dispatcher.
  });
});