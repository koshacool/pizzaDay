import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import classnames from 'classnames';
import {createContainer} from 'meteor/react-meteor-data';
import {Events} from '../../api/events.js';

// Task component - represents a single todo item
export default class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            available: this.checkAvailable(),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            available: this.checkAvailable(),
        })
    }

    checkAvailable() {
        let status = false;
        let event = this.props.event;
        if (event) {
            if (event.available.users[this.props.user._id]) {
                status = event.available.users[this.props.user._id].status;
            }
        } else {
            status = this.checkAdded();
        }

        return status;
    }

    checkAdded() {
        let status = false;
        if (this.props.groupName) {
            let currentUser = Meteor.user();
            let group = currentUser.groups[this.props.groupName];
            if (group[this.props.user._id]) {
                status = true;
            }
        }
        return status;
    }

    toggleAvailable() {
        Meteor.call('events.userAvailable', this.props.user, this.props.event._id, !this.state.available, (err, res) => {
            this.setState({
                available: !this.state.available,
            });
        });
    }

    addToGroup() {
        Meteor.call('addUserToGroup', this.props.groupName, this.props.user._id, !this.state.available, () => {
            this.setState({
                available: !this.state.available,
            });
        });
    }

    showUserForEvent() {
        const taskClassName = classnames({
            unavailable: !this.state.available,
        });

        return (
            <div>
                { this.props.user._id != Meteor.userId() ?
                <li className={taskClassName}>
                    <button
                        className="toggle-private"
                        onClick={ this.toggleAvailable.bind(this) }
                    >
                        { this.state.available ? 'UnAvailable' : 'Available' }
                    </button>
                    <div className='text'>
                        <strong> { this.props.user.profile.name } </strong>
                    </div>
                </li>
                    : ''
                    }
            </div>
        )
    }

    showUserForGroup() {
        const taskClassName = classnames({
            unavailable: !this.state.available,
        });

        return (
            <div>
                { this.props.user._id != Meteor.userId() ?
                <li className={taskClassName}>
                    <button
                        className="toggle-private"
                        onClick={ this.addToGroup.bind(this) }
                    >
                        { this.state.available ? 'Remove' : 'Add' }
                    </button>
                    <div className='text'>
                        <strong> { this.props.user.profile.name } </strong>
                    </div>
                </li>
                    : ''
                    }
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.props.groupName ? this.showUserForGroup() : this.showUserForEvent()}
            </div>
        );
    }
}

User.propTypes = {
    user: PropTypes.object.isRequired,
    event: PropTypes.object,
};