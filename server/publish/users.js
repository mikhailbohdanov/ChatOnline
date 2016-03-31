/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Meteor.publish('users', function() {
    return Meteor.users.find();
});
