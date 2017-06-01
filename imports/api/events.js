import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
    Meteor.publish('events', function eventPublication() {
        if (!this.userId) {
            return this.ready();
        }

        return Events.find();
    });

}

Meteor.methods({
    'events.insert'(text, date, time) {
        check(text, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let obj = {
            text,
            date: new Date(date + ' ' + time),
            owner: {
                _id: Meteor.userId(),
                name: Meteor.user().profile.name,
                email: Meteor.user().services.google.email,
            },
            createdAt: new Date(),
            status: 'ordering',
            available: {
                users: {
                    [Meteor.userId()]: {
                        status: true,
                        name: Meteor.user().profile.name,
                        email: Meteor.user().services.google.email,
                    },
                },
                food: {},
                groups: {},
            },
            orders: {},
        };

        // return Events.insert(obj);
        return Events.findOne({_id: Events.insert(obj)});
    },

    'events.changeName'(eventId, name) {
        check(name, String);
        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return Events.update(eventId, {$set: {text: name}});
    },

    'events.remove'(eventId) {
        check(eventId, String);

        const event = Events.findOne(eventId);
        // console.log(this.userId);
        if (event.owner._id !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        return Events.remove(eventId);
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

    'events.userAvailable'(user, eventId, setAvailable) {
        check(user, Object);
        check(eventId, String);
        check(setAvailable, Boolean);
        // const item = Menu.findOne(menuId);

        // if (item.private && item.owner !== this.userId) {
        //   // If the task is private, make sure only the owner can check it off
        //   throw new Meteor.Error('not-authorized');
        // }

        return Events.update(eventId, {
            $set: {
                ['available.users.' + user._id]: {
                    status: setAvailable,
                    name: user.profile.name,
                    email: user.services.google.email,
                }
            }
        });
    },

    'events.foodAvailable'(foodId, eventId, setAvailable) {
        check(foodId, String);
        check(eventId, String);
        check(setAvailable, Boolean);
        // const item = Menu.findOne(menuId);

        // if (item.private && item.owner !== this.userId) {
        //   // If the task is private, make sure only the owner can check it off
        //   throw new Meteor.Error('not-authorized');
        //N }

        return Events.update(eventId, {$set: {['available.food.' + foodId]: setAvailable}});
    },

    'events.groupAvailable'(groupName, eventId, setAvailable) {
        check(groupName, String);
        check(eventId, String);
        check(setAvailable, Boolean);
        // const item = Menu.findOne(menuId);

        // if (item.private && item.owner !== this.userId) {
        //   // If the task is private, make sure only the owner can check it off
        //   throw new Meteor.Error('not-authorized');
        //N }

        return Events.update(eventId, {$set: {['available.groups.' + groupName]: setAvailable}});
    },

    'events.groupRemove'(groupName, eventId) {
        check(groupName, String);
        check(eventId, String);

        // const item = Menu.findOne(menuId);

        // if (item.private && item.owner !== this.userId) {
        //   // If the task is private, make sure only the owner can check it off
        //   throw new Meteor.Error('not-authorized');
        //N }

        return Events.update(eventId, {$unset: {['available.groups.' + groupName]: ''}});
    },

    'events.order'(foodId, eventId, setOrdered, number) {
        check(foodId, String);
        check(eventId, String);
        check(setOrdered, Boolean);
        // const item = Menu.findOne(menuId);

        // if (item.private && item.owner !== this.userId) {
        //   // If the task is private, make sure only the owner can check it off
        //   throw new Meteor.Error('not-authorized');
        // }
        var menuItem = 'orders.' + Meteor.userId() + '.order.' + foodId;
        Events.update(eventId, {$set: {[menuItem + '.status']: setOrdered, [menuItem + '.number']: number}});
    },

    'events.userOrderStatus'(eventId, status) {
        check(eventId, String);
        check(status, String);

        var order = 'orders.' + Meteor.userId() + '.order';
        Events.update(eventId, {$set: {[order + '.status']: status}});
    },

    'events.orderStatus'(eventId, status) {
        check(eventId, String);
        check(status, String);

        Events.update(eventId, {$set: {'status': status}});
    },

});