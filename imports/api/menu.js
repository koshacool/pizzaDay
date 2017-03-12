import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Menu = new Mongo.Collection('menu');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('menu', function menuPublication() {
	return Menu.find();
  });
}

Meteor.methods({
  'menu.insert'(text, price, eventId) {
	// Make sure the user is logged in before inserting a task
	if (!this.userId) {
	  throw new Meteor.Error('not-authorized');
	}
	
	check(text, String);
	check(price, String);

	if (Menu.findOne({text: text})) {
		throw new Meteor.Error('Such item exist already');
	}


	let obj = {
	  text,
	  price,
	  owner: this.userId,
	  createdAt: new Date(),
	  available: {
		[eventId]: true,        
	  },
	};

	Menu.insert(obj);

},

'menu.remove'(menuId) {
	check(menuId, String);

	const item = Menu.findOne(menuId);
	if (item.private && item.owner !== this.userId) {
	  // If the task is private, make sure only the owner can delete it
	  throw new Meteor.Error('not-authorized');
  }

  Menu.remove(menuId);
},

'menu.setAvailable'(menuId, eventId, setAvailable) {
  	check(menuId, String);
	check(setAvailable, Boolean);
	// const item = Menu.findOne(menuId);
	
	// if (item.private && item.owner !== this.userId) {
	//   // If the task is private, make sure only the owner can check it off
	//   throw new Meteor.Error('not-authorized');
	// }
	
	Menu.update(menuId, { $set: { ['available.' + eventId]: setAvailable } });	
},



});