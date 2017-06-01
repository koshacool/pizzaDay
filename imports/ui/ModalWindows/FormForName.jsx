import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import ModalWindowBase from './ModalWindowBase.jsx';

export default class FormForName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: this.props.inputValue
        }
    }

    handleInputChange(evt) {
        this.setState({
            inputValue: evt.target.value
        });
    }

    createForm() {
        return (
            <form
                action="#"
                method="post"
                onSubmit={ this.props.formSubmit }
            >
                <strong>{this.props.formName}</strong>
                <input type="text" required value={this.state.inputValue} onChange={this.handleInputChange.bind(this)}/>
                <button type="submit"> OK </button>
                <button type="button" onClick={this.props.hideModalWindow}> CANCEL </button>
            </form>
        );
    }

    render() {
        return <ModalWindowBase content={this.createForm()} />
    }
};

FormForName.propTypes = {
    inputValue: PropTypes.string.isRequired,
    hideModalWindow: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
    formName: PropTypes.string.isRequired,
};