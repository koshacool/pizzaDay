import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';


import { Events } from '../api/events.js';
import User from './Components/User.jsx';
import Group from './ModalWindows/Group.jsx';
//import {ShowWindow, HideWindow} from './Helper/ModalWindow.js';


// App component - represents the whole app
class People extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: '',
        }
    }

    createGroup(evt) {
        evt.preventDefault();
        console.log(this.props.currentUser);
        if (this.props.currentUser.groups[evt.target[0].value] !== undefined) {
            alert('Such group already exist!');
            return;
        }
        Meteor.users.update(
            Meteor.userId(),
            {$set: {['groups.' + evt.target[0].value]: {} } },
            (err, result) => {
                this.hideModal();
                this.showEditGroup(evt.target[0].value);
            });
    };



    showCreateGroup() {
        this.setState({
            modal: <Group hideWindow={this.hideModal.bind(this)} createGroup={this.createGroup.bind(this)} />,
        });
    }

    showEditGroup(groupName) {
        this.setState({
            modal: <Group hideWindow={this.hideModal.bind(this)} users={this.renderUsersForGroup(groupName)} />,
        });
    }

    hideModal() {
        this.setState({
            modal: '',
        });
    }

    renderUsersForGroup(groupName) {
        return this.props.users.map((user) => (
            <User key={user._id} user={user} groupName={groupName} />
        ));
    }


    renderUsers() {
        return this.props.users.map((user) => (
            <User key={user._id} user={user} event={this.props.event}/>
        ));
    }

    render() {
        return (
            <div className="contentBLock">
                <div className="buttons">
                    <button onClick={this.showCreateGroup.bind(this)}>
                        Great Group
                    </button>

                    <button>
                        Add Group
                    </button>
                </div>
                <ul>
                    {this.renderUsers()}
                </ul>
                {this.state.modal}
            </div>
        );
    }

}
;

People.propTypes = {
    users: PropTypes.array.isRequired,
    event: PropTypes.object.isRequired,
    // incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
};

export default createContainer(function (params) {
    Meteor.subscribe('usersList');
    Meteor.subscribe('events');

    return {
        event: Events.findOne(params.params.event),
        users: Meteor.users.find().fetch(),
        // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
}, People);