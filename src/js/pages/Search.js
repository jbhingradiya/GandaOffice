/** @jsx React.DOM */

var DEBUG = false;
var _name = "Search";
var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var DefaultLayout = React.createFactory(require('../layouts/Default'));
var validator = require('validator');
var AppConfig = require('../appConfig.js');
var Masonry = React.createFactory(require('react-masonry-component')(React));
var BookSlider = React.createFactory(require('../components/bookSlider'));
var Book = React.createFactory(require('../components/Book'));
var GBook = React.createFactory(require('../components/GBook'));
var masonryOptions = {gutter: 10};
var books = [
  {
    id: "1",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "2",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "3",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "4",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "5",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "6",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "7",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "8",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "9",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  },
  {
    id: "10",
    title: "Book Title",
    authors: ["Author Name"],
    thumbnail: "../assets/img/book-placeholder.jpg"
  }
];

function searchGoogleBooks(search, startIndex, maxResults) {
  var bookList = [];
  AppConfig.g_ajax({
    url: CONFIG.bookApi + '?q=' + search + '&startIndex=' + startIndex + '&maxResults=' + maxResults,
    async: false
  }, function (res) {
    if (res.totalItems) {
      bookList = res.items;
    }
  });
  return bookList;
}

var Search = React.createClass({
  mixins: [LinkedStateMixin],
  getDefaultProps: function() {
    return {
      layout: DefaultLayout
    };
  },
  getInitialState: function() {
    var userData = AppConfig.getUserData();
    var category = this.props.uri[1] ? this.props.uri[1] : '';
    var search = this.props.uri[2] ? decodeURI(this.props.uri[2]) : '';
    return {
      userData: userData,
      books: [
          {
          id: "1",
          title: "Book Title",
          authors: ["Author Name"],
          thumbnail: "../assets/img/book-placeholder.jpg"
        },
        {
          id: "2",
          title: "Book Title",
          authors: ["Author Name"],
          thumbnail: "../assets/img/book-placeholder.jpg"
        },
        {
          id: "3",
          title: "Book Title",
          authors: ["Author Name"],
          thumbnail: "../assets/img/book-placeholder.jpg"
        }
      ],
      category: category,
      search: search,
      startIndex: 0,
      maxResults: 20,
      bookList: "list" == category ? searchGoogleBooks(search, 0, 20) : "rent" == category ? books : [],
      groupList: []
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
      bookList: []
    });
  },
  _resetSearch: function() {
    this.setState({
      search: '',
      startIndex: 0,
      maxResults: 20,
      bookList: []
    });
  },
  _searchGoogleBooks: function(e) {
    if(e) {
      e.preventDefault();
      this._initSearch();
    }
    if(this.state.category && this.state.search) {
      var search = encodeURI(this.state.search).replace(/'/g, "%27"),
          category = this.state.category,
          startIndex = this.state.startIndex,
          maxResults = this.state.maxResults;
      window.location.href = '/#/search/'+category+'/'+search;
      this.setState({
        bookList: searchGoogleBooks(search, startIndex, maxResults)
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
  },
  render:function(){
    var _self = this;
    var category = this.state.category;
    var bookList = this.state.bookList;
    var suggestions = this.state.books;
    var groupList = this.state.groupList;
    return (
      <div>
        <section className="">
          <div className="container">
            {category ?
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="col-md-12 pn">
                    {"rent" == category ?
                      <form className="form-vertical search-form" name="searchForm" onSubmit={this._searchGoogleBooks} noValidate="novalidate">
                        <div className="form-group mn">
                          <div className="input-group">
                            <input type="text" className="form-control" autoFocus="true" placeholder="Search by Title, Author or ISBN" valueLink={this.linkState('search')} />
                            <span className="input-group-addon pn">
                              <button type="submit" className="btn btn-primary" data-category="rent">Find The Book</button>
                            </span>
                          </div>
                        </div>
                      </form>
                    : "list" == category ?
                      <form className="form-vertical search-form" name="searchForm" onSubmit={this._searchGoogleBooks} noValidate="novalidate">
                        <div className="form-group mn">
                          <div className="input-group">
                            <input type="text" className="form-control" autoFocus="true" placeholder="Search by Title, Author or ISBN" valueLink={this.linkState('search')} />
                            <span className="input-group-addon pn">
                              <button type="submit" className="btn btn-primary" data-category="list">List Your Book</button>
                            </span>
                          </div>
                        </div>
                      </form>
                    : "join" == category ?
                      <form className="form-vertical search-form" autoFocus="true" name="searchForm" onSubmit={this._searchGoogleBooks} noValidate="novalidate">
                        <div className="form-group mn">
                          <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search by Title, Author or ISBN" valueLink={this.linkState('search')} />
                            <span className="input-group-addon pn">
                              <button type="submit" className="btn btn-primary" data-category="join">Find Groups</button>
                            </span>
                          </div>
                        </div>
                      </form>
                    : null}
                  </div>
                </div>
              </div>
            : null}
            {"rent" == category ?
              <div className="clearfix">
                {bookList && bookList.length ?
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <div className="col-md-12 pn">
                        <Masonry className={'col-md-12 pn grid'} options={masonryOptions} ref={(c) => this.masonry1 = c}>
                          {bookList.map(function(item, index) {
                            return (
                              <div className="mb10" key={index}>
                                <Book book={item} />
                              </div>
                            )
                          })}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                : null}
                {suggestions && suggestions.length ?
                  <div className="col-md-12 pn">
                    <h4>Recommended for you</h4>
                    <BookSlider books={suggestions} />
                  </div>
                : null}
              </div>
            : null}
            {"list" == category ?
              <div className="clearfix">
                {bookList && bookList.length ?
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <div className="col-md-12 pn">
                        <Masonry className={'col-md-12 pn grid'} options={masonryOptions} ref={(c) => this.masonry2 = c}>
                          {bookList.map(function(item, index) {
                            return (
                              <div className="mb10" key={index}>
                                <GBook book={item} addBook={_self._addBook} />
                              </div>
                            )
                          })}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                : null}
              </div>
            : null}
            {"join" == category ?
              <div className="clearfix">
                {groupList && groupList.length ?
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <div className="col-md-12 pn">

                      </div>
                    </div>
                  </div>
                :
                  <div className="alert alert-warning" role="alert">
                    <p>It's sad! No one has created any group yet.</p>
                    <p>But also an opportunity for you to be the first to <a className="page-scroll" href="#">create a public or private group</a> and invite your friends to join.</p>
                    <p>This is a best way to get the like minded people together to share the thoughts on what they are reading.</p>
                  </div>
                }
              </div>
            : null}
          </div>
        </section>
      </div>
    )
  }
});

module.exports = Search;