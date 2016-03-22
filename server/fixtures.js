/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

var users = {};
var rooms = {};
var emptyObj = {};

if (Users.find().count() === 0) {
    users.admin = Users.insert({
        name    : {
            first   : 'Admin',
            last    : 'Admin'
        }
    });

    users.user1 = Users.insert({
        name    : {
            first   : 'Some',
            last    : 'User1'
        }
    });

    users.user2 = Users.insert({
        name    : {
            first   : 'Some',
            last    : 'User2'
        }
    });

    users.user3 = Users.insert({
        name    : {
            first   : 'Some',
            last    : 'User3'
        }
    });
} else {
    users.admin = Users.findOne(emptyObj, {
        skip    : 0,
        limit   : 1
    })._id;

    users.user1 = Users.findOne(emptyObj, {
        skip    : 1,
        limit   : 1
    })._id;

    users.user2 = Users.findOne(emptyObj, {
        skip    : 2,
        limit   : 1
    })._id;

    users.user3 = Users.findOne(emptyObj, {
        skip    : 3,
        limit   : 1
    })._id;
}

if (Rooms.find().count() === 0) {
    rooms.AngularJS     = Rooms.insert({
        name        : 'AngularJS',
        authorId    : users.admin
    });

    rooms.MeteorJS      = Rooms.insert({
        name        : 'MeteorJS',
        authorId    : users.admin
    });

    rooms.BackboneJS    = Rooms.insert({
        name        : 'BackboneJS',
        authorId    : users.admin
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
        authorId    : users.user1,
        roomId      : rooms.AngularJS,
        message     : 'AngularJS the best'
    });

    Messages.insert({
        authorId    : users.user2,
        roomId      : rooms.MeteorJS,
        message     : 'MeteorJS the best'
    });

    Messages.insert({
        authorId    : users.user3,
        roomId      : rooms.BackboneJS,
        message     : 'BackboneJS the best'
    });
}