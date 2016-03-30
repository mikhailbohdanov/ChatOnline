/**
 * Created by Mykhailo_Bohdanov on 30/03/2016.
 */

Template.messageView.helpers({
    author      : function() {
        return Users.find({
            _id     : this.authorId
        }, {
            limit   : 1
        });
    },
    messageDate : function() {
        return moment(this.created).format('HH:mm DD MMM YYYY');
    },
    myMessage   : function(returned) {
        var userId = Meteor.userId();

        if (userId && userId === this.authorId) {
            return returned;
        }
    }
});