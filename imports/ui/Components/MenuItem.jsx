import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Events } from '../../api/events.js';

// Task component - represents a single todo item
export default class MenuItem extends Component {
	constructor(props) {
		super(props);
		Meteor.subscribe('events'); 

		this.state = {			
			available: this.checkAvailable(),
		};
	}

  	toggleAvailable() { 
		Meteor.call('events.foodAvailable', this.props.menuItem._id, this.props.event._id, !this.state.available);				
		this.setState({
			available: !this.state.available,
		});
				
	}

	checkAvailable() {
		let status = false;
		if (this.props.event.available.food[this.props.menuItem._id]) {
			status = true;
		}
		return status;
	}

  deleteThisItem() {
	 Meteor.call('menu.remove', this.props.menuItem._id);
  }


  render() {
	// Give tasks a different className when they are checked off,
	// so that we can style them nicely in CSS

	 const taskClassName = classnames({ 
	  	unavailable: !this.state.available,      
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
			{ !this.state.available ? 'Available' : 'UnAvailable' }
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
  event: PropTypes.object.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};