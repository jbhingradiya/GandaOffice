/** @jsx React.DOM */

var DEBUG = false;
var React = require('react');
var ReactDOM = require('react-dom');
var AppConfig = require('../appConfig.js');
var Nav = React.createFactory(require('../components/nav.js'));

var Default = React.createClass({
  _getUri: function() {
    var _uri = this.props.uri[0] ? this.props.uri[0] : 'home';
    return _uri;
  },
  getInitialState: function() {
    return {
      userData: AppConfig.getUserData()
    }
  },
  render:function(){
    return (
      <div className={'wrapper '+ this._getUri()}>
        {Nav({uri: this.props.uri})}
        {this.props.children}
      </div>
    )
  },
  statusChangeCallback: function(response) {
    if (response.authResponse) {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
        window.location.href = '/#/profile';
      });
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  },
  /**
   * Life-cycle Methods
   */
  componentWillMount: function() {
    if (DEBUG) {
      console.log('[*] ' + _name + ':componentWillMount ---');
    }
  },
  componentDidMount: function() {
    if (DEBUG) {
      console.log('[*] ' + _name + ':componentDidMount ---');
      console.log(' States:');
      console.log(this.state);
      console.log(' Props:');
      console.log(this.props);
    }

    //Init FB SDK
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1516755558622139',
        cookie     : true,  // enable cookies to allow the server to access the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });

      //FB.getLoginStatus(function(response) {
      //  this.statusChangeCallback(response);
      //}.bind(this));
    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  },
  componentWillUnmount: function() {
    if (DEBUG) {
      console.log('[*] ' + _name + ':componentWillUnmount ---');
    }

  },
  componentWillUpdate: function() {
    var userData = $.extend({}, this.state.userData);
    var updatedUserData = $.extend({}, JSON.parse(localStorage.getItem('userdata')));
    if (!userData.token && updatedUserData.token) {
      this.setState({
        userData: updatedUserData
      });
    }
  }
});

//ReactDOM.render(<Default />, node);
module.exports = Default;
