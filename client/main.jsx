import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'; 
import App from '../imports/ui/App.jsx';
import NotFound from '../imports/ui/NotFound.jsx'
import Food from '../imports/ui/Food.jsx'
// import Event from '../imports/ui/Event.jsx';
import '../imports/startup/accounts-config.js';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

 
Meteor.startup(() => {	
  render(
  	<Router history={browserHistory}>

    	<Route path='/' component={App}>      		
    		<Route path='menu' component={Food} />
    	</Route>
    	
    	<Route path='*' component={NotFound} />

  	</Router>, document.getElementById('render-target'));
});