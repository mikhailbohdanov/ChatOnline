/**
 * Created by Mykhailo_Bohdanov on 22/03/2016.
 */

Meteor.methods({
    sendMessage : function(data) {
        check(data, {
            message : String,
            roomId  : String
        });


    }
});

