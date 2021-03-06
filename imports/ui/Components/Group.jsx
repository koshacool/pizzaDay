import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import classnames from 'classnames';
import {createContainer} from 'meteor/react-meteor-data';
import {Events} from '../../api/events.js';

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
        Meteor.call('removeGroup', this.props.name);
        Meteor.call('events.groupRemove', this.props.name, this.props.event._id);
    }

    countAddedUsers() {
        return Object.keys(this.props.group).filter((value) => this.props.group[value]).length;
    }

    render() {
        const taskClassName = classnames({
            unavailable: !this.state.added,
            group: true,
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
                        { this.state.added ? 'UnAvailable' : 'Available' }
                    </button>

                    <div className='text'>
                        Name: <strong onClick={this.props.edit}> {this.props.name} </strong>
                    </div>

                    <div className='text'>
                        Total Users: {this.countAddedUsers()}
                    </div>

                </li>
            </div>
        )
    }
}

Group.propTypes = {
    group: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    name: PropTypes.string,
    edit: PropTypes.func,
};