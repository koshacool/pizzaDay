import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Menu } from '../../api/menu.js';
import {Helper} from '../Helper/Helper.js';

// Task component - represents a single todo item
class Event extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: this.checkStatus()
        };
    }

    deleteThisEvent() {
        Meteor.call('events.remove', this.props.event._id);
    }

    checkStatus() {
        return this.props.event.status;
    }

    render() {
        const eventClassName = classnames({
            complete: (this.props.event.status == 'delivered'),
        });
        let foodCount = Menu.find({['available.' + this.props.event._id]: {$ne: false}}).count();

        return (
            <li className={eventClassName}>
		<span className="text">
		 {Meteor.user().profile.name}: <strong>{this.props.event.text}</strong>
		</span> 
		<span className="text">
		  Users: <strong>{ Helper.countEvailableItems(this.props.event.available.users) }</strong>
		</span>   
		<span className="text">
		  Food: <strong>{Helper.countEvailableItems(this.props.event.available.food)}</strong>
		</span>
		  <span className="text">
		  Status: <strong>{this.state.status}</strong>
		</span>

                <div className="divInline">
                    <Link to={"/event/order/" + this.props.event._id}> Make Order </Link>
                </div>
                { this.props.event.owner._id == Meteor.userId() ?
                <div className="divInline">
                    <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
                        &times;
                    </button>
                    <button className="edit">
                        <Link to={"/event/" + this.props.event._id}> Edit </Link>
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