/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Meteor.publish('rooms', function() {
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
                    addedBefore : function(messageId, message) {
                        self.changed('Rooms', roomId, {
                            lastMessage : message
                        });
                    }
                });
        },
        handler     = Rooms.find().observeChanges({
            added   : function (roomId, room) {
                self.added('Rooms', roomId, room);
                initHandler(roomId);
            },
            changed : function(roomId, room) {
                self.changed('Rooms', roomId, room);
            },
            removed : function (roomId) {
                handlers[roomId] && handlers[roomId].stop();
                self.removed('Rooms', roomId);
            }
        });

    self.ready();
    self.onStop(function () {
        handler.stop();
    });
});
