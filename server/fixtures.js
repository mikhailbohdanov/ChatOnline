/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

var users = {};
var rooms = {};
var emptyObj = {};
var now = new Date().getTime();

if (Meteor.users.find().count() === 0) {
    users.admin = Accounts.createUser({
        username    : 'Admin',
        password    : 'Admin'
    });
} else {
    users.admin = Meteor.users.findOne(emptyObj, {
        skip    : 0,
        limit   : 1
    })._id;
}

if (Rooms.find().count() === 0) {
    rooms.AngularJS     = Rooms.insert({
        name        : 'AngularJS',
        authorId    : users.admin,
        created     : now - (31 * 24 * 3600 * 1000)
    });

    rooms.MeteorJS      = Rooms.insert({
        name        : 'MeteorJS',
        authorId    : users.admin,
        created     : now - (31 * 24 * 3600 * 1000)
    });

    rooms.BackboneJS    = Rooms.insert({
        name        : 'BackboneJS',
        authorId    : users.admin,
        created     : now - (31 * 24 * 3600 * 1000)
    });
} else {
    rooms.AngularJS     = Rooms.findOne(emptyObj, {
        skip    : 0,
        limit   : 1
    })._id;

    rooms.MeteorJS      = Rooms.findOne(emptyObj, {
        skip    : 1,
        limit   : 1
    })._id;

    rooms.BackboneJS    = Rooms.findOne(emptyObj, {
        skip    : 2,
        limit   : 1
    })._id;
}

if (Messages.find().count() === 0) {
    Messages.insert({
        authorId    : users.admin,
        roomId      : rooms.AngularJS,
        message     : 'AngularJS the best',
        created     : now - (25 * 24 * 3600 * 1000)
    });

    Messages.insert({
        authorId    : users.admin,
        roomId      : rooms.MeteorJS,
        message     : 'MeteorJS the best',
        created     : now - (24 * 24 * 3600 * 1000)
    });

    Messages.insert({
        authorId    : users.admin,
        roomId      : rooms.BackboneJS,
        message     : 'BackboneJS the best',
        created     : now - (23 * 24 * 3600 * 1000)
    });
}