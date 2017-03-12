// import { Meteor } from 'meteor/meteor';
// import '../imports/api/tasks.js';
import '../imports/api/menu.js';
import '../imports/api/events.js';

Meteor.startup(() => {
  Meteor.publish('usersList', function () {    
	return Meteor.users.find({}, {fields: {username: 1, evailable: 1}});
  });
  	
});

