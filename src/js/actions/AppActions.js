var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AppConfig = require('../appConfig.js');

var AppActions = {
  setData: function(){
    var data = {
      counts: {
        readers: 7000,
        books: 20000,
        referrals: 4000,
        stores: 18
      },
      popular: [
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
      ]
    };
    AppDispatcher.handleViewAction({
      actionType: AppConstants.APP_SET_DATA,
      data: data
    })
  }
};

module.exports = AppActions;