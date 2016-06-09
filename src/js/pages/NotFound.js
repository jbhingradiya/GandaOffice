/**
 * @jsx React.DOM
 */
'use strict';

var DEBUG = false;
var _name = 'NotFound.js';
var React = require('react');
var DefaultLayout = React.createFactory(require('../layouts/Default'));

var NotFound = React.createClass({
  displayName: _name,
  getDefaultProps: function() {
    return {
      layout: DefaultLayout
    };
  },
  render: function() {
    return (
      <section id="content_wrapper" className="error-page">
        <section id="content" className="pn">
          <div className="center-block mt50 mw800">
            <h1 className="error-title"> 404! </h1>
            <h2 className="error-subtitle">Page Not Found.</h2>
          </div>
        </section>
      </section>
    );
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
  },
  componentWillUnmount: function() {
    if (DEBUG) {
      console.log('[*] ' + _name + ':componentWillUnmount ---');
    }
  }
});

module.exports = NotFound;
