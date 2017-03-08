import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Menu } from '../api/menu.js';
import MenuItem from './MenuItem.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Link } from 'react-router'

// App component - represents the whole app
class Food extends Component {
  constructor(props) {
	  super(props);

	  this.state = {
		itemName: '',
		price: '',
	  };
  }

  nonEmptyInput (value) {   
      return value.length > 0;    
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

  if (!this.nonEmptyInput(itemName) || ! this.nonEmptyInput(price)) {
    throw new Meteor.Error('Empty value');
  }  
	
   Meteor.call('menu.insert', itemName, price);	

   this.setState({
		itemName: '',
		price: '',
	}); 
  }

 renderMenu() {  
  return this.props.menuItems.map((item) => (
	  <MenuItem key={item._id} menuItem={item} user={this.props.currentUser} />
	));
  }
 
  render() {
	return (
	  <div className="container">
		<header>
    <div className="buttons">
      <button><Link to='/event'>Back</Link></button>
     </div> 
		</header>
    <div className="contentBLock">
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