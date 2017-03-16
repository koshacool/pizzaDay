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
			eventObj: false,	
		};

		this.props.params.event ? this.getEventForEdit() : '';
	}

	getEventForEdit() {
		Meteor.call('events.findById', this.props.params.event, (err, result) => {				
			this.setState({
				eventObj: result,
			});
		});			
	}

	showFood() {		
		return (<Food event={this.state.eventObj} order={true} />);
	}

	render() {		
		return (			
			<div className="container">
				<Header /> 
				
				{ this.state.eventObj ? 
					<div className="contentBLock">	
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

export default createContainer(() => {
	Meteor.subscribe('events');
	Meteor.subscribe('menu'); 
	Meteor.subscribe('usersList'); 
	
	return {
		// countUsers: Meteor.users.find().count(),
		// events: Menu.find({}, { sort: { createdAt: -1 } }).fetch(),
	  // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
	  	currentUser: Meteor.user(),
	};
}, Order);