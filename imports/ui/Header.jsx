import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';


class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <header>
                    <AccountsUIWrapper />
                    <h1>Pizza Day</h1>
                    { this.props.currentUser ?
                        <div className="buttons">
                            <button>
                                <Link to='/'> Main </Link>
                            </button>

                            <button>
                                <Link to='/event'>New Event</Link>
                            </button>
                        </div>
                        : ''
                    }
                </header>
            </div>
        )
    }
}

Header.propTypes = {
    currentUser: PropTypes.object,
};

export default createContainer(() => {
    return {
        currentUser: Meteor.user
        (),
    }
}, Header);