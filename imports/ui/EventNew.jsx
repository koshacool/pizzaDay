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
//import Header from './Header.jsx';

// App component - represents the whole app
class EventNew extends Component {
	constructor(props) {
		super(props);	  
		this.state = {			
			eventName: '',
		};

		this._createEvent = this.createEvent.bind(this);		
	}	

	createEvent(event) {		
		event.preventDefault();
		if (!Helper.nonEmptyInput(this.state.eventName)) {
			throw new Meteor.Error('Empty value');
		}

		Meteor.call('events.insert', this.state.eventName , (err, result) => {
			 browserHistory.push('/event/' + result._id); //Redirect to page for edit event
		});		
	}	

	render() {		
		return (
			<div className="container">

				<div className="contentBLock">						
					<form className="new-task" onSubmit={this._createEvent} >
						<strong>Event Name:</strong>
						<input
							id="eventName"
							name="eventName"
							type="text"     
							value={this.state.eventName}        
							placeholder="Type new event name"
							onChange={ Helper.handleInputChange.bind(this) }
						/>
						<div className="buttons">
							<button			
								className="addEvent"
								id="addEvent"
								name="addEvent"
								type="submit"
							> Create
							</button>
						</div>
					</form>					
				</div>				
			</div>
		);
	}
};

EventNew.propTypes = {	
  currentUser: PropTypes.object,
};

export default createContainer(() => {
	Meteor.subscribe('events');
	Meteor.subscribe('menu'); 
	Meteor.subscribe('usersList'); 
	
	return {
	  	currentUser: Meteor.user(),
	};
}, EventNew);