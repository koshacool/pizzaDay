import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Link } from 'react-router';

import { Menu } from '../api/menu.js';
import MenuItem from './Components/MenuItem.jsx';
import {nonEmptyInput, handleInputChange} from './Helper/Helper.js';
import Event from './Event.jsx';


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

		if (!nonEmptyInput(itemName) || ! nonEmptyInput(price)) {
			throw new Meteor.Error('Empty value');
		}  

		Meteor.call('menu.insert', itemName, price, this.props.eventId);

		this.setState({
			itemName: '',
			price: '',
		}); 

		
	}

	renderMenu() { 
		return this.props.menuItems.map((item) => (
			<MenuItem key={item._id} menuItem={item} eventId={this.props.eventId} />
			));
	}

	render() {
		return (
			<div className="container">

			<div className="contentBLock">
			{ this.props.currentUser ?
				<form className="new-task" onSubmit={this.addMenuItem.bind(this)} >
				<input
				id="itemName"
				name="itemName"
				type="text"     
				value={this.state.itemName}        
				placeholder="Type to add new menu item"
				onChange={handleInputChange.bind(this)}
				/>

				<input
				id="price"
				name="price"
				type="text"     
				value={this.state.price}        
				placeholder="Type price"
				onChange={handleInputChange.bind(this)}
				/>

				<input
				className="addItem"
				id="addItem"
				name="addItem"
				type="submit" 
				value="Add"
				/>

				</form> : ''
			}

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