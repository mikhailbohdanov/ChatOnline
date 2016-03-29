/**
 * Created by Mykhailo_Bohdanov on 22/03/2016.
 */

Template.roomPreview.helpers({
    author      : function() {
        return Users.find({
            _id     : this.authorId
        }, {
            limit   : 1
        });
    },
    lastMessage : function() {
        return LastRoomMessages.findOne(this._id);
    }
});