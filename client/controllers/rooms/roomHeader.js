/**
 * Created by Mykhailo_Bohdanov on 22/03/2016.
 */

Template.roomHeader.helpers({
    isRoute     : isRoute,
    roomsOpen   : function() {
        return RoomsOpen.find();
    },
    roomLast    : function() {
        return RoomsOpen.findOne();
    }
});

Template.roomHeader.events({
    'click button.create-new-room'  : function() {
        Router.go('room.create');
    }
});
