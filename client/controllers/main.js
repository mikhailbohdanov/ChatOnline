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



LastRoomMessages = new Meteor.Collection('lastRoomMessages');

