import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import ModalWindowBase from './ModalWindowBase.jsx';


// App component - represents the whole app
export default class EventName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventName: this.props.event.text
        }
    }

    handleInputChange(evt) {
        this.setState({
            eventName: evt.target.value
        });
    }

    createForm() {
        return (
            <form
                action="#"
                method="post"
                onSubmit={ this.props.changeName }
            >
                <strong>Group Name: </strong>
                <input type="text" required value={this.state.eventName} onChange={this.handleInputChange.bind(this)}/>
                <button type="submit"> OK</button>
                <button type="button" onClick={this.props.hideWindow}> CANCEL</button>
            </form>
        );
    }

    render() {
        return <ModalWindowBase content={this.createForm()} />
    }
};


EventName.propTypes = {
    event: PropTypes.object.isRequired,
    hideWindow: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
};
