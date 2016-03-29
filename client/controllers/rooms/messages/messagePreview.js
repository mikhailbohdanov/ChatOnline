/**
 * Created by Mykhailo_Bohdanov on 24/03/2016.
 */

Template.messagePreview.helpers({
    author      : function() {
        return Users.find({
            _id     : this.authorId
        }, {
            limit   : 1
        });
    },
    messageDate : function() {
        return moment(this.created).format('HH:mm DD/MM/YYYY');
    }
});