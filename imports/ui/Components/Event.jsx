import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Menu } from '../../api/menu.js';
import {Helper} from '../Helper/Helper.js';

// Task component - represents a single todo item
class Event extends Component {
 //  changeStatus() {   
	// // Set the checked property to the opposite of its current value
	//  Meteor.call('menu.setAvailable', this.props.menuItem._id, this.props.eventId, !this.props.menuItem.available[this.props.eventId]);
 //  }

  deleteThisEvent() {
	 Meteor.call('events.remove', this.props.event._id);
  }


  render() {
	// Give tasks a different className when they are checked off,
	// so that we can style them nicely in CSS
	
	
	 const eventClassName = classnames({ 
	  complete: (this.props.event.status == 'delivered'),      
	});   
	 let foodCount = Menu.find({['available.' + this.props.event._id]: { $ne: false }}).count();
	
	 

	return (
	  <li className={eventClassName}>
	  	

		<span className="text">
		  <strong>{this.props.event.owner.username}</strong>: {this.props.event.text},
		</span> 
		<span className="text">
		  <strong>Users</strong>: { Helper.countEvailableItems(this.props.event.available.users) }
		</span>   
		<span className="text">
		  <strong>Food</strong>: {Helper.countEvailableItems(this.props.event.available.food)}
		</span>    

		<div className="divInline">
			<Link to={"/event/order/" + this.props.event._id} > ORDER </Link>  
		</div>
		{ this.props.event.owner._id == Meteor.userId() ?
			<div className="divInline">
				<button className="delete" onClick={this.deleteThisEvent.bind(this)}>
		 		 	&times;
				</button>
				<button className="edit">
        			<Link to={"/event/" + this.props.event._id} > Edit</Link>
        		</button>
        		
			</div>
        	: ''
		}
        	        		
       
		
	  </li>
	);
  }
}

Event.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  event: PropTypes.object.isRequired,
  // usersCount: PropTypes.number.isRequired,
  // event: PropTypes.string.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('menu'); 	
  Meteor.subscribe('usersList'); 	  

  	return {
		// usersCount: Meteor.users.find().count(),
		// foodCount: Menu.find(['available.' + this.props.event._id]: { $ne: false }).count(),
		currentUser: Meteor.user(),
  	};
}, Event);