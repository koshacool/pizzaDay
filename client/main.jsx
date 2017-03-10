import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'; 
import '../imports/startup/accounts-config.js';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from '../imports/ui/App.jsx';
import NotFound from '../imports/ui/NotFound.jsx';
import Food from '../imports/ui/Food.jsx';
import Event from '../imports/ui/Event.jsx';
import People from '../imports/ui/People.jsx';



 
Meteor.startup(() => {	
  render(
  	<Router history={browserHistory}>
  		
    	<Route path='/' component={App} />
    	<Route path='/event' component={Event}>  
    		
    	</Route>    		
    		
    	<Route path='/menu' component={Food} /> 
      <Route path='/people' component={People} />
    	<Route path='*' component={NotFound} />

  	</Router>, document.getElementById('render-target'));
});