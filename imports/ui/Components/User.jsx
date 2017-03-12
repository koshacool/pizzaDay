import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class User extends Component {
  	toggleAvailable() { 
  		let available = !this.checkEvailable();
		// Set the checked property to the opposite of its current value
		Meteor.users.update(this.props.currentUser._id, { $set: { ['available.' + this.props.eventId]: available } });	

	 	
  	}

  	checkEvailable() {
  		let available = true;
  		let param = this.props.currentUser.available;
  		if (param) {
  			if (param[this.props.eventId] === false) {
  				available = false;
  			}
  		} 		

  		return available;
  	}


  render() {
	// Give tasks a different className when they are checked off,
	// so that we can style them nicely in CSS

	 const taskClassName = classnames({ 
	  // unavailable: (this.props.menuItem.available[this.props.eventId] === false),      
	});   
	

	return (
	  <li className={taskClassName}>	


		<button className="toggle-private" onClick={this.toggleAvailable.bind(this)}>
			{ this.checkEvailable() ? 'Available' : 'UnAvailable' }
		</button>

		<span className="text">
		  <strong>aaa</strong>
		</span>        
	  </li>
	);
  }
}

User.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  currentUser: PropTypes.object.isRequired,
  eventId: PropTypes.string.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};