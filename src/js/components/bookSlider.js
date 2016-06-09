/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var Book = React.createFactory(require('../components/Book'));

var BookSlider = React.createClass({
  componentDidMount: function() {
    $('.book-slider').slick({
      infinite: false,
      dots: false,
      speed: 300,
      slidesToShow: 7,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 1250,
          settings: {
            slidesToShow: 6
          }
        },
        {
          breakpoint: 1020,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 692,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  },
  render: function () {
    var books = this.props.books;
    return (
      <div className="row book-slider mt20">
        {books && books.length ?
          books.map(function(book, index){
            return (
              <div className="pl10 pr10" key={index}>
                <Book book={book} />
              </div>
            )
          })
        : null}
      </div>
    );
  }
});

module.exports = BookSlider;
