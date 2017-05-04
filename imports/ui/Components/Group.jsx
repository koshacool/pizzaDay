import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import classnames from 'classnames';
import {createContainer} from 'meteor/react-meteor-data';
import {Events} from '../../api/events.js';

// Task component - represents a single todo item
export default class Group extends Component {
    constructor(props) {
        super(props);
        Meteor.subscribe('events');

        this.state = {
            added: this.checkAdded(),

        };
    }

    checkAdded() {
        let status = false;
        if (this.props.event.available.groups[this.props.name]) {
            status = true;
        }
        return status;
    }

    toggleAdded() {
        Meteor.call('events.groupAvailable', this.props.name, this.props.event._id, !this.state.added,
            () => {
                this.setState({
                    added: !this.state.added,
                });

                Object.keys(this.props.group).forEach((userId) => {
                    Meteor.call('events.userAvailable', userId, this.props.event._id, this.state.added);
                });

            }
        );
    }

    deleteGroup() {
        Meteor.users.update(
            Meteor.userId(),
            {$unset: {['groups.' + this.props.name]: 1}},
            () => console.log('removed')
        );
        Meteor.call('events.groupRemove', this.props.name, this.props.event._id);
    }

    render() {
        const taskClassName = classnames({
            unavailable: !this.state.added,
        });

        return (
            <div>
                <li className={taskClassName}>
                    <button className="delete" onClick={this.deleteGroup.bind(this)}>
                        &times;
                    </button>

                    <button
                        className="toggle-private"
                        onClick={ this.toggleAdded.bind(this) }
                    >
                        { this.state.added ? 'Remove' : 'Add' }
                    </button>

                    <div className='text'>
                        Name: <strong> { this.props.name } </strong>
                    </div>

                    <div className='text'>
                        Total Users: {Object.keys(this.props.group).length}
                    </div>

                </li>
            </div>
        )
    }
}

Group.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    group: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    name: PropTypes.string,

    // showPrivateButton: React.PropTypes.bool.isRequired,
};