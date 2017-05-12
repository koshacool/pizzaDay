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
        this.state = {
            totalPrice: this.countTotalPrice(),
        };

        this.setStatusOrdered = this.setStatusOrdered.bind(this);
    }

    countTotalPrice() {
        var price = 0;
        let userOrder = this.props.event.orders[Meteor.userId()];

        if (userOrder) {
            for (var menuId in userOrder.order) {
                if (userOrder.order[menuId].status) {
                    let menuObj = Menu.findOne(menuId);
                    price += menuObj.price * userOrder.order[menuId].number;
                }
            }
        }

        return price.toFixed(2);
    }

    changePrice() {
        this.setState({
            totalPrice: this.countTotalPrice(),
        });
    }

    setStatusOrdered() {
        Meteor.call('events.userOrderStatus', this.props.event._id, 'ordered', (err, result) => {
            if (this.checkEventStatus()) {
                Meteor.call('events.orderStatus', this.props.event._id, 'ordered', (err, result) => {
                    Meteor.call(
                        'sendEmail',
                        this.props.event.owner.email,
                        'PizzaDAY@exapmle.com',
                        'PizzaDAY: ' + this.props.event.text,
                        'All people ordered!'
                    );
                    browserHistory.push('/');
                })
            } else {
                browserHistory.push('/');
            }


        });

    }

    checkEventStatus() {
        let orders = this.props.event.orders;
        let availebleUsers = this.props.event.available.users;
        availebleUsers = Object.keys(availebleUsers)
            .filter((userId) => availebleUsers[userId]);

        return availebleUsers.every((userId) => {
            let result = false;
            if (orders[userId] && orders[userId].order.status == 'ordered') {
                result = true;
            }
            return result;
        })
    }

    showFood() {
        return (<Food event={this.props.event} order={true} onSelect={ this.changePrice.bind(this) }/>);
    }

    render() {
        console.log(this.props.event)
        return (
            <div className="container">
                { this.props.event ?
                <div className="contentBLock">
                    <button onClick={this.setStatusOrdered}> Confirm </button>
                    <div>Your price: {this.state.totalPrice} grn.</div>
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