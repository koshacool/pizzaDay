import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class User extends Component {
  toggleAvailable() {   
	// Set the checked property to the opposite of its current value
	 Meteor.call('menu.setAvailable', this.props.currentUser._id, !this.props.currentUser.available[this.props.user._id]);
  }

  


  render() {
	// Give tasks a different className when they are checked off,
	// so that we can style them nicely in CSS
	// checkEvailable() {

	// }

	 const taskClassName = classnames({ 
	  // unavailable: (this.props.user.available[this.props.user._id] === false),      
	});  
	 console.log(this.props.user.evailable);
	 

	return (
	  <li className={taskClassName}>      

		<button className="toggle-private" onClick={this.toggleAvailable.bind(this)}>
		   
		</button>

		<span className="text">
		  <strong>Name</strong>: {this.props.user.username}
		</span>        
	  </li>
	);
  }
}

User.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  user: PropTypes.object.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};