// import { Meteor } from 'meteor/meteor';
// import '../imports/api/tasks.js';
import '../imports/api/menu.js';
import '../imports/api/events.js';

Meteor.startup(() => {
    Meteor.publish('usersList', function () {
        return Meteor.users.find({}, {fields: {username: 1, evailable: 1, groups: 1}});
    });

    //Meteor.methods({
    //    'users.createGroup'(name) {
    //        return Meteor.users.update(Meteor.userId(), {$set: {['groups.' + evt.target[0].value]: false}});
    //
    //    }
    //
    //});

    Meteor.users.allow({
        update(userId, doc, fields, modifier) {
            // Can only change your own documents.
            //return doc._id === userId;
            console.log('UPDATE USER');
            return true;
        },

    });

});



