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
import FormForName from './ModalWindows/FormForName.jsx';


// App component - represents the whole app
class EventEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: '',
        }
    }

    hideModalWindow() {
        this.setState({modal: ''});
    }

    changeName(evt) {
        evt.preventDefault();
        Meteor.call('events.changeName', this.props.event._id, evt.target[0].value,  (err, result) => {
            this.hideModalWindow(); //hide modal window
        });
    }

    displayFormChangeName() {
        this.setState({
            modal: <FormForName
                formName="Event Name: "
                inputValue={this.props.event.text}
                hideModalWindow={this.hideModalWindow.bind(this)}
                formSubmit={this.changeName.bind(this)}
            />
        });
    }

    renderEditEvent() {
       return (
           <div className="container">
            { this.props.currentUser._id === this.props.event.owner._id ?
                <div className="contentBLock">
                    <div className="buttons">
                        <h2>
                            <strong>Event Name: </strong>
                            <span id='eventName' onClick={this.displayFormChangeName.bind(this)}>
                                { this.props.event.text }
                            </span>
                        </h2>
                        <h3>
                            <strong> Total people: </strong>
                            { Helper.countEvailableUsers(this.props.event.available.users) }
                            <button>
                                <Link to={'/event/' + this.props.event._id + '/people'}> Add People </Link>
                            </button>
                        </h3>
                        <h3>
                            <strong>Total
                                food: </strong> { Helper.countEvailableFood(this.props.event.available.food) }
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
            {this.state.modal}
        </div>
       )
    }

    render() {

        return (
            <div>
            { this.props.event ?
                this.renderEditEvent()
                : 'Bad id. Such event doesn\'t exist!'
            }
            </div>
        );
    }
};

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