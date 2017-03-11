import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { createContainer } from 'meteor/react-meteor-data';

import { Menu } from '../../api/menu.js';

// Task component - represents a single todo item
class Event extends Component {
  changeStatus() {   
    // Set the checked property to the opposite of its current value
     Meteor.call('menu.setAvailable', this.props.menuItem._id, this.props.eventId, !this.props.menuItem.available[this.props.eventId]);
  }

  deleteThisEvent() {
     Meteor.call('events.remove', this.props.event._id);
  }


  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // checkEvailable() {

    // }

     const eventClassName = classnames({ 
      complete: (this.props.event.status == 'delivered'),      
    });  
     
     // console.log(this.props.event);

    return (
      <li className={eventClassName}>
      <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
          &times;
        </button>

        
        

        <span className="text">
          <strong>{this.props.event.owner.username}</strong>: {this.props.event.text}
        </span>        
      </li>
    );
  }
}

Event.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  event: PropTypes.object.isRequired,
  // event: PropTypes.string.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('menu'); 
      
  return {
     currentUser: Meteor.user(),
  };
}, Event);