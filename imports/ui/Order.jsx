import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';

import { Helper } from './Helper/Helper.js';
import { Events } from '../api/events.js';
import { Menu } from '../api/menu.js';
import Food from './Food.jsx';
import People from './People.jsx';
import {Discount} from '../api/discount.js';



// App component - represents the whole app
class Order extends Component {
    constructor(props) {
        super(props);

        this.setStatusOrdered = this.setStatusOrdered.bind(this);
        this.checkAllUsersOrdered = Helper.checkAllUsersOrdered.bind(this);
        this.countUserTotalPrice = this.countUserTotalPrice.bind(this);
        this.countAllPrice = Helper.countAllPrice.bind(this);
        this.getAvailableUsers = Helper.getAvailableUsers.bind(this);
        
        this.state = {
            totalPrice: this.countUserTotalPrice(),
            gettedDiscounts: false,
        };
    }

    countUserTotalPrice(discounts = false) {
        if (!discounts) {
            discounts = this.props.discounts;
        }
        const {event} = this.props;
        const userId =  Meteor.userId();
        let price = 0;
        let userOrder = event.orders[userId];
        
        if (userOrder) {
            for (var menuId in userOrder.order) {
                if (userOrder.order[menuId].status) {
                    let menuObj = Menu.findOne(menuId);

                    let discount = discounts.filter((discount) => {
                        return discount.foodId === menuId;
                    })

                    if (discount.length > 0) {
                        price += (menuObj.price - discount[0].discount) * userOrder.order[menuId].number;                       
                    } else {
                        price += menuObj.price * userOrder.order[menuId].number;
                    }   
                }
            }
        }

        return price;
    }


    changePrice() {
        this.setState({
            totalPrice: this.countUserTotalPrice(),
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

    componentWillReceiveProps(nextProps) {        
            this.setState({
                totalPrice: this.countUserTotalPrice(nextProps.discounts),
            });        
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
    discounts: PropTypes.array.isRequired,
};


export default createContainer((params) => {
    Meteor.subscribe('discount.by.eventId', params.params.event);
    Meteor.subscribe('events');
    Meteor.subscribe('menu');
    Meteor.subscribe('usersList');    

    return {
        discounts: Discount.find().fetch(),
        event: Events.findOne(params.params.event),
        
    };
}, Order);