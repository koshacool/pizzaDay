import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import Group from '../Components/Group.jsx';
import ModalWindowBase from './ModalWindowBase.jsx';


// App component - represents the whole app
class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: ''
        }
    }

    renderGroups() {
        let keys = Object.keys(this.props.groups);
        let groups = 'You haven\'t any groups!';
        if (keys.length > 0) {
            groups = keys.map((groupName, i) => (
                <Group key={i} name={groupName} group={this.props.groups[groupName]} event={this.props.event}/>
            ));
        }
        return (
            <div>
                <button type="button" onClick={this.props.hideModalWindow}> OK</button>
                {groups}
            </div>
        )
    }

    render() {
        return <ModalWindowBase content={this.renderGroups()}/>
    }
}
;

Groups.propTypes = {
    hideModalWindow: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    groups: PropTypes.object.isRequired,
};

export default createContainer(function () {
    Meteor.subscribe('usersList');

    return {
        users: Meteor.users.find().fetch(),
        groups: Meteor.user().groups,
    };
}, Groups);