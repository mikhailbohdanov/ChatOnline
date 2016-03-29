/**
 * Created by Mykhailo_Bohdanov on 22/03/2016.
 */

Messages = new Mongo.Collection('Messages');

Messages.allow({
    insert  : function() {
        return true;
    }
});