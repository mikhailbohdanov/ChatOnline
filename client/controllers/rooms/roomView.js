/**
 * Created by Mykhailo_Bohdanov on 28/03/2016.
 */

function getRoomScroll(roomId) {
    var roomScroll = localStorage.getItem('roomScroll.' + roomId);
    return roomScroll ? parseInt(roomScroll, 10) : 0;
}
function setRoomScroll(roomId, scroll) {
    localStorage.setItem('roomScroll.' + roomId, scroll);
}

var $messagesWrapper    = null,
    $messagesList       = null,
    autorunScope        = null,
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
    var roomId      = null,
        room        = null,
        updated     = true;

    $messagesWrapper    = $('#messagesWrapper');
    $messagesList       = $('#messagesList');

    autorunScope = Deps.autorun(function() {
        if (!roomId || roomId != Session.get('currentRoomId')) {
            roomId  = Session.get('currentRoomId');
            room    = RoomsOpen.findOne(roomId);

            $messagesList
                .autoScroll('destroy')
                .autoScroll({
                    firstScroll : getRoomScroll(roomId) || -1,
                    onScroll    : function(current, prev) {
                        setRoomScroll(roomId, current.scroll);

                        if (current.scroll < 100 && updated) {
                            var firstMessage = Messages.findOne({
                                roomId  : roomId
                            }, {
                                sort    : {
                                    created : 1
                                }
                            });

                            updated = false;
                            Meteor.subscribe('roomMessagesPrevious', roomId, firstMessage._id, function() {
                                updated = true;
                                $messagesList.autoScroll('scrollTopOffset');
                            });
                        }
                    }
                });

            if (messages) {
                messages.stop();
            }

            messages = Messages.find({
                roomId  : roomId
            }).observe({
                added   : function() {
                    $messagesList.autoScroll('scroll');
                }
            });
        }
    });
};

Template.roomView.destroyed = function() {
    $messagesList.autoScroll('destroy');

    if (autorunScope) {
        autorunScope.stop();
        autorunScope = null;
    }

    if (messages) {
        messages.stop();
        messages = null;
    }
};