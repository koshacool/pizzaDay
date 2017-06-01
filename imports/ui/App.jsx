import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {Events} from '../api/events.js';
import {Discount} from '../api/discount.js';
import Event from './Components/Event.jsx';
import Header from './Elements/Header.jsx';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: '',
            price: '',
            hideCompleted: false,
        };

        this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    }

    getDiscountsForEvent(eventId) {
        let {discounts} = this.props;
        return discounts.filter((discount) => discount.eventId === eventId);
    }

    renderEvents() {
        let {events} = this.props;
        let {hideCompleted} = this.state;

        if (hideCompleted) {
            events = events.filter((event) => event.status !== 'delivered');
        }

        return (

            <div>
                <label className="hideCompleted">
                    <input type="checkbox" onChange={this.toggleHideCompleted}/>
                    hide completed
                </label>
                { events.length > 0 ?
                    events.map((event) => (
                        <Event key={event._id} event={event} discounts={this.getDiscountsForEvent(event._id)}/>
                    ))
                    :
                    <center>You don't have any events!</center>
                }
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <Header />

                <div className="container">
                    <div className="contentBLock">
                        {/*Check user authorizated*/}
                        { this.props.currentUser ?
                            this.props.children ? this.props.children : this.renderEvents()
                            : ''
                            }
                    </div>
                </div>
            </div>
        )
    }
}
;

App.propTypes = {
    events: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
    discounts: PropTypes.array,
};

export default createContainer(() => {
    Meteor.subscribe('events');
    Meteor.subscribe('discountsList');
    return {
        events: Events.find({
                $or: [
                    {'owner._id': Meteor.userId()},
                    {['available.users.' + Meteor.userId() + '.status']: true}]
            },
            {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user(),
        discounts: Discount.find().fetch(),
    };
}, App);