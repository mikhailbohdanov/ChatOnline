/**
 * Created by Mykhailo_Bohdanov on 22/03/2016.
 */

Template.roomPreview.helpers({
    author  : function() {
        return Users.get(this.authorId);
    }
});