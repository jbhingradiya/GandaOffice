/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var validator = require('validator');
var AppConfig = require('../appConfig.js');

validator.extend('isAlphanumericSpaces', function (str) {
    return /^[A-Za-z\d\s]+$/.test(str);
});

var Login = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {
        return {
            userData: AppConfig.getUserData(),
            sEmail: '',
            sPassword: '',
            name: '',
            email: '',
            password: '',
            re_password: '',
            forgot: false,
            errors: {}
        }
    },
    _startApp: function () {
        var self = this;
        gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            auth2 = gapi.auth2.init({
                client_id: '1038751996343-kmasgoa5j9j9f9scfoubk0sgguhsk085.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin'
            });
            var element = document.getElementById('customBtn');
            if (element) {
                element.addEventListener("click", function (event) {
                    event.preventDefault()
                });
                self._googleLogin(element);
            }
        });
    },
    _forgot: function (e) {
        e.preventDefault();
        this.setState({
            forgot: true
        });
    },
    _cancelForgot: function (e) {
        if (e) e.preventDefault();
        this.setState({
            forgot: false
        });
    },
    _fbLogin: function (e) {
        e.preventDefault();
        $('#loginModal').modal('hide');
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', {fields: 'id, name, email'}, function (response) {
                    var data = {
                        fb_id: response.id,
                        name: response.name,
                        email: response.email
                    };
                    AppConfig.ajax({
                        url: CONFIG.apiUrl + 'auth/logInFacebook',
                        type: 'POST',
                        data: JSON.stringify(data),
                        contentType: 'application/json'
                    }, function (res) {
                        if (res.success) {
                            $('#loginModal').modal('hide');
                            if (res.data) {
                                localStorage.setItem('userdata', JSON.stringify(res.data));
                                window.location.href = '/#/profile';
                            }
                            AppConfig.flash({alert: 'success', icon: 'check', message: res.message.description});
                        } else {
                            AppConfig.flash({alert: 'danger', icon: 'remove', message: res.message.description});
                        }
                    });
                });
            }
        }, {scope: 'public_profile,email,user_friends'});
    },
    _googleLogin: function (e) {
        auth2.attachClickHandler(e, {},
            function (googleUser) {
                var profile = googleUser.getBasicProfile();
                var data = {
                    google_id: profile.getId(),
                    name: profile.getName(),
                    email: profile.getEmail(),
                    google_pic: profile.getImageUrl()
                };
                data.google_pic = data.google_pic.replace('s96-c', 's120-c');
                AppConfig.ajax({
                    url: CONFIG.apiUrl + 'auth/logInGoogle',
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json'
                }, function (res) {
                    if (res.success) {
                        $('#loginModal').modal('hide');
                        if (res.data) {
                            localStorage.setItem('userdata', JSON.stringify(res.data));
                            window.location.href = '/#/profile';
                        }
                        AppConfig.flash({alert: 'success', icon: 'check', message: res.message.description});
                    } else {
                        AppConfig.flash({alert: 'danger', icon: 'remove', message: res.message.description});
                    }
                });
            }, function (error) {
                var errorMessage = JSON.stringify(error, undefined, 2);
                AppConfig.flash({alert: 'danger', icon: 'remove', message: errorMessage});
            });
    },
    _signInSubmit: function (e) {
        e.preventDefault();
        var formData = this.state;
        var errors = {};
        var isValid = true;
        if (!validator.isEmail(formData.sEmail)) {
            isValid = false;
            errors.sEmail = "Email is required. Not a valid Email."
        } else {
            errors.sEmail = ""
        }
        if (!validator.isLength(formData.sPassword, 5)) {
            isValid = false;
            errors.sPassword = "Password should be at least 5 characters long."
        } else {
            errors.sPassword = ""
        }
        if (isValid) {
            errors = {};
            var data = {
                email: this.state.sEmail,
                password: this.state.sPassword
            };
            AppConfig.ajax({
                url: CONFIG.apiUrl + 'auth/logInEmail',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }, function (res) {
                if (res.success) {
                    $('#loginModal').modal('hide');
                    if (res.data) {
                        localStorage.setItem('userdata', JSON.stringify(res.data));
                        window.location.href = '/#/profile';
                    }
                    AppConfig.flash({alert: 'success', icon: 'check', message: res.message.description});
                } else {
                    AppConfig.flash({alert: 'danger', icon: 'remove', message: res.message.description});
                }
            });
        } else {
            console.log('invalid');
        }
        this.setState({
            errors: errors
        });
    },
    _signUpSubmit: function (e) {
        e.preventDefault();
        var formData = this.state;
        var errors = {};
        var isValid = true;
        if (!validator.isAlphanumericSpaces(formData.name)) {
            isValid = false;
            errors.name = "Name is required. Special characters are not allowed."
        } else {
            errors.name = ""
        }
        if (!validator.isEmail(formData.email)) {
            isValid = false;
            errors.email = "Email is required. Not a valid Email."
        } else {
            errors.email = ""
        }
        if (!validator.isLength(formData.password, 5)) {
            isValid = false;
            errors.password = "Password should be at least 5 characters long."
        } else {
            errors.password = ""
        }
        if (formData.password != formData.re_password) {
            isValid = false;
            errors.re_password = "Re entered password should match password."
        } else {
            errors.re_password = ""
        }
        if (isValid) {
            errors = {};
            var data = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            };
            AppConfig.ajax({
                url: CONFIG.apiUrl + 'auth/signUpEmail',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }, function (res) {
                if (res.success) {
                    $('#loginModal').modal('hide');
                    if (res.data) {
                        localStorage.setItem('userdata', JSON.stringify(res.data));
                        window.location.href = '/#/profile';
                    }
                    AppConfig.flash({alert: 'success', icon: 'check', message: res.message.description});
                } else {
                    AppConfig.flash({alert: 'danger', icon: 'remove', message: res.message.description});
                }
            });
        } else {
            console.log('invalid');
        }
        this.setState({
            errors: errors
        });
    },
    _forgotPassword: function (e) {
        e.preventDefault();
        var _self = this;
        var formData = this.state;
        var errors = {};
        var isValid = true;
        if (!validator.isEmail(formData.sEmail)) {
            isValid = false;
            errors.sEmail = "Email is required. Not a valid Email."
        } else {
            errors.sEmail = ""
        }
        if (isValid) {
            errors = {};
            var data = {
                email: this.state.sEmail
            };
            AppConfig.ajax({
                url: CONFIG.apiUrl + 'auth/forgotPassword',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }, function (res) {
                if (res.success) {
                    _self._cancelForgot();
                    AppConfig.flash({alert: 'success', icon: 'check', message: res.message.description});
                } else {
                    AppConfig.flash({alert: 'danger', icon: 'remove', message: res.message.description});
                }
            });
        } else {
            console.log('invalid');
        }
        this.setState({
            errors: errors
        });
    },
    componentDidMount: function () {
        //Init Google SDK
        this._startApp();
    },
    render: function () {
        return (
            <div className="modal fade" tabIndex="-1" role="dialog" id="loginModal">
                <div className="modal-dialog clearfix modal-sm">
                    <div className="modal-content clearfix">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        </div>
                        <div className="modal-body col-sm-12">
                            <div className="col-sm-12">
                                <ul className="nav nav-pills fs16" role="tablist">
                                    <li role="presentation" className="active"><a href="#signin" aria-controls="signin"
                                                                                  role="tab" data-toggle="tab">Sign
                                        In</a></li>
                                    <li role="presentation" className="ml20"><a href="#signup" aria-controls="signup"
                                                                                role="tab" data-toggle="tab">Sign Up</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div role="tabpanel" className="tab-pane active pt40 pb20" id="signin">
                                        {this.state.forgot ?
                                            <div className="login-register-page__content">
                                                <form onSubmit={this._forgotPassword} noValidate="novalidate">
                                                    <div
                                                        className={this.state.errors.sEmail ? 'form-item has-error' : 'form-item'}>
                                                        <label>Email</label>
                                                        <input type="email" name="email"
                                                               valueLink={this.linkState('sEmail')}
                                                               placeholder="Enter your email"/>
                                                    </div>
                                                    <a href="#" className="forgot-password"
                                                       onClick={this._cancelForgot}>Cancel</a>
                                                    <div className="form-actions">
                                                        <input type="submit" value="Recover"/>
                                                    </div>
                                                </form>
                                            </div>
                                            :
                                            <div className="login-register-page__content">
                                                <form>
                                                    <div className="form-item">
                                                        <label>Email</label>
                                                        <input type="email"/>
                                                    </div>
                                                    <div className="form-item">
                                                        <label>Password</label>
                                                        <input type="password"/>
                                                    </div>
                                                    <a href="#" className="forgot-password" onClick={this._forgot}>Forgot
                                                        Password</a>
                                                    <div className="form-actions">
                                                        <input type="submit" value="Log In"/>
                                                    </div>
                                                </form>

                                            </div>
                                        }
                                    </div>
                                    <div role="tabpanel" className="tab-pane pt40 pb20" id="signup">

                                        <div className="login-register-page__content">
                                            <form>
                                                <div className="form-item">
                                                    <label>Email</label>
                                                    <input type="email"/>
                                                </div>
                                                <div className="form-item">
                                                    <label>Password</label>
                                                    <input type="password"/>
                                                </div>
                                                <div className="form-item">
                                                    <label>Confirm password</label>
                                                    <input type="password"/>
                                                </div>
                                                <a href="#" className="terms-conditions">By registering, you accept
                                                    terms &amp; conditions</a>
                                                <div className="form-actions">
                                                    <input type="submit" value="Register"/>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Login;