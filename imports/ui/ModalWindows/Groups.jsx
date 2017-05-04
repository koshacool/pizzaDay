import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import Group from '../Components/Group.jsx';
import ModalWindowBase from './ModalWindowBase.jsx';
import EditGroup from './EditGroup.jsx';


// App component - represents the whole app
class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: ''
        }
    }

    editGroup(groupName) {
        this.setState({
            modal: <EditGroup
                hideModalWindow={this.hideModalWindow.bind(this)}
                users={this.props.users}
                groupName={groupName}
                changeName={this.props.changeGroupName}
            />,
        });
    }

    hideModalWindow() {
        this.setState({
            modal: '',
        });
    }

    renderGroups() {
        let keys = Object.keys(this.props.groups);
        let groups = 'You haven\'t any groups!';
        if (keys.length > 0) {
            groups = keys.map((groupName, i) => (
                <Group key={i} name={groupName} group={this.props.groups[groupName]} event={this.props.event} edit={this.editGroup.bind(this, groupName)} />
            ));
        }
        return (
            <div>
                <button type="button" onClick={this.props.hideModalWindow}> OK </button>
                {groups}
                <div>{this.state.modal}</div>
            </div>
        )
    }

    render() {
        return <ModalWindowBase content={this.renderGroups()}/>
    }
};

Groups.propTypes = {
    hideModalWindow: PropTypes.func.isRequired,
    changeGroupName: PropTypes.func.isRequired,
    groups: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
};

export default createContainer(function () {
    Meteor.subscribe('usersList');

    return {
        users: Meteor.users.find().fetch(),
        groups: Meteor.user().groups,
    };
}, Groups);