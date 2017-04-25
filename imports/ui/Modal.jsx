import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import User from './Components/User.jsx';
import {ShowWindow, HideWindow} from './Helper/ModalWindow.js';


// App component - represents the whole app
export default class Modal extends Component {
    constructor(props) {
        super(props);
    }

    formSubmit(evt) {
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

    render() {
        let modalDiv = {
            position: 'fixed',
            bottom: 0,
            left: 0,
            top: 0,
            right: 0,
            zIndex: 100,
            overflow: 'auto',
            background: 'rgba(0, 0, 0, 0.5)',
        }

        let modalForm =  {
            background: '#eee',
            width: '500px',
            margin: '12% auto',
            border: '3px solid #666',
            padding: '20px',
            opacity: 1,
        }
        return (
            <div style={modalDiv}>
                <form style={modalForm} action="#">
                    <strong>Group Name: </strong>
                    <input type="text" required/>
                    <button type="submit"> OK</button>
                </form>
            </div>
        );
    }
};

