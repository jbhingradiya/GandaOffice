/** @jsx React.DOM */
var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var TaggedInput = React.createFactory(require('react-tagged-input'));
var validator = require('validator');
var AppConfig = require('../appConfig.js');

var ReferModal = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {
      emails: []
    }
  },
  _addTag: function(tag) {
    var emails = this.state.emails;
    emails.push(tag);
    this.setState({
     emails: emails
    });
  },
  _removeTag: function(tag) {
    var emails = this.state.emails;
    var index = this.state.emails.indexOf(tag);
    emails.splice(index, 1);
    this.setState({
      emails: emails
    });
  },
  _sendInvite: function(e) {
    e.preventDefault();
    this.setState({
      emails: []
    });
    $('#referModal').modal('hide');
    AppConfig.flash({alert: 'warning', icon: 'warning', message: "When complete, this feature will send Invite Email to mentioned Email addresses."});
  },
  render:function(){
    return (
      <div className="modal fade" tabIndex="-1" role="dialog" id="referModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Invite your friends via Email</h4>
            </div>
            <div className="modal-body">
              <form className="form-vertical" name="inviteForm" onSubmit={this._sendInvite} noValidate="novalidate">
                <div className="form-group">
                  <TaggedInput
                    autofocus={true}
                    backspaceDeletesWord={true}
                    placeholder={'Enter emails of your friends'}
                    tags={this.state.emails}
                    onAddTag={this._addTag}
                    onRemoveTag={this._removeTag}
                    tagOnBlur={false}
                    clickTagToEdit={true}
                    unique={true}
                    removeTagLabel={"\u274C"}
                    onBeforeAddTag={function (tagText) {return validator.isEmail(tagText)}}
                    onBeforeRemoveTag={function (tagText) {return true;}}
                    />
                  <p className="help-block text-muted small"><i className="fa fa-info-circle mr5"></i>Enter space to add Email. Only valid emails are accepted.</p>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" disabled={!this.state.emails.length} onClick={this._sendInvite}>Invite</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ReferModal;
