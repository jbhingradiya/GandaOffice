/** @jsx React.DOM */
var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var DefaultLayout = React.createFactory(require('../layouts/Default'));
var validator = require('validator');
var AppConfig = require('../appConfig.js');
var Masonry = React.createFactory(require('react-masonry-component')(React));
var Book = React.createFactory(require('../components/Book'));
var GBook = React.createFactory(require('../components/GBook'));
var masonryOptions = {gutter: 10};

function getBooks(skip) {
  var userData = AppConfig.getUserData();
  var books = [];
  var data = {
    token: userData.token,
    skip: skip ? skip : 0,
    limit: 20
  };
  AppConfig.ajax({
    url: CONFIG.apiUrl + 'book/grid',
    type: 'POST',
    async: false,
    data: JSON.stringify(data),
    contentType: 'application/json'
  }, function(res){
    if (res.success) {
      books = res.data.content;
    } else {
      AppConfig.flash({alert: 'danger', icon: 'remove', message: res.message.description});
    }
  });
  return books;
}

var Profile = React.createClass({
  mixins: [LinkedStateMixin],
  getDefaultProps: function() {
    return {
      layout: DefaultLayout
    };
  },
  getInitialState: function() {
    var userData = AppConfig.getUserData();
    return {
      userData: userData,
      books: getBooks(),
      search: '',
      startIndex: 0,
      maxResults: 20,
      bookList: {},
      edit: false,
      email: userData.email ? userData.email : '',
      dob: userData.dob ? userData.dob : '',
      gender: userData.gender ? userData.gender : '',
      contact: userData.contact ? userData.contact: '',
      update: false,
      old_password: '',
      password: '',
      re_password: '',
      errors: {}
    }
  },
  _getInitials: function(name) {
    var initials = name ? name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g).splice(0,2).join('').toUpperCase() : '';
    return initials
  },
  _initSearch: function() {
    this.setState({
      startIndex: 0,
      maxResults: 20,
      bookList: {}
    });
  },
  _resetSearch: function() {
    this.setState({
      search: '',
      startIndex: 0,
      maxResults: 20,
      bookList: {}
    });
  },
  _searchGoogleBooks: function(e) {
    var _self = this;
    if(e) {
      e.preventDefault();
      this._initSearch();
    }
    if(this.state.search) {
      AppConfig.g_ajax({
        url: CONFIG.bookApi + '?q=' + this.state.search + '&startIndex=' + this.state.startIndex + '&maxResults=' + this.state.maxResults
      }, function (res) {
        var bookList = _self.state.bookList;
        if (res.totalItems) {

          if (bookList.totalItems)
            bookList.items = bookList.items.concat(res.items);
          else
            bookList = res;

          _self.setState({
            bookList: bookList
          });
        }
      });
    }
  },
  _addBook: function(book) {
    var books = this.state.books;
    books.unshift(book);
    this.setState({
      books: books
    });
  },
  _editProfile: function(e) {
    e.preventDefault();
    this.setState({
      edit: true,
      update: false
    });
  },
  _cancelEditProfile: function(e) {
    if(e) e.preventDefault();
    this.setState({
      edit: false
    });
  },
  _updatePassword: function(e) {
    e.preventDefault();
    this.setState({
      edit: false,
      update: true
    });
  },
  _cancelUpdatePassword: function(e) {
    if(e) e.preventDefault();
    this.setState({
      old_password: '',
      password: '',
      re_password: '',
      update: false,
      edit: false
    });
  },
  _savePassword: function(e) {
    e.preventDefault();
    var _self = this;
    var formData = this.state;
    var errors = {};
    var isValid = true;
    if(validator.isNull(formData.old_password)) {
      isValid = false;
      errors.old_password = "Old Password is required."
    } else {
      errors.old_password = ""
    }
    if(!validator.isLength(formData.password, 5)) {
      isValid = false;
      errors.password = "Password should be at least 5 characters long."
    } else {
      errors.password = ""
    }
    if(formData.password != formData.re_password) {
      isValid = false;
      errors.re_password = "Re entered password should match password."
    } else {
      errors.re_password = ""
    }
    if (isValid) {
      errors = {};
      var data = {
        token: this.state.userData.token,
        old_password: this.state.old_password,
        password: this.state.password
      };
      AppConfig.ajax({
        url: CONFIG.apiUrl + 'auth/changePassword',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
      }, function(res){
        if (res.success) {
          _self._cancelUpdatePassword();
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
  render:function(){
    var _self = this;
    var userData = this.state.userData;
    var books = this.state.books;
    return (
      <div>
        <section className="">
          <div className="container">
            <div className="media">
              <div className="media-left clearfix mnw300 mw400 pr20">
                <div className="media-left-wrapper clearfix">
                  <div className="text-center">
                    <div className="profile_pic">
                      <span className="initials">{this._getInitials(userData.name)}</span>
                      {userData.google_pic ?
                        <img src={userData.google_pic} alt="avatar" />
                      : null}
                      {userData.fb_id && userData.fb_id != 0 ?
                        <img src={"https://graph.facebook.com/v2.5/"+userData.fb_id+"/picture?debug=all&format=json&method=get&pretty=0&suppress_http_code=1&type=square&width=120&height=120"} alt="avatar" />
                      : null}
                    </div>
                    <h3 className="text-primary">{userData.name}</h3>
                    <hr />
                  </div>
                  {this.state.edit ?
                    <div className="clearfix mt20 pb10 br-b">
                      <div className={this.state.errors.email ? 'form-group has-error' : 'form-group'}>
                        <input type="email" name="email" className="form-control" valueLink={this.linkState('email')} placeholder="Enter your email" />
                        {this.state.errors.email ? <p className="help-block small">{this.state.errors.email}</p> : null}
                      </div>
                      <div className={this.state.errors.dob ? 'form-group has-error' : 'form-group'}>
                        <input type="date" name="dob" className="form-control" valueLink={this.linkState('dob')} placeholder="Date of Birth" />
                        {this.state.errors.dob ? <p className="help-block small">{this.state.errors.dob}</p> : null}
                      </div>
                      <div className={this.state.errors.contact ? 'form-group has-error' : 'form-group'}>
                        <input type="text" name="contact" className="form-control" valueLink={this.linkState('contact')} placeholder="Mobile No." />
                        {this.state.errors.contact ? <p className="help-block small">{this.state.errors.contact}</p> : null}
                      </div>
                      <div className="form-group pull-right mn">
                        <a href="#" onClick={this._cancelEditProfile} className="small lh30 text-muted">Cancel</a>
                      </div>
                      <button type="submit" className="btn btn-sm btn-primary pull-left">Save Profile</button>
                    </div>
                  :
                    <div className="clearfix">
                      {userData.email ?
                        <p className="mb10 fs13"><span className="text-muted">Email:</span> {userData.email}</p>
                      : null}
                      {userData.contact ?
                        <p className="mb10 fs13"><span className="text-muted">Mobile No.:</span> {userData.contact}</p>
                        : null}
                      {userData.dob ?
                        <p className="mb10 fs13"><span className="text-muted">DOB:</span> {userData.dob}</p>
                      : null}
                      {userData.gender ?
                        <p className="mb10 fs13"><span className="text-muted">Gender:</span> {userData.gender}</p>
                      : null}
                      <p className="mt10 mbn small">
                        <a href="#" onClick={this._editProfile}><i className="fa fa-pencil-square-o mr5"></i>Edit Profile</a>
                      </p>
                    </div>
                  }
                  {this.state.update ?
                    <div className="clearfix mt20 pb10 br-b">
                      <form className="form-vertical" name="savePassword" onSubmit={this._savePassword} noValidate="novalidate">
                        <div className={this.state.errors.old_password ? 'form-group has-error' : 'form-group'}>
                          <input type="password" name="old-password" className="form-control" valueLink={this.linkState('old_password')} placeholder="Enter your old password" />
                          {this.state.errors.old_password ? <p className="help-block small">{this.state.errors.old_password}</p> : null}
                        </div>
                        <div className={this.state.errors.password ? 'form-group has-error' : 'form-group'}>
                          <input type="password" name="password" className="form-control" valueLink={this.linkState('password')} placeholder="Enter new password" />
                          {this.state.errors.password ? <p className="help-block small">{this.state.errors.password}</p> : null}
                        </div>
                        <div className={this.state.errors.re_password ? 'form-group has-error' : 'form-group'}>
                          <input type="password" name="confirm-password" className="form-control" valueLink={this.linkState('re_password')} placeholder="Re-enter new password" />
                          {this.state.errors.re_password ? <p className="help-block small">{this.state.errors.re_password}</p> : null}
                        </div>
                        <div className="form-group pull-right mn">
                          <a href="#" onClick={this._cancelUpdatePassword} className="small lh30 text-muted">Cancel</a>
                        </div>
                        <button type="submit" className="btn btn-sm btn-primary pull-left">Save Password</button>
                      </form>
                    </div>
                  :
                    <p className="mt10 mb10 small">
                      <a href="#" onClick={this._updatePassword}><i className="fa fa-lock mr5"></i>Change Password</a>
                    </p>
                  }
                </div>
              </div>
              <div className="media-body clearfix">
                <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                  <div className="panel panel-default">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <div className="panel-heading" role="tab" id="headingOne">
                        <h4 className="panel-title fs20">
                          My Books
                        </h4>
                      </div>
                    </a>
                    <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                      <div className="panel-body">
                        {books && books.length ?
                          <Masonry className={'col-md-12 pn masonry1'} options={masonryOptions} ref={(c) => this.masonry1 = c}>
                            {books.map(function(item, index) {
                              return (
                                <div className="grid-item mb10" key={index}>
                                  <Book book={item} isMine="true" />
                                </div>
                              )
                            })}
                          </Masonry>
                          :
                          <p className="text-muted fs12">No books added to your list!</p>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      <div className="panel-heading" role="tab" id="headingTwo">
                        <h4 className="panel-title fs20">
                          Add Books
                        </h4>
                      </div>
                    </a>
                    <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                      <div className="panel-body">
                        <div className="col-md-12 pn">
                          <form className="form-vertical" name="searchForm" onSubmit={this._searchGoogleBooks} noValidate="novalidate">
                            <div className="form-group">
                              <input type="text" className="form-control" placeholder="Search your book on Google Books..."
                                     valueLink={this.linkState('search')} />
                              <span className="fa fa-times-circle" title="Clear" onClick={this._resetSearch}></span>
                            </div>
                          </form>
                        </div>
                        {this.state.bookList.totalItems ?
                          <Masonry className={'col-md-12 pn grid'} options={masonryOptions} ref={(c) => this.masonry2 = c}>
                            {this.state.bookList.items.map(function(item, index) {
                              return (
                                <div className="grid-item mb10" key={index}>
                                  <GBook book={item} addBook={_self._addBook} />
                                </div>
                              )
                            })}
                          </Masonry>
                        : null}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    )
  },
  componentDidMount: function() {
    var _self = this;
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() == $(document).height()) {
        _self.setState({
          startIndex: _self.state.startIndex + _self.state.maxResults
        });
        _self._searchGoogleBooks();
      }
    });
    $('#accordion').on('shown.bs.collapse', function (e) {
      if("collapseOne" == e.target.id) {
        _self.masonry1 && _self.masonry1.performLayout();
      } else {
        _self.masonry2 && _self.masonry2.performLayout();
      }
    });
  },
  componentWillUnmount: function() {
    $(window).unbind('scroll');
  }
});

module.exports = Profile;