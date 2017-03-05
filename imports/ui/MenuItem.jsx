import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class MenuItem extends Component {
  // toggleAvailable() {
  //   // Set the checked property to the opposite of its current value
  //    Meteor.call('menu.setAvailable', this.props.menu._id, !this.props.menu.available);
  // }

  deleteThisItem() {
     Meteor.call('menu.remove', this.props.menuItem._id);
  }


  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    //  const taskClassName = classnames({
    //   available: this.props.item.available,      
    // });

    return (
      <li>
      <button className="delete" onClick={this.deleteThisItem.bind(this)}>
          &times;
        </button>
        <span>
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
  // showPrivateButton: React.PropTypes.bool.isRequired,
};