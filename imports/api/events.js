import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('events', function eventPublication() {
  	return Events.find();
  });

}

Meteor.methods({
	'events.insert'(text) {
		check(text, String);
		// Make sure the user is logged in before inserting a task
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}	 

		let obj = {
			text,	  
			owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,

			},
			createdAt: new Date(),
			status: 'ordering',
			available: {
				users: {
					[Meteor.userId()]: true,
				},
				food: {},
			},
			order: {},
		};	

		// return Events.insert(obj);
		return Events.findOne({_id: Events.insert(obj)});
	},

	'events.remove'(eventId) {
		check(eventId, String);

		const event = Events.findOne(eventId);
		// console.log(this.userId);
		if (event.owner._id !== this.userId) {
	  		// If the task is private, make sure only the owner can delete it
	 		 throw new Meteor.Error('not-authorized');
  		}
   		Events.remove(eventId);
	},

	'events.findById'(eventId) {
		check(eventId, String);

		const event = Events.findOne(eventId);
		if (event.owner._id !== this.userId) {
	  		// If the task is private, make sure only the owner can delete it
	 		 throw new Meteor.Error('You haven\'t access to this event');
  		}
   		return event;
	},

	'events.userAvailable'(userId, eventId, setAvailable) {
  		check(userId, String);
  		check(eventId, String);
		check(setAvailable, Boolean);
		// const item = Menu.findOne(menuId);
	
		// if (item.private && item.owner !== this.userId) {
		//   // If the task is private, make sure only the owner can check it off
		//   throw new Meteor.Error('not-authorized');
		// }
	
		Events.update(eventId, { $set: { ['available.users.' + userId]: setAvailable } });	
	},

	'events.foodAvailable'(foodId, eventId, setAvailable) {
  		check(foodId, String);
  		check(eventId, String);
		check(setAvailable, Boolean);
		// const item = Menu.findOne(menuId);
	
		// if (item.private && item.owner !== this.userId) {
		//   // If the task is private, make sure only the owner can check it off
		//   throw new Meteor.Error('not-authorized');
		// }
	
		Events.update(eventId, { $set: { ['available.food.' + foodId]: setAvailable } });	
	},

	'events.order'(foodId, eventId, setOrdered) {
  		check(foodId, String);
  		check(eventId, String);
		check(setOrdered, Boolean);
		// const item = Menu.findOne(menuId);
	
		// if (item.private && item.owner !== this.userId) {
		//   // If the task is private, make sure only the owner can check it off
		//   throw new Meteor.Error('not-authorized');
		// }
	
		Events.update(eventId, { $set: { ['order.' + Meteor.userId() + '.' + foodId]: setOrdered } });	
	},


	
});