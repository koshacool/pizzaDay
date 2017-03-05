import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Menu } from '../api/menu.js';

import MenuItem from './MenuItem.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {

  constructor(props) {
	  super(props);

	  this.state = {
		itemName: '',
		price: '',
	  };
  }

 
  handleInputChange(event) {
	// console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  addMenuItem(event) {	
	event.preventDefault();

	// Find the text field via the React ref
	const itemName = this.state.itemName;
	const price = this.state.price;
	
   Meteor.call('menu.insert', itemName, price);	

   this.setState({
		itemName: '',
		price: '',
	}); 
  }

 renderMenu() {  
  return this.props.menuItems.map((item) => (
	  <MenuItem key={item._id} menuItem={item} />
	));
  }
 
  render() {
	return (
	  <div className="container">
		<header>
		<AccountsUIWrapper />
		  <h1>Pizza Day</h1>
		</header>

		{ this.props.currentUser ?
		<form className="new-task" onSubmit={this.addMenuItem.bind(this)} >
            <input
            id="itemName"
            name="itemName"
              type="text"     
              value={this.state.itemName}        
              placeholder="Type to add new menu item"
              onChange={this.handleInputChange.bind(this)}
            />

            <input
            id="price"
            name="price"
              type="text"     
              value={this.state.price}        
              placeholder="Type price"
              onChange={this.handleInputChange.bind(this)}
            />

            <input 
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
	);
  }

};

App.propTypes = {
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
}, App);