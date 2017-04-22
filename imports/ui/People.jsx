import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Events } from '../api/events.js';
import User from './Components/User.jsx';


// App component - represents the whole app
class People extends Component {
  constructor(props) {
	  super(props);
	  console.log(this.props.event)
  }

 renderUsers() {  
  return this.props.users.map((user) => (
	  <User userId={user._id} currentUser={user} event={this.props.event} />
	));
  }

  render() {
	return (
		<div className="contentBLock">
				<ul>
		  			{this.renderUsers()}
				</ul>
    	</div>
	);
  }

};

People.propTypes = {
  users: PropTypes.array.isRequired,
  event: PropTypes.object.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(function(params) {
	Meteor.subscribe('usersList');
    Meteor.subscribe('events');

	return {
      event: Events.findOne(params.params.event),
	  users: Meteor.users.find().fetch(),
	  // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
	  currentUser: Meteor.user(),
  };
}, People);