/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Meteor.publish('rooms', function() {
    return Rooms.find();
});
