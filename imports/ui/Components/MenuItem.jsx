import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Events } from '../../api/events.js';
//import Promise from 'promise-polyfill';

// Task component - represents a single todo item
export default class MenuItem extends Component {
    constructor(props) {
        super(props);
        Meteor.subscribe('events');

        this.state = {
            available: this.checkAvailable(),
            ordered: this.checkOrdered(),
            number: this.countNumber(),
        };


    }

    handleInputChange(event) {
        return new Promise((resolve, reject) => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            this.setState({
                [name]: value
            });

            resolve(true);
        });
    }

    toggleAvailable() {
        Meteor.call('events.foodAvailable', this.props.menuItem._id, this.props.event._id, !this.state.available);
        this.setState({
            available: !this.state.available,
        });

    }

    toggleOrdered(changeStatus = null) {
        Meteor.call('events.order',
            this.props.menuItem._id,
            this.props.event._id,
            changeStatus ? !this.state.ordered : this.state.ordered,
            this.state.number,
            (err, result) => {
                if (changeStatus) {
                    this.setState({
                        ordered: !this.state.ordered,
                    });
                }
                this.props.onSelect();//Count total price in order
            }
        );
    }

    countOrder(e) {
        this.handleInputChange(e)
        .then(() => this.toggleOrdered());

    }

    checkAvailable() {
        let status = false;
        if (this.props.event.available.food[this.props.menuItem._id]) {
            status = true;
        }
        return status;
    }

    checkOrdered() {
        let status = false;
        let userOrder = this.props.event.orders[Meteor.userId()];
        if (userOrder && userOrder.order[this.props.menuItem._id]) {
            status = userOrder.order[this.props.menuItem._id].status;
        }
        return status;
    }

    countNumber() {
        let order = this.props.event.orders[Meteor.userId()].order;
        return order[this.props.menuItem._id].number;
    }

    deleteThisItem() {
        Meteor.call('menu.remove', this.props.menuItem._id);
    }

    editItem() {
        const taskClassName = classnames({
            unavailable: !this.state.available,
        });
        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.deleteThisItem.bind(this)}>
                    &times;
                </button>

                <button className="toggle-private" onClick={this.toggleAvailable.bind(this)}>
                    { !this.state.available ? 'Available' : 'UnAvailable' }
                </button>

		<span className="text">
		  <strong>{this.props.menuItem.text}</strong>: {this.props.menuItem.price} grn.
		</span>
            </li>
        );
    }

    order() {
        const taskClassName = classnames({
            unavailable: !this.state.ordered,
        });
        return (
            <li className={taskClassName}>
                <input
                    type="checkbox"
                    readOnly
                    checked={this.state.ordered}
                    onClick={this.toggleOrdered.bind(this)}
                />
                { this.state.ordered ?
                <input
                    type="number"
                    name="number"
                    min="1"
                    max="10"
                    value={this.state.number}
                    onChange={this.countOrder.bind(this)}
                />
                    : '' }
		

		<span className="text">
		  <strong>{this.props.menuItem.text}</strong>: {this.props.menuItem.price} grn.
		</span>
            </li>
        );
    }

    render() {
        // console.log(this.state.ordered);
        if (this.props.order) {
            return this.order();
        } else {
            return this.editItem();
        }

    }
}

MenuItem.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    menuItem: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,


    // showPrivateButton: React.PropTypes.bool.isRequired,
};