import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import {Helper} from './Helper/Helper.js';
import { Events } from '../api/events.js';
import { Menu } from '../api/menu.js';
import Food from './Food.jsx';
import People from './People.jsx';
import Header from './Header.jsx';


// App component - represents the whole app
class Order extends Component {
	constructor(props) {
		super(props);	  
		this.state = {
			totalPrice: this.countTotalPrice(),	
		};
	}

	// getEventForEdit() {
	// 	Meteor.call('events.findById', this.props.params.event, (err, result) => {				
	// 		this.setState({
	// 			eventObj: result,
	// 		});
	// 	});			
	// }

	countTotalPrice() {
		var price = 0;
		let userOrder = this.props.event.orders[Meteor.userId()];
		
		if (userOrder) {
			for (var menuId in userOrder.order) {
			if (userOrder.order[menuId].status) {
				let menuObj = Menu.findOne(menuId);					
				price += menuObj.price;				
			}
		}
		}
		
		return price;
	}

	changePrice() {		
		this.setState({			
			totalPrice: this.countTotalPrice(),
		});
	}



	showFood() {		
		return (<Food event={this.props.event} order={true} onSelect={ this.changePrice.bind(this) } />);
	}

	render() {		
		
		return (			
			<div className="container">

				{ this.props.event ? 
					<div className="contentBLock">
					
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
	// events: PropTypes.array.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
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
	  	currentUser: Meteor.user(),
	};
}, Order);