import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Email} from 'meteor/email'

import '../imports/api/menu.js';
import '../imports/api/events.js';
import '../imports/api/discount.js';


Meteor.startup(() => {
    //Settings for send email
    process.env.MAIL_URL = 'smtp://' +
        'postmaster@sandboxc9f396b7ccbf40deaab05fafbe31d275.mailgun.org:' +
        '8fb20b9094f27b6ad34ddc5d9b33520c@' +
        'smtp.mailgun.org:587';

    //Settings for google auth
    ServiceConfiguration.configurations.remove({service: 'google'});
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: '403253438904-qj33b32v4rd6vrofdtrtkjb87bit50tk.apps.googleusercontent.com',
        secret: 'eOsoxL7qvTwIcRrprP6043y1'
    });

    Meteor.publish('usersList', function () {
        return Meteor.users.find({}, {
            fields: {
                username: 1,
                'services.google.email': 1,
                'profile': 1,
                evailable: 1,
                groups: 1
            }
        });
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
        Email.send({to, from, subject, text});
    },


    //removeAllPosts: () => {
    //    console.log('Removed all users')
    //    return Meteor.users.remove({});
    //},


});



