// import { Meteor } from 'meteor/meteor';
// import '../imports/api/tasks.js';
import '../imports/api/menu.js';

Meteor.startup(() => {
  Meteor.publish('usersList', function () {  
  
	return Meteor.users.find({}, {fields: {username: 1, evailable: 1}});
  });
});