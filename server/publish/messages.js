/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Meteor.publish('roomMessages', function(roomIds) {
    return Messages.find({
        roomId  : {
            $in     : roomIds
        }
    });
});