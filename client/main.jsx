import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import '../imports/startup/accounts-config.js';

import App from '../imports/ui/App.jsx';
import NotFound from '../imports/ui/NotFound.jsx';
import Food from '../imports/ui/Food.jsx';
import EventNew from '../imports/ui/EventNew.jsx';
import EventEdit from '../imports/ui/EventEdit.jsx';
import People from '../imports/ui/People.jsx';
import Order from '../imports/ui/Order.jsx';

Meteor.startup(() => {
    render(
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <Route path='/event' component={EventNew}/>
                <Route path='/event/:event' component={EventEdit}>
                    <Route path='/event/:event/food' component={Food}/>
                    <Route path='/event/:event/people' component={People}/>
                </Route>
                <Route path='/event/order/:event' component={Order}/>
            </Route>



            <Route path='*' component={NotFound}/>

        </Router>, document.getElementById('render-target'));
});