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
            <section className="travelling-block-section-demo awe-parallax">
                <div className="container">
                    <div className="travelling-block text-left">
                        <div className="row">
                            <div className="col-md-6 col-sm-7">
                                <form action="" method="POST" role="form">
                                    <legend><h2>I am travelling for</h2></legend>
                                    <div className="row">
                                        <div class="travelling-tabs__advance-filter">
                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                <div className="form-group">
                                                    <label className="title">From</label>
                                                    <div className="input-group">
                                                        <input type="text"
                                                               placeholder="Ho Chi Minh, Hanoi, Vietnam"
                                                               className="form-control input-lg"
                                                               aria-describedby="basic-addon1"/>
                                                                    <span className="input-group-addon"
                                                                          id="basic-addon1 "><i
                                                                        className="awe-icon awe-icon-marker-1"></i></span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="title">Depart on</label>
                                                    <div className="input-group">
                                                        <input type="text" className="awe-calendar"
                                                               placeholder="Check in"
                                                               className="form-control awe-calendar"
                                                               aria-describedby="basic-addon1"/>
                                                                    <span className="input-group-addon"
                                                                          id="basic-addon1 ">
                                                                        <i className="awe-icon awe-icon-calendar"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                <div className="form-group">
                                                    <label className="title">To</label>
                                                    <div className="input-group">
                                                        <input type="text"
                                                               placeholder="Ho Chi Minh, Hanoi, Vietnam"
                                                               className="form-control input-lg"
                                                               aria-describedby="basic-addon1"/>
                                                                    <span className="input-group-addon"
                                                                          id="basic-addon1 "><i
                                                                        className="awe-icon awe-icon-marker-1"></i></span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="title">End on</label>
                                                    <div className="input-group">
                                                        <input type="text" className="awe-calendar"
                                                               placeholder="Check in"
                                                               className="form-control awe-calendar"
                                                               aria-describedby="basic-addon1"/>
                                                                    <span className="input-group-addon"
                                                                          id="basic-addon1 ">
                                                                        <i className="awe-icon awe-icon-calendar"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="awe-btn search-btn">Search</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-offset-1 col-sm-offset-1 col-md-5 col-sm-4">
                                <h2>How it works</h2>
                                <p>
                                    One of the biggest improvements to my workflow over the last few
                                    months
                                    has been to create a live template for anything I find myself
                                    doing
                                    more
                                    than twice a day.

                                    This new sub forum seems like a good place to share these
                                    templates
                                    and
                                    I would love to see any you have created and are particularly
                                    fond
                                    of.

                                    Rather than just exporting all your templates into a file, I
                                    think
                                    it is
                                    probably better to just include them in a post with the
                                    following
                                    format:
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

module.exports = Login;