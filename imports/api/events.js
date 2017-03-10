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
			owner: this.userId,
			createdAt: new Date(),
			status: 'ordering',
		};	

		// return Events.insert(obj);
		return Events.findOne({_id: Events.insert(obj)});
	},

});