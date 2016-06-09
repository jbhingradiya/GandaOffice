var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../constants/AppConstants');

var DEBUG = false;
var CHANGE_EVENT = 'change';
var _name = "AppStore";
var _appData = {};

var AppStore = assign({}, EventEmitter.prototype, {
  // Emit Change event
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  // Remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  },

  getData: function() {
    return _appData;
  },

  setData: function(data) {
    _appData = data;
    return _appData;
  }
});

AppDispatcher.register(function(payload){
  var action = payload.actionType;

  if (DEBUG) {
    console.log('[*] ' + _name + ':Dispatch-Begin --- ' + action);
    console.log('     Payload:');
    console.log(payload);
  }

  // Route Logic
  switch (action) {
    case AppConstants.APP_SET_DATA:
      AppStore.setData(payload.data);
      break;

    default:
      if (DEBUG) {
        console.log('[x] ' + _name + ':actionType --- NOT MATCH');
      }
      return true;
  }

  // If action was responded to, emit change event
  AppStore.emitChange();

  if (DEBUG) {
    console.log('[*] ' + _name + ':emitChange ---');
  }

  return true;
});

module.exports = AppStore;
