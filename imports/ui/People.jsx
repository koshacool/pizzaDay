import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import {Events} from '../api/events.js';
import User from './Components/User.jsx';
import Group from './Components/Group.jsx';
import EditGroup from './ModalWindows/EditGroup.jsx';
import Groups from './ModalWindows/Groups.jsx';
import FormForName from './ModalWindows/FormForName.jsx';
//import {ShowWindow, HideWindow} from './Helper/ModalWindowBase.jsx';


// App component - represents the whole app
class People extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: '',
            event: this.props.event,
        }
    }

    createGroup(evt) {
        evt.preventDefault();
        groupName = evt.target[0].value;
        this.checkGroupNameAndSave(groupName);
    };

    changeGroupName(oldName, newName) {
        if (oldName === newName) {
            this.hideModalWindow();
            this.editGroup(newName);
            return;
        }


        let group = Meteor.user().groups[oldName];
        this.checkGroupNameAndSave(newName, group);
        Meteor.call('removeGroup', oldName);
    };

    checkExistGroupName(name) {
        let result = true;
        let groupsObj = Meteor.user().groups;
        if (groupsObj) {
            if (groupsObj[name] !== undefined) {
                result = false;
            }
        }

        return result;
    }

    checkGroupNameAndSave(name, value = {}) {
        if (!this.checkExistGroupName(name)) {
            alert('Such name already exist!');
            throw new Error('bad name');
        }

        Meteor.call('createGroup', name, value,
            (err, result) => {
                this.hideModalWindow();
                this.editGroup(name);
            }
        );
    }

    showFormCreateGroup() {
        this.setState({
            modal: <FormForName
                formName="Group Name: "
                inputValue=""
                hideModalWindow={this.hideModalWindow.bind(this)}
                formSubmit={this.createGroup.bind(this)}
            />
        });
    }

    editGroup(groupName) {
        this.setState({
            modal: <EditGroup
                hideModalWindow={this.hideModalWindow.bind(this)}
                users={this.props.users}
                groupName={groupName}
                changeName={this.changeGroupName.bind(this)}
            />,
        });
    }

    showGroups() {
        this.setState({
            modal: <Groups
                hideModalWindow={this.hideModalWindow.bind(this)}
                changeGroupName={this.changeGroupName.bind(this)}
                event={this.props.event}
            />,
        });
    }

    hideModalWindow() {
        this.setState({
            modal: '',
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            event: nextProps.event
        })
    }

    renderUsers() {
        return this.props.users.map((user) => (
            <User key={user._id} user={user} event={this.state.event}/>
        ));
    }

    render() {
        console.log(this.props.users)
        return (
            <div className="contentBLock">
                <div className="buttons">
                    <button onClick={this.showFormCreateGroup.bind(this)}>
                        Great Group
                    </button>

                    <button onClick={this.showGroups.bind(this)}>
                        Add Group
                    </button>
                </div>
                <ul>{this.renderUsers()}</ul>
                <div>{this.state.modal}</div>
            </div>
        );
    }
};

People.propTypes = {
    users: PropTypes.array.isRequired,
    event: PropTypes.object.isRequired,
    // incompleteCount: PropTypes.number.isRequired,
    groups: PropTypes.object,
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