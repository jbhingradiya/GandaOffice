/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');

var Book = React.createClass({
  render: function () {
    var book = this.props.book;
    return (
      <div className="book thumbnail p10">
        <img src={book.thumbnail} alt={book.title} />
        <div className="caption pn">
          <h5 className="mb5">{book.title}</h5>
          <p className="fs12 mbn">{book.authors.join(", ")}</p>
        </div>
        <div className="book-overlay text-center">
          {this.props.isMine ?
            <button className="btn btn-primary btn-sm">View</button>
            :
            <button className="btn btn-primary btn-sm">Add to Basket</button>
          }
        </div>
      </div>
    )
  }
});

module.exports = Book;