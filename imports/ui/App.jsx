import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {Events} from '../api/events.js';
import Event from './Components/Event.jsx';
import Header from './Elements/Header.jsx';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: '',
            price: '',
            hideCompleted: false,
        };

        this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    }

    renderEvents() {
        let {events} = this.props;
        let {hideCompleted} = this.state;

        if (hideCompleted) {
            events = events.filter((event) => event.status !== 'delivered');
        }

        return (
            
              <div>
                <label className="hideCompleted">
                    <input type="checkbox" onChange={this.toggleHideCompleted}/> 
                    hide completed
                </label>
                {events.map((event) => (          
                    <Event key={event._id} event={event} />
                ))}
             </div>
        )
       
    }

    render() {        
        return (
            <div className="container">
                <Header />

                <div className="container">
                    <div className="contentBLock">
                       {/*Check user authorizated*/}
                        { this.props.currentUser ?
                            this.props.children ? this.props.children : this.renderEvents()
                            : ''
                        }
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
        events: Events.find({
                $or: [
                    {'owner._id': Meteor.userId()},
                    {['available.users.' + Meteor.userId() + '.status']: true}]
            },
            {sort: {createdAt: -1}}).fetch(),
        // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
}, App);