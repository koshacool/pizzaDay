import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import ModalWindowBase from './ModalWindowBase.jsx';

export default class DiscountModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
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
                Discount(grn.):
                <input type="text" pattern="^\d+(?:[\.]\d{1,2})?$" required value={this.state.inputValue} onChange={this.handleInputChange.bind(this)}/>
                <button type="submit"> ADD </button>
                <button type="button" onClick={this.props.hideModalWindow}> CANCEL </button>
            </form>
        );
    }

    render() {
        return <ModalWindowBase content={this.createForm()} />
    }
};

DiscountModal.propTypes = {
    hideModalWindow: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
};