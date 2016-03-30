/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

//// - - - - Open rooms collection
RoomsOpen = new Meteor.Collection(null);
_.extend(RoomsOpen, {
    subscribers : {},
    open    : function(roomId) {
        var room = Rooms.findOne(roomId);

        try {
            this.insert(room);
            this.subscribe(roomId);
        } catch (e) {}

        Session.set('currentRoomId', roomId);

        return room;
    },
    subscribe   : function(roomId) {
        setTimeout(function() {
            this.subscribers[roomId] = Meteor.subscribe('roomMessages', roomId);
        }.bind(this), 0);
    },
    close       : function(roomId) {
        this.remove(roomId);
        this.unsubscribe(roomId);

        if (this.find().count()) {
            var firstRoom = this.findOne();

            Router.go('room.view', {
                _id: firstRoom._id
            });
        } else {
            Router.go('room.list');
        }
    },
    unsubscribe : function(roomId) {
        if (this.subscribers[roomId]) {
            this.subscribers[roomId].stop();
        }

        delete this.subscribers[roomId];
    }
});
