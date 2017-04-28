import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';


// App component - represents the whole app
export default class ModalWindow extends Component {
    constructor(props) {
        super(props);
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
                    {this.props.content}
                </div>
            </div>
        );
    }
};

ModalWindow.propTypes = {
    content: PropTypes.object.isRequired,
};


