// import { Meteor } from 'meteor/meteor';
// import '../imports/api/tasks.js';
import '../imports/api/menu.js';
import '../imports/api/events.js';
import { check } from 'meteor/check';
import { Email } from 'meteor/email'

Meteor.startup(() => {
    //process.env.MAIL_URL = 'smtp://MY_MANDRILL_EMAIL:MY_MANDRILL_API_KEY@smtp.mandrillapp.com:587';

    process.env.MAIL_URL = 'smtp://' +
        'postmaster@sandboxc9f396b7ccbf40deaab05fafbe31d275.mailgun.org:' +
        '8fb20b9094f27b6ad34ddc5d9b33520c@' +
        'smtp.mailgun.org:587';

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

    sendEmail: (to, from, subject, text) => {
        // Make sure that all arguments are strings.
        check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running, without
        // waiting for the email sending to complete.
        //this.unblock();
        Email.send({ to, from, subject, text });
    },





    //removeAllPosts: () => {
    //    console.log('Removed all users')
    //    return Meteor.users.remove({});
    //},



});



