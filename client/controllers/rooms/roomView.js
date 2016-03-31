/**
 * Created by Mykhailo_Bohdanov on 28/03/2016.
 */

Template.roomView.helpers({
    isRoute     : isRouteTemplate,
    roomsOpen   : function() {
        return RoomsOpen.find();
    },
    roomData    : function() {
        return {
            _id : this._id
        };
    },
    messagesNotRead : function() {
        return Messages.find({
            roomId  : this._id + 1
        });
    },
    messagesRead    : function() {
        return Messages.find({
            roomId  : this._id
        });
    }
});

Template.roomView.events({
    'click .room-item-exit': function (e) {
        e.preventDefault();

        RoomsOpen.close(this._id);
    }
});