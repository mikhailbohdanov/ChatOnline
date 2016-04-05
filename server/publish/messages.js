/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Meteor.publish('roomMessages', function(roomId) {
    var fromCreated = 0;

    var lastMessages = Messages.find({
        roomId  : roomId
    }, {
        limit   : 25,
        sort    : {
            created : -1
        },
        fields  : {
            created : 1
        }
    }).fetch();

    if (lastMessages && lastMessages.length) {
        fromCreated = lastMessages[lastMessages.length - 1].created;
    }

    return Messages.find({
        roomId  : roomId,
        created : {
            $gte    : fromCreated
        }
    }, {
        sort    : {
            created : 1
        }
    });
});

Meteor.publish('roomMessagesPrevious', function(roomId, firstMessage) {
    var firstMessage    = Messages.findOne(firstMessage);

    return Messages.find({
        roomId  : roomId,
        created : {
            $lt     : firstMessage.created
        }
    }, {
        sort    : {
            created : -1
        },
        limit   : 5
    });
});
