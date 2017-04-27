import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import {Helper} from '../Helper/Helper.js';
import User from '../Components/User.jsx';


// App component - represents the whole app
export default class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: this.checkShowUsers(),
        }
    }

    checkShowUsers() {
        return this.props.users;
    }

    showForm() {
        return (
            <form action="#" method="post" onSubmit={(evt) => this.props.createGroup(evt)}>
                <strong>Group Name: </strong>
                <input type="text" required/>
                <button type="submit"> OK</button>
                <button type="button" onClick={ () => this.props.hideWindow() }> CANCEL</button>
            </form>
        );
    }


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
        };
        let modalContainer = {
            background: '#eee',
            width: '500px',
            margin: '12% auto',
            border: '3px solid #666',
            padding: '20px',
            opacity: 1,
        };
        return (
            <div style={modalDiv}>
                <div style={modalContainer}>
                    {this.state.users ? this.props.users : this.showForm()}
                </div>
            </div>
        );
    }


};

