/**
 * Created by Mykhailo_Bohdanov on 28/03/2016.
 */

var $messagesSeparator  = null,
    $messagesWrapper    = null,
    $messagesList       = null,
    messages            = null;

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
        }, {
            sort    : {
                created : 1
            }
        });
    },
    messagesRead    : function() {
        return Messages.find({
            roomId  : this._id
        }, {
            sort    : {
                created : 1
            }
        });
    }
});

Template.roomView.events({
    'click .room-item-exit': function (e) {
        e.preventDefault();

        RoomsOpen.close(this._id);
    }
});

Template.roomView.rendered = function() {
    $messagesWrapper    = $('#messagesWrapper');
    $messagesList       = $('#messagesList');

    $messagesList.autoScroll({
        scrollTo    : -1,
        scrollOn    : function(scrollData, allData) {
            if (scrollData.currentScroll < 100) {
                var roomId  = Session.get('currentRoomId');
                var firstMessage = Messages.findOne({
                    roomId  : roomId
                }, {
                    sort    : {
                        created : 1
                    }
                });

                Meteor.subscribe('roomMessagesPrevious', roomId, firstMessage._id, function() {
                    $messagesList.autoScroll('scrollTopOffset', allData);
                });

                //console.log(scrollData, allData);
            }
        }
    });

    messages = Messages.find({
        roomId  : Session.get('currentRoomId')
    }).observe({
        added   : function() {
            $messagesList.autoScroll('scroll');
        }
    });
};

Template.roomView.destroyed = function() {
    if (messages) {
        messages.stop();
    }
};
