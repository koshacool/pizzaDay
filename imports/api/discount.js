import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Discount = new Mongo.Collection('discount');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('discount.by.eventId', function discountByEventId(eventId) {
        check(eventId, String);

        if (!this.userId) {
            return this.ready();
        }

        return Discount.find({eventId});
    });

    Meteor.publish('discountsList', function discountsList() {
        if (!this.userId) {
            return this.ready();
        }

        return Discount.find();
    });
}

Meteor.methods({
    'discount.insert'(discount, foodId, eventId) {
        check(discount, String);
        check(foodId, String);
        check(eventId, String);

        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        let existDiscount = Discount.findOne({foodId, eventId})
        if (existDiscount === undefined) {
            Discount.insert({
                discount,
                foodId,
                eventId,
            });

        } else {

            Discount.update(existDiscount._id, {
                $set: {
                    discount,
                    foodId,
                    eventId,
                }
            });
        }


    },

    'discount.remove'(eventId) {
        check(eventId, String);

        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        let discounts =  Discount.find({eventId}).fetch();
        discounts.forEach((discount) => Discount.remove({_id: discount._id}));
    },

    'discount.getForCount'(eventId) {
        check(eventId, String);

        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        return Discount.find({eventId});
    },

});