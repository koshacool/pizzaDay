import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import {nonEmptyInput, handleInputChange} from './Helper/Helper.js';
import { Events } from '../api/events.js';
import { Menu } from '../api/menu.js';
import Food from './Food.jsx';



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

	showFood() {
		return (<Food eventId={this.state.eventObj._id} />);
	}

	showPeople() {
		return (<People />);
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
				<h3>{ this.state.eventName }</h3> 
				<button onClick={ (event) => {this.setState( {showAddPeople: !this.state.showAddPeople} )} }>
					Add People
				</button> 
				<button onClick={ (event) => {this.setState( {showAddMenu: !this.state.showAddMenu} )} }>
					Add Food
				</button> 
			</div>
				:

			
			<form className="new-task" onSubmit={this._createEvent} >
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
			type="submit">
			Create
			</button>

			</div>	
			</form> 
				
			}

			

			

			

			</div>

			<div>	
				{ this.state.showAddMenu ? this.showFood() : '' } 
			</div>

			</div>



			);
	}

};

EventNew.propTypes = {
	events: PropTypes.array.isRequired,
  // incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
	Meteor.subscribe('events');
	
	return {
		events: Menu.find({}, { sort: { createdAt: -1 } }).fetch(),
	  // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
	  	currentUser: Meteor.user(),
	};
}, EventNew);