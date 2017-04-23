import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import classnames from 'classnames';
import {createContainer} from 'meteor/react-meteor-data';
import {Events} from '../../api/events.js';

// Task component - represents a single todo item
export default class User extends Component {
    constructor(props) {
        super(props);
        Meteor.subscribe('events');

        this.state = {
            available: this.checkAvailable(),
        };
    }

    checkAvailable() {
        let status = false;
        if (this.props.event.available.users[this.props.currentUser._id]) {
            status = true;
        }
        return status;
    }

    toggleAvailable() {
        Meteor.call('events.userAvailable', this.props.currentUser._id, this.props.event._id, !this.state.available);
        this.setState({
            available: !this.state.available,
        });

    }

    render() {
        const taskClassName = classnames({
            unavailable: !this.state.available,
        });

        return (
            <div>
                { this.props.currentUser._id != Meteor.userId() ?
                    <li className={taskClassName}>
                        <button
                            className="toggle-private"
                            onClick={ this.toggleAvailable.bind(this) }
                        >
                            { this.state.available ? 'UnAvailable' : 'Available' }
                        </button>
                        <div className='text'>
                            <strong> { this.props.currentUser.username } </strong>
                        </div>
                    </li>
                    : ''
                }
            </div>



        );
    }
}

User.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    currentUser: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    // showPrivateButton: React.PropTypes.bool.isRequired,
};