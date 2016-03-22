/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

//// - - - - Open rooms collection
RoomsOpen = new Meteor.Collection(null);
_.extend(RoomsOpen, {
    open    : function(roomId) {
        var room = Rooms.findOne(roomId);

        try {
            this.insert(room);
        } catch (e) {}

        this.reloadMessages();

        return room;
    },
    close   : function(roomId) {
        this.remove(roomId);

        this.reloadMessages();
    },
    reloadMessages  : function() {
        var roomIds = lodash.map(this.find().fetch(), '_id');

        Meteor.subscribe('roomMessages', roomIds);
    }
});

//// - - - - Loaded local users collection
_.extend(Users, {
    userIds         : [],
    get             : function(userId) {
        if (this.userIds.indexOf(userId) < 0) {
            this.loadRemoteUser(userId);
        }

        return this.findOne(userId);
    },
    loadRemoteUser  : function(userId) {
        this.userIds.push(userId);
        Meteor.subscribe('users', this.userIds);
    }
});

