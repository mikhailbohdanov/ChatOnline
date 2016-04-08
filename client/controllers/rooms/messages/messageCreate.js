/**
 * Created by Mykhailo_Bohdanov on 30/03/2016.
 */

var watchRooms          = null,
    $messageBody        = null;

Template.messageCreate.helpers({
    roomId      : function() {
        return Session.get('currentRoomId');
    },
    cachedMessage   : function() {
        return Session.get('messagesCache')[this._id];
    }
});

Template.messageCreate.events({
    'click #sendMessage'    : function(e) {
        e.preventDefault();

        messageSend();
    },
    'keydown #messageBody'  : function(e) {
        messageCached();

        if (e.ctrlKey && e.keyCode === 13) {
            e.preventDefault();

            messageSend();
        } else if (e.keyCode === 27) {
            Router.go('room.list');
        }
    }
});

function messageCached() {
    //var cache = Session.get('messagesCache') || {};
    //
    //cache[$roomId.val()] = $messageBody.val();
    //
    //Session.set('messagesCache', cache);
}

function messageSend() {
    var messageBody     = $messageBody.val().trim(),
        roomId          = Session.get('currentRoomId');

    if (roomId && messageBody) {
        Meteor.call('messageSend', {
            roomId  : roomId,
            message : messageBody
        }, function(err) {
            if (err) {
                throw err;
            }

            $messageBody.val('').autoHeight().focus();
        });
    }
}

Template.messageCreate.created = function() {
    watchRooms = Deps.autorun(function() {
        RoomsOpen.find({
            _id : Session.get('currentRoomId')
        }).observe({
            added   : function(room) {

            },
            removed : function(room) {

            }
        });
    });
};

Template.messageCreate.rendered = function() {
    var $messagesSeparator  = $('#messagesSeparator'),
        $messagesWrapper    = $('#messagesWrapper'),
        $messagesList       = $('#messagesList'),
        magicHeight         = 40,
        offset              = 0;

    $messageBody            = $('#messageBody');

    $(window).on('resize orientationChange', function() {
        var paddingTop      = parseInt($messagesList.css('paddingTop'), 10) || 0,
            paddingBottom   = parseInt($messagesList.css('paddingBottom'), 10) || 0;

        $messagesWrapper.css('top', $messagesSeparator.offset().top);

        offset = $messagesWrapper.outerHeight(true) - (paddingTop + paddingBottom + magicHeight);
    }).trigger('resize');

    $messageBody.autoHeight({
        changeHeight    : function(size) {
            $messagesList
                .height(offset - size.mainHeight)
                .autoScroll('scroll');
        }
    }).focus();
};

Template.messageCreate.destroyed = function() {
    if (watchRooms) {
        watchRooms.stop();
    }
};