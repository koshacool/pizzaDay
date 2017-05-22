import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';

import { Helper } from './Helper/Helper.js';
import { Events } from '../api/events.js';
import { Menu } from '../api/menu.js';
import Food from './Food.jsx';
import People from './People.jsx';



// App component - represents the whole app
class Order extends Component {
    constructor(props) {
        super(props);

        this.setStatusOrdered = this.setStatusOrdered.bind(this);
        this.checkAllUsersOrdered = Helper.checkAllUsersOrdered.bind(this);
        this.countUserTotalPrice = Helper.countUserTotalPrice.bind(this);
        this.countAllPrice = Helper.countAllPrice.bind(this);
        this.getAvailableUsers = Helper.getAvailableUsers.bind(this);

        this.state = {
            totalPrice: this.countUserTotalPrice(this.props.event, Meteor.userId()),
        };
    }

    changePrice() {
        this.setState({
            totalPrice: this.countUserTotalPrice(this.props.event, Meteor.userId()),
        });
    }

    setStatusOrdered() {
        let event = this.props.event;
        Meteor.call('events.userOrderStatus', this.props.event._id, 'ordered', (err, result) => {
            if (this.checkAllUsersOrdered(this.props.event)) {
                Meteor.call('events.orderStatus', this.props.event._id, 'ordered', (err, result) => {
                    Meteor.call(
                        'sendEmail',
                        this.props.event.owner.email,
                        'PizzaDAY@exapmle.com',
                        'PizzaDAY: ' + this.props.event.text,
                        'All people ordered! Total Price: ' + this.countAllPrice(event),
                    );
                    browserHistory.push('/');
                })
            } else {
                browserHistory.push('/');
            }
        });
    }

    showFood() {
        return (<Food event={this.props.event}
                      order={true}
                      onSelect={ this.changePrice.bind(this) }
                />
        );
    }

    render() {
        return (
            <div className="container">
                { this.props.event ?
                <div className="contentBLock">
                    <button onClick={this.setStatusOrdered}> Confirm </button>
                    <div>Your price: {this.state.totalPrice.toFixed(2)} grn.</div>
                    <div>
                        {this.showFood()}
                    </div>
                </div>
                    : '' }
            </div>
        );
    }
};

Order.propTypes = {
    event: PropTypes.object.isRequired,
    // incompleteCount: PropTypes.number.isRequired,

    // countUsers: PropTypes.number.isRequired,
};

export default createContainer((params) => {
    Meteor.subscribe('events');
    Meteor.subscribe('menu');
    Meteor.subscribe('usersList');

    return {
        event: Events.findOne(params.params.event),
        // countUsers: Meteor.users.find().count(),
        // events: Menu.find({}, { sort: { createdAt: -1 } }).fetch(),
        // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),

    };
}, Order);