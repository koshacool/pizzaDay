import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Link, browserHistory} from 'react-router';
import {Helper} from './Helper/Helper.js';
import {Events} from '../api/events.js';
import {Menu} from '../api/menu.js';
import Food from './Food.jsx';
import People from './People.jsx';
import Header from './Header.jsx';


// App component - represents the whole app
class EventEdit extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        // 	// eventObj: false,
        // 	showAddPeople: false,
        // 	showAddMenu: false,
        // };

        // this.props.params.event ? this.getEventForEdit() : '';
    }

    // getEventForEdit() {
    // 	Meteor.call('events.findById', this.props.params.event, (err, result) => {
    // 		this.setState({
    // 			eventObj: result,
    // 		});
    // 	});
    // }

    // showFood() {
    // 	return (<Food event={this.props.event} />);
    // }
    //
    // showPeople() {
    // 	return (<People event={this.props.event} />);
    // }

    render() {
        return (
            <div className="container">
                { this.props.currentUser._id === this.props.event.owner._id ?
                    <div className="contentBLock">
                        <div className="buttons">
                            <h2>
                                <strong>Event Name: </strong> { this.props.event.text  }
                                <button >
                                    Change
                                </button>
                            </h2>
                            <h3>
                                <strong> Total people: </strong>
                                { Helper.countEvailableItems(this.props.event.available.users) }
                                <button>
                                    <Link to={'/event/' + this.props.event._id + '/people'}> Add People </Link>
                                </button>
                            </h3>
                            <h3>
                                <strong>Total
                                    food: </strong> { Helper.countEvailableItems(this.props.event.available.food) }
                                <button>
                                    <Link to={'/event/' + this.props.event._id + '/food'}> Add Food </Link>
                                </button>
                            </h3>
                        </div>
                        <div>
                            { this.props.children }
                        </div>
                    </div>
                    : <strong>You haven't permission to edit this event!</strong>
                }
            </div>
        );
    }
}
;

EventEdit.propTypes = {
    event: PropTypes.object.isRequired,
    // incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
    // countUsers: PropTypes.number.isRequired,
};

export default createContainer((params) => {
    Meteor.subscribe('events');
    Meteor.subscribe('menu');
    Meteor.subscribe('usersList');
    // console.log(params);
    return {
        // countUsers: Meteor.users.find().count(),
        event: Events.findOne(params.params.event),
        // incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
}, EventEdit);