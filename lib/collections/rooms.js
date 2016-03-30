/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

Rooms = new Mongo.Collection('Rooms');

Rooms.allow({
    insert  : function() {
        return true;
    }
});