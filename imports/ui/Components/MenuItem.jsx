import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class MenuItem extends Component {
  	toggleAvailable() { 
  		let available = this.props.menuItem.available[this.props.eventId] === undefined ? false :  !this.props.menuItem.available[this.props.eventId]; 
	// Set the checked property to the opposite of its current value
	 Meteor.call('menu.setAvailable', this.props.menuItem._id, this.props.eventId, available);
  }

  deleteThisItem() {
	 Meteor.call('menu.remove', this.props.menuItem._id);
  }


  render() {
	// Give tasks a different className when they are checked off,
	// so that we can style them nicely in CSS

	 const taskClassName = classnames({ 
	  unavailable: (this.props.menuItem.available[this.props.eventId] === false),      
	});  
	 
	 // console.log(this.props.menuItem);

	return (
	  <li className={taskClassName}>
	  <button className="delete" onClick={this.deleteThisItem.bind(this)}>
		  &times;
		</button>

		{ this.props.menuItem.available ?
		<input
		  type="checkbox"
		  readOnly
		  // checked={this.props.menuItem.available}
		  // onClick={this.toggleAvailable.bind(this)}
		/> : ''
	  }

		<button className="toggle-private" onClick={this.toggleAvailable.bind(this)}>
			{ this.props.menuItem.available[this.props.eventId] === false ? 'Available' : 'UnAvailable' }
		  </button>

		<span className="text">
		  <strong>{this.props.menuItem.text}</strong>: {this.props.menuItem.price} grn.
		</span>        
	  </li>
	);
  }
}

MenuItem.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  menuItem: PropTypes.object.isRequired,
  eventId: PropTypes.string.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};