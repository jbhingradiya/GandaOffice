/** @jsx React.DOM */
var React = require('react');
var ReactDOM = require('react-dom');
var Login = React.createFactory(require('../components/Login'));

var Nav = React.createClass({
    _getUri: function () {
        var _uri = this.props.uri[0] ? this.props.uri[0] : 'home';
        return _uri;
    },
    _getInitials: function (name) {
        var initials = name ? name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g).splice(0, 2).join('').toUpperCase() : '';
        return initials
    },
    _logout: function (e) {
        e.preventDefault();
        localStorage.removeItem('userdata');
        window.location.href = '';
    },
    render: function () {
        return (
            <header id="header-page">
                <div className="">
                    <div className="container">
                        <div className="logo">
                            <a href="index.html"><img src="assets/images/logo.png" alt=""/></a>
                        </div>
                        <nav className="navigation awe-navigation" data-responsive="1200">
                            <ul className="menu-list">
                                <li className="menu-item-has-children">
                                    <a href="contact.html" data-toggle="modal" data-target="#loginModal">
                                        Sign In / Sign Up
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <a className="toggle-menu-responsive" href="#">
                            <div className="hamburger">
                                <span className="item item-1"></span>
                                <span className="item item-2"></span>
                                <span className="item item-3"></span>
                            </div>
                        </a>
                    </div>
                </div>
            </header>
        )
    }
});

//ReactDOM.render(<Nav />, node);
module.exports = Nav;
