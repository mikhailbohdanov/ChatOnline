/**
 * Created by Mykhailo_Bohdanov on 22/03/2016.
 */

Meteor.methods({
    messageSend : function(data) {
        //check(Meteor.userId(), String);
        //check(data, {
        //    message : String,
        //    roomId  : String
        //});

        var message = {
            roomId      : data.roomId,
            authorId    : Meteor.userId(),
            message     : data.message
                .substr(0, 1000)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n{3,}/gi, '\n\n')
                .replace(/\n/gi, '<br/>')
                .replace(/\s{2,}/gi, ' '),
            created     : new Date().getTime()
        };

        message._id = Messages.insert(message);

        return message;
    }
});

