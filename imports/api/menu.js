import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Menu = new Mongo.Collection('menu');

if (Meteor.isServer) {
    Meteor.publish('menu', function menuPublication() {
        if (!this.userId) {
            return this.ready();
        }

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
        check(price, Number);

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

        Menu.update(menuId, {$set: {['available.' + eventId]: setAvailable}});
    },

    'menu.getById'(_id) {
        check(_id, String);
        // const item = Menu.findOne(menuId);

        // if (item.private && item.owner !== this.userId) {
        //   // If the task is private, make sure only the owner can check it off
        //   throw new Meteor.Error('not-authorized');
        // }

        return Menu.find({_id}, {text: 1, price: 1});
    },


});