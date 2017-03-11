import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { Events } from '../api/events.js';
import Event from './Components/Event.jsx';

// App component - represents the whole app
class App extends Component { 
	constructor(props) {
		super(props);

		this.state = {
			itemName: '',
			price: '',
		};
	}

	renderEvents() { 
		// console.log(this.props.events);
		return this.props.events.map((event) => (
			<Event key={event._id} event={event} />
			));
	}

  render() {
	return (
	  	<div className="container">
			<header>		
    			<AccountsUIWrapper />    
		    	<h1>Pizza Day</h1>
		    	<div className="buttons">
        			<button><Link to='/event'>New Event</Link></button>        		
        		</div>
			</header>    

			<div className="container">
				<div className="contentBLock">  
				{ this.renderEvents() }
				</div>
			</div>
    	</div>
	 )
  }

};

App.propTypes = {
	events: PropTypes.array.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
   currentUser: PropTypes.object,
};

export default createContainer(() => {
	Meteor.subscribe('events');	
			
	return {	
		events: Events.find({ $or: [ { 'owner._id': Meteor.userId() }, 
			{ ['available.' + Meteor.userId()]: true } ] }, 
			{ sort: { createdAt: -1 } }).fetch(),
	  // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
	   currentUser: Meteor.user(),
	};
}, App);