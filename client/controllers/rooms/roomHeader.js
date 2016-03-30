/**
 * Created by Mykhailo_Bohdanov on 22/03/2016.
 */

Template.roomHeader.helpers({
    isRoute     : isRouteTemplate,
    roomsOpen   : function() {
        return RoomsOpen.find();
    },
    roomLast    : function() {
        return RoomsOpen.findOne(Session.get('currentRoomId')) || RoomsOpen.findOne();
    }
});

Template.roomHeader.events({
    'click button.create-new-room'  : function() {
        Router.go('room.create');
    }
});
