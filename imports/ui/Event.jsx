import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Events } from '../api/events.js';
import { Menu } from '../api/menu.js';


// App component - represents the whole app
class Event extends Component {

  constructor(props) {
	  super(props);	  
	  this.state = {
		eventName: '',
		menu: '',
		
	  };
  }

    addMenuItem(event) {	
		event.preventDefault();

	}

	handleInputChange(event) {
	// console.log(this.props.currentUser._id);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  
  render() {
	return (
	  <div className="container">
		<header>
	  		<div className="buttons">
				<button><Link to='/'>Main</Link></button>       
	   		</div>
		</header>

		<div className="contentBLock">	
		<form className="new-task" onSubmit={this.addMenuItem.bind(this)} >
            <input
            id="eventName"
            name="eventName"
              type="text"     
              value={this.state.eventName}        
              placeholder="Type new event name"
              onChange={this.handleInputChange.bind(this)}
            />
            <div className="buttons">
        		<button><Link to='/people'>Add People</Link></button>    
        		<button><Link to='/menu'>Add Food</Link></button>     		
        	</div>	
            <button
              className="addEvent"
              id="addEvent"
              name="addEvent"
            	type="submit"             	
            >Create</button>
        </form> 
        { this.state.menu ?
        	<p>total products: {this.state.menu} </p> : ''
    	}
        	
        </div>
	  </div>
	);
  }

};

Event.propTypes = {
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
}, Event);