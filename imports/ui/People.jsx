import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';


import { Events } from '../api/events.js';
import User from './Components/User.jsx';
import Modal from './Modal.jsx';
import {ShowWindow, HideWindow} from './Helper/ModalWindow.js';


// App component - represents the whole app
class People extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: '',
        }
    }

    createGroup() {
        let form = document.createElement('form');
        form.action = '#';
        form.method = 'POST';
        form.onsubmit = (evt) => {
            evt.preventDefault();
            console.log(this.props.currentUser);
            if (this.props.currentUser.groups[evt.target[0].value] !== undefined) {
                alert('Such group already exist!');
                return;
            }
            Meteor.users.update(
                Meteor.userId(),
                {$set: {['groups.' + evt.target[0].value]: {}}},
                (err, result) => {
                    HideWindow();
                    addPeopleToGroup(evt.target[0].value);
                });
        };

        let name = document.createElement('strong');
        name.innerHTML = 'Group Name: ';
        form.appendChild(name);

        let input = document.createElement('input');
        input.type = 'text';
        input.required = true;
        //input.pattern = '^[a-zA-Z]+$';
        //input.value = this.props.event.text;
        form.appendChild(input);

        let button = document.createElement('button');
        button.type = 'submit';
        button.innerHTML = 'OK';
        form.appendChild(button);

        let cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.innerHTML = 'Cancel';
        cancel.onclick = (evt) => {
            HideWindow();
        };
        form.appendChild(cancel);


        ShowWindow(form);
        input.focus();
    }

    addPeopleToGroup(groupName) {
        let div = document.createElement('div');

        div.appendChild(this.renderUsers());
        ShowWindow(div);
    }

    showModal() {
        this.setState({
            modal: <Modal />,
        });
    }
    renderUsers() {
        return this.props.users.map((user) => (
            <User key={user._id} currentUser={user} event={this.props.event}/>
        ));
    }

    render() {
        return (
            <div className="contentBLock">
                <div className="buttons">
                    <button onClick={this.showModal.bind(this)}>
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