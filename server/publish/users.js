/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Meteor.publish('users', function(userIds) {
    return Users.find({
        _id     : {
            $in : userIds
        }
    });
});
