/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Meteor.publish('lastRoomMessage', function() {
    var self        = this,
        handlers    = {},
        initHandler = function(roomId) {
            handlers[roomId] = Messages
                .find({
                    roomId  : roomId
                }, {
                    limit   : 1,
                    sort    : {
                        created : -1
                    }
                })
                .observeChanges({
                    addedBefore : function(messageId, message, tmp) {
                        self.added('lastRoomMessages', roomId, message);
                    },
                    changed : function(messageId, message) {
                        self.changed('lastRoomMessages', roomId, message);
                    },
                    removed : function() {
                        self.removed('lastRoomMessages', roomId);
                    }
                });
        },
        handler     = Rooms.find().observeChanges({
            added   : function (roomId) {
                initHandler(roomId);
            },
            removed : function (roomId) {
                handlers[roomId] && handlers[roomId].stop();
                self.removed('lastRoomMessages', roomId);
            }
        });

    self.ready();
    self.onStop(function () {
        handler.stop();
    });
});

Meteor.publish('roomMessages', function(roomId) {
    var lastMessages = Messages.findOne({
        roomId  : roomId
    }, {
        offset  : 10,
        sort    : {
            created : -1
        },
        fields  : {
            created : 1
        }
    });

    return Messages.find({
        roomId  : roomId,
        created : {
            $gt     : lastMessages.created
        }
    });
});