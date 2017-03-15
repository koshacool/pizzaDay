import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Menu } from '../api/menu.js';
import MenuItem from './Components/MenuItem.jsx';
import {Helper} from './Helper/Helper.js';
// import Event from './Event.jsx';


// App component - represents the whole app
class Food extends Component {
	constructor(props) {
		super(props);
		
	}

	
	getEventForEdit() {
		Meteor.call('events.findById', this.props.params.event, (err, result) => {				
			this.setState({
				eventObj: result,
			});
		});			
	}

	renderMenu() { 
		return this.props.menuItems.map((item) => (
			<MenuItem key={item._id} menuItem={item} event={this.props.event} />
			));
	}

	render() {
		return (
			<div className="container">

			<div className="contentBLock">
			{ this.props.currentUser ?
				<ul>
				{this.renderMenu()}
				</ul> : ''
			}

			</div>
			</div>
			);
	}

};

Food.propTypes = {
	menuItems: PropTypes.array.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
   currentUser: PropTypes.object,
};

export default createContainer(() => {
	Meteor.subscribe('menu');	
	return {
		menuItems: Menu.find({}, { sort: { createdAt: -1 } }).fetch(),
	  // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
	   currentUser: Meteor.user(),
	};
}, Food);