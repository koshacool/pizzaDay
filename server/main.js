// import { Meteor } from 'meteor/meteor';
// import '../imports/api/tasks.js';
import '../imports/api/menu.js';
import '../imports/api/events.js';

Meteor.startup(() => {
    Meteor.publish('usersList', function () {
        return Meteor.users.find({}, {fields: {username: 1, 'services.google.email': 1, 'profile': 1, evailable: 1, groups: 1}});
    });


    Meteor.users.allow({
        update(userId, doc, fields, modifier) {
            // Can only change your own documents.
            //return doc._id === userId;
            console.log('UPDATE USER');
            return true;
        },

        //remove(userId, doc, fields, modifier) {
        //    // Can only change your own documents.
        //    //return doc._id === userId;
        //    console.log('Remove USER');
        //    return true;
        //},

    });

});

Meteor.methods({
    createGroup: (name, value) => {
        Meteor.users.update(
            Meteor.userId(),
            {$set: {['groups.' + name]: value}}
        );
    },

    removeGroup: (name) => {
        Meteor.users.update(
            Meteor.userId(),
            {$unset: {['groups.' + name]: ''}}
        );
    },

    addUserToGroup: (groupName, userId, state) => {
        return Meteor.users.update(
            Meteor.userId(),
            {$set: {['groups.' + groupName + '.' + userId]: state}}
        );
    },



    //removeAllPosts: () => {
    //    console.log('Removed all users')
    //    return Meteor.users.remove({});
    //},



});



