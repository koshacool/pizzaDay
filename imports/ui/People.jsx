import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';


import { Events } from '../api/events.js';
import User from './Components/User.jsx';
import Group from './Components/Group.jsx';
import CreateGroup from './ModalWindows/CreateGroup.jsx';
//import {ShowWindow, HideWindow} from './Helper/ModalWindowBase.jsx';


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
        groupName = evt.target[0].value;
        console.log(Meteor.user());
        if (!this.checkExistGroupName(groupName)) {
            alert('Such name already exist!');
            throw new Error('bad name');
        }
        Meteor.users.update(
            Meteor.userId(),
            {$set: {['groups.' + groupName]: {} } },
            (err, result) => {
                this.hideModal();
                this.showEditGroup(groupName);
            });
    };

    checkExistGroupName(name) {
        let result = true;
        let groupsObj = Meteor.user().groups;
        if (groupsObj) {
            if (groupsObj[name] !== undefined) {
                result =  false;
            }
        }

        return result;
    }

    showCreateGroup() {
        this.setState({
            modal: <CreateGroup hideWindow={this.hideModal.bind(this)} createGroup={this.createGroup.bind(this)} />,
        });
    }

    showEditGroup(groupName) {
        this.setState({
            modal: <CreateGroup hideWindow={this.hideModal.bind(this)} users={this.renderUsersForGroup(groupName)} groupName={groupName} />,
        });
    }

    showGroups() {
        this.setState({
            modal:  this.renderGroups(),
        });
    }

    hideModal() {
        this.setState({
            modal: '',
        });
    }


    renderGroups() {
        let keys = Object.keys(this.props.groups);
        return keys.map((groupName, i) => (
            <Group key={i} name={groupName} group={this.props.groups[groupName]} event={this.props.event} />
        ));
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
        console.log('render')
        return (
            <div className="contentBLock">
                <div className="buttons">
                    <button onClick={this.showCreateGroup.bind(this)}>
                        Great Group
                    </button>

                    <button onClick={this.showGroups.bind(this)}>
                        Add Group
                    </button>
                </div>
                <ul>
                    {this.renderUsers()}
                </ul>
                <div>{this.state.modal}</div>

            </div>
        );
    }

};

People.propTypes = {
    users: PropTypes.array.isRequired,
    event: PropTypes.object.isRequired,
    // incompleteCount: PropTypes.number.isRequired,
    groups: PropTypes.object.isRequired,
};

export default createContainer(function (params) {
    Meteor.subscribe('usersList');
    Meteor.subscribe('events');

    return {
        users: Meteor.users.find().fetch(),
        event: Events.findOne(params.params.event),
        // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        groups: Meteor.user().groups,
    };
}, People);