import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import ModalWindowBase from './ModalWindowBase.jsx';
import FormForName from './FormForName.jsx';
import {Helper} from '../Helper/Helper.js';
import User from '../Components/User.jsx';


export default class EditGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: this.checkShowUsers(),
            modal: ''
        }
    }

    checkShowUsers() {
        return this.props.users;
    }

    saveName(evt) {
        evt.preventDefault();
        groupName = evt.target[0].value;
        this.props.changeName(this.props.groupName, groupName);
        this.setState({
            modal: ''
        });
    };

    displayFormChangeName() {
        this.setState({
            modal: <FormForName
                formName="Group Name: "
                inputValue={this.props.groupName}
                hideModalWindow={this.props.hideModalWindow.bind(this)}
                formSubmit={this.saveName.bind(this)}
            />
        });
    }

    renderUsersForGroup() {
        let name = this.props.groupName;
        return this.props.users.map((user) => (
            <User key={user._id} user={user} groupName={name}/>
        ));
    }

    showGroup() {
        return (
            <div>
                <strong>Event Name:
                    <span id='eventName' onClick={this.displayFormChangeName.bind(this)}>
                       {this.props.groupName}
                    </span>
                </strong>
                <button onClick={this.props.hideModalWindow}> OK </button>
                {this.renderUsersForGroup()}
                {this.state.modal}
            </div>
        )
    }

    render() {
        return <ModalWindowBase content={this.showGroup()}/>
    }
};

EditGroup.propTypes = {
    hideModalWindow: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
    groupName: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
}