import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
//import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import {Link} from 'react-router';
import {Events} from '../api/events.js';
import {Discount} from '../api/discount.js';
import {Menu} from '../api/menu.js';
import MenuItem from './Components/MenuItem.jsx';
import {Helper} from './Helper/Helper.js';
// import Event from './Event.jsx';


// App component - represents the whole app
class Food extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: '',
            price: '',

        };
    }

    addMenuItem(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const itemName = this.state.itemName;
        const price = this.state.price;

        if (!Helper.nonEmptyInput(itemName) || !Helper.nonEmptyInput(price)) {
            throw new Meteor.Error('Empty value');
        }

        Meteor.call('menu.insert', itemName, +price, this.props.eventId);

        this.setState({
            itemName: '',
            price: '',
        });
    }

    renderMenu() {
        let menuItems = this.props.menuItems;
        if (this.props.order) {
            menuItems = menuItems.filter((item) => this.props.event.available.food[item._id]);
        }

        return menuItems
            .map((item) => (
                <MenuItem key={item._id} menuItem={item}
                          event={this.props.event}
                          order={this.props.order}
                          onSelect={this.props.onSelect}
                          discounts={this.props.discounts}
                />
            ));
    }

    render() {
        return (
            <div className="container">
                <div className="contentBLock">

                    <div>
                        { !this.props.order ?
                        <form className="new-task" onSubmit={this.addMenuItem.bind(this)}>
                            <div>
                                Name: <input
                                id="itemName"
                                name="itemName"
                                type="text"
                                value={this.state.itemName}
                                placeholder="Type to add new menu item"
                                required
                                onChange={Helper.handleInputChange.bind(this)}

                            />
                            </div>

                            <div>
                                Price: <input
                                id="price"
                                name="price"
                                type="text"
                                value={this.state.price}
                                placeholder="Type price"
                                required
                                type="text"
                                pattern="^\d+(?:[\.]\d{1,2})?$"

                                onChange={Helper.handleInputChange.bind(this)}
                            />
                            </div>

                            <input
                                className="addItem"
                                id="addItem"
                                name="addItem"
                                type="submit"
                                value="Add"
                            />

                        </form> : ''
                            }

                        <ul>
                            {this.renderMenu()}
                        </ul>
                    </div>


                </div>
            </div>
        );
    }

};

Food.propTypes = {
    event: PropTypes.object.isRequired,
    menuItems: PropTypes.array.isRequired,
    discounts: PropTypes.array.isRequired,
    order: PropTypes.bool,
    currentUser: PropTypes.object,

};

export default createContainer((params) => {
    function getEventId(params) {
        if (params.event) {
            return params.event._id;
        }
        return params.params.event;
    }

    Meteor.subscribe('menu');
    Meteor.subscribe('events');
    Meteor.subscribe('discount.by.eventId', getEventId(params));
    return {
        event: params.event || Events.findOne(params.params.event),
        menuItems: Menu.find({}, {sort: {createdAt: -1}}).fetch(),
        // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
        discounts: Discount.find().fetch(),

    };
}, Food);