import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Link } from 'react-router';

import User from './Components/User.jsx';


// App component - represents the whole app
class People extends Component {
  constructor(props) {
	  super(props);	  
  }  
  

 renderUsers() {  
  return this.props.users.map((user) => (
	  <User key={user._id} currentUser={this.props.currentUser} eventId={this.props.eventId}/>
	));
  }

  render() {
	return (
	  <div className="container">
		<div className="contentBLock">
        	{ this.props.currentUser ?
				<ul>
		  			{this.renderUsers()}
				</ul> 
			: ''
			}	
    	</div>
	  </div>
	);
  }

};

People.propTypes = {
  users: PropTypes.array.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
	Meteor.subscribe('usersList');

	return {
	  users: Meteor.users.find().fetch(),
	  // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
	  currentUser: Meteor.user(),
  };
}, People);