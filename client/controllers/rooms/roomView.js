/**
 * Created by Mykhailo_Bohdanov on 28/03/2016.
 */

Template.roomView.helpers({
    isRoute     : isRoute,
    roomsOpen   : function() {
        return RoomsOpen.find();
    },
    roomData    : function() {
        return {
            _id : this._id
        };
    },
    messages    : function() {
        return Messages.find({
            roomId  : this._id
        })
    }
});

Template.roomView.events({//TODO need fix this case, on close last chat room, room has open
    'click .room-item-exit': function (e) {
        e.preventDefault();

        RoomsOpen.remove(this._id);

        if (RoomsOpen.find().count()) {
            var firstRoom = RoomsOpen.findOne();

            Router.go('room.view', {
                _id: firstRoom._id
            });
        } else {
            Router.go('room.list');
        }
    }
});