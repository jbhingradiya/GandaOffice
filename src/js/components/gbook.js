/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var AppConfig = require('../appConfig.js');

var GBook = React.createClass({
  _addBook: function() {
    var _self = this;
    var userData = AppConfig.getUserData();
    var item = this.props.book;
    var book = {
      token: userData.token,
      google_id: item.id,
      kind: item.kind,
      title: item.volumeInfo.title,
      self_link: item.selfLink,
      description: item.volumeInfo.description ? item.volumeInfo.description : '',
      authors: item.volumeInfo.authors ? item.volumeInfo.authors : [''],
      thumbnail: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail ? item.volumeInfo.imageLinks.thumbnail : '',
      page_count: item.volumeInfo.pageCount ? item.volumeInfo.pageCount : 0
    };
    AppConfig.ajax({
      url: CONFIG.apiUrl + 'book/save',
      type: 'POST',
      data: JSON.stringify(book),
      contentType: 'application/json'
    }, function(res){
      if (res.success) {
        _self.props.addBook(book);
        AppConfig.flash({alert: 'success', icon: 'check', message: res.message.description});
      } else {
        AppConfig.flash({alert: 'danger', icon: 'remove', message: res.message.description});
      }
    });
  },
  render: function () {
    var book = this.props.book;
    return (
      <div className="book thumbnail p10">
        {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ?
          <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
        : null}
        <div className="caption pn">
          <h5 className="mb5">{book.volumeInfo.title}</h5>
          {book.volumeInfo.authors ?
            <p className="fs12 mbn">{book.volumeInfo.authors.join(', ')}</p>
          : null}
          {book.volumeInfo.description ?
            book.volumeInfo.description.length > 200 ?
              <p className="fs12 mt10 mbn text-muted">{book.volumeInfo.description.substr(0, 200)}...</p>
            :
              <p className="fs12 mt10 mbn text-muted">{book.volumeInfo.description}</p>
          : null}
        </div>
        <div className="book-overlay text-center">
          <button className="btn btn-primary btn-sm" onClick={this._addBook}>Add to my list</button>
        </div>
      </div>
    )
  }
});

module.exports = GBook;