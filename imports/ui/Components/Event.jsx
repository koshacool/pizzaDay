import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import classnames from 'classnames';
import {createContainer} from 'meteor/react-meteor-data';
import {Link, browserHistory} from 'react-router';
import {Menu} from '../../api/menu.js';
import {Helper} from '../Helper/Helper.js';

// Task component - represents a single todo item
class Event extends Component {
    constructor(props) {
        super(props);
        this.countUserTotalPrice = Helper.countUserTotalPrice.bind(this);
        this.countAllPrice       = Helper.countAllPrice.bind(this);
        this.getAvailableUsers   = Helper.getAvailableUsers.bind(this);
        this.getUserOrderNames   = Helper.getUserOrderNames.bind(this);
    }

    deleteThisEvent() {
        Meteor.call('events.remove', this.props.event._id);
        Meteor.call('discount.remove', this.props.event._id);
    }

    detailedUsersPrice() {
        let {event, discounts} = this.props;
        let users = this.getAvailableUsers(event.available.users);

        let detailedPrice = users.reduce((prev, userId) => {
            prev[event.available.users[userId].name] = {
                price: this.countUserTotalPrice(discounts),
                order: this.getUserOrderNames(event, userId),
            };
            return prev;
        }, {});

        return detailedPrice;
    }

    sendPriceToUsers() {
        let {event, discounts} = this.props;
        let users = this.getAvailableUsers(event.available.users);

        users.forEach((userId) => {
            let order = event.orders[userId].order;

            if (order && order.status === 'ordered') {
                this.sendEmail(
                    'Your order: ',
                    JSON.stringify({
                        price: this.countUserTotalPrice(discounts, userId),
                        order: this.getUserOrderNames(event, userId),
                    }),
                    event.available.users[userId].email,
                );
            }
        });
    }

    sendEmail(text, data, email) {
        let {event} = this.props;
        Meteor.call(
            'sendEmail',
            email,
            'PizzaDAY@exapmle.com',
            'PizzaDAY: ' + event.text,
            text + data,
        );
    }

    changeStatus(status) {
        let {event} = this.props;

        Meteor.call('events.orderStatus', event._id, status, (err, result) => {
            let detailedPrice = this.detailedUsersPrice();
            detailedPrice.total = this.countAllPrice(event);

            switch (status) {
                case('ordered'):
                    this.sendEmail(
                        'All people ordered! Total Price: ',
                        JSON.stringify(detailedPrice),
                        event.owner.email,
                    );
                    break;
                case('delivered'):
                    this.sendEmail(
                        'All people ordered! Total Price: ',
                        JSON.stringify(detailedPrice),
                        event.owner.email,
                    );
                    this.sendPriceToUsers();
                    break;
                default:
                    console.log('changed event status: ', status);
            }
        });
    }

    render() {
        let { status } = this.props.event;
        let complete = status === 'delivered';
        const eventClassName = classnames({
            complete,
            event: true,
            complete,
        });

        let owner = this.props.event.owner._id === Meteor.userId();
        let foodCount = Menu.find({['available.' + this.props.event._id]: {$ne: false}}).count();

        return (
            <li className={eventClassName}>
		        <span className="text">
		            {this.props.event.owner.name}: <strong>{this.props.event.text}</strong>
		            Users: <strong>{ Helper.countEvailableUsers(this.props.event.available.users) }</strong>
		            Food: <strong>{Helper.countEvailableFood(this.props.event.available.food)}</strong>
                    Status: {!owner || complete ? <strong className="status">{status}</strong> :
                <ul className="changeStatus">
                    <li>
                        <strong className="status">{status}</strong>
                        <ul>
                            <li onClick={this.changeStatus.bind(this, 'ordering')}>ordering</li>
                            <li onClick={this.changeStatus.bind(this, 'ordered')}>ordered</li>
                            <li onClick={this.changeStatus.bind(this, 'delivering')}>delivering</li>
                            <li onClick={this.changeStatus.bind(this, 'delivered')}>delivered</li>
                        </ul>
                    </li>
                </ul>
                    }
		        </span>

                {status === 'ordering' ?
                <div className="divInline">
                    <Link to={"/event/order/" + this.props.event._id}> Make Order </Link>
                </div>
                    : ''}
                { this.props.event.owner._id == Meteor.userId() ?
                <div className="divInline">
                    <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
                        &times;
                    </button>

                    {complete ?
                        ''
                        :
                    <button className="edit">
                        <Link to={"/event/" + this.props.event._id}> Edit </Link>
                    </button>
                        }


                </div>

                    : ''
                    }
            </li>
        );
    }
}

Event.propTypes = {
    event: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    discounts: PropTypes.array.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('events');
    Meteor.subscribe('menu');
    Meteor.subscribe('usersList');
    Meteor.subscribe('discountsList');

    return {
        users: Meteor.users.find().fetch(),
        // foodCount: Menu.find(['available.' + this.props.event._id]: { $ne: false }).count(),
        currentUser: Meteor.user(),
    };
}, Event);