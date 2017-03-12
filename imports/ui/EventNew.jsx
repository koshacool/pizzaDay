import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import {nonEmptyInput, handleInputChange} from './Helper/Helper.js';
import { Events } from '../api/events.js';
import { Menu } from '../api/menu.js';
import Food from './Food.jsx';
import People from './People.jsx';



// App component - represents the whole app
class EventNew extends Component {
	constructor(props) {
		super(props);	  
		this.state = {
			eventObj: false,
			eventName: '',						
			showAddPeople: false,
			showAddMenu: false,	
		};

		this._createEvent = this.createEvent.bind(this);
		this.props.params.event ? this.getEventForEdit() : '';
	}

	

	createEvent(event) {		
		event.preventDefault();
		if (!nonEmptyInput(this.state.eventName)) {
			throw new Meteor.Error('Empty value');
		}

		Meteor.call('events.insert', this.state.eventName , (err, result) => {			
			this.setState({
				eventObj: result,
			});

		});		
	}

	getEventForEdit() {
		Meteor.call('events.findById', this.props.params.event, (err, result) => {				
			this.setState({
				eventObj: result,
			});
		});			
	}

	countFood() {
		return Menu.find({['available.' + this.state.eventObj._id]: { $ne: false }}).count();
	}

	showFood() {		
		return (<Food eventId={this.state.eventObj._id} />);
	}

	showPeople() {		
		return (<People eventId={this.state.eventObj._id} />);
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
					{ this.state.eventObj  ? 			
					<div className="buttons">
						<h2>
							<strong>Event Name: </strong> { this.state.eventObj.text  } 
							<button >
								Change
							</button>
						</h2>						 
						 <h3>
							<strong>Total people: </strong> { this.props.usersCount }							
							<button onClick={ (event) => {this.setState({
								showAddPeople: !this.state.showAddPeople,
								showAddMenu: false,
							}) } }>
								Add People
							</button>
						</h3> 						
						<h3>
							<strong>Total food: </strong> { this.countFood() } 
							<button onClick={ (event) => {this.setState({
								showAddMenu: !this.state.showAddMenu,
								showAddPeople: false,
							}) } }>
								Add Food
							</button> 
						</h3> 						
					</div>
					:			
					<form className="new-task" onSubmit={this._createEvent} >
						<strong>Event Name:</strong>
						<input
							id="eventName"
							name="eventName"
							type="text"     
							value={this.state.eventName}        
							placeholder="Type new event name"
							onChange={ handleInputChange.bind(this) }
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
					}
					<div>	
						{ this.state.showAddMenu ? this.showFood() : '' } 
						{ this.state.showAddPeople ? this.showPeople() : '' } 
					</div>
					

				
				</div>
				
			</div>
		);
	}
};

EventNew.propTypes = {
	// events: PropTypes.array.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
  usersCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
	Meteor.subscribe('events');
	Meteor.subscribe('menu'); 
	Meteor.subscribe('usersList'); 
	
	return {
		usersCount: Meteor.users.find().count(),
		// events: Menu.find({}, { sort: { createdAt: -1 } }).fetch(),
	  // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
	  	currentUser: Meteor.user(),
	};
}, EventNew);