import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Link } from 'react-router'

// App component - represents the whole app
export default class App extends Component { 
  render() {
	return (
	  <div className="container">
		<header>		
    <AccountsUIWrapper />    
		    <h1>Pizza Day</h1>
        <button><Link to='/menu'>Create Event</Link></button>
		  </header>
      {this.props.children}
    </div>
	 )
  }

};