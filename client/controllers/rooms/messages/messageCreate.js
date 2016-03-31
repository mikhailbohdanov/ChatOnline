/**
 * Created by Mykhailo_Bohdanov on 30/03/2016.
 */

var $messageBody    = null,
    $roomId         = null;

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
    var cache = Session.get('messagesCache') || {};

    cache[$roomId.val()] = $messageBody.val();

    Session.set('messagesCache', cache);
}

function messageSend() {
    var messageBody     = $messageBody.val().trim(),
        roomId          = $roomId.val();

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

Template.messageCreate.rendered = function() {
    $messageBody    = $('#messageBody');
    $roomId         = $('#roomId');

    var $messageList    = $('#messageList'),
        $window         = $(window),
        offsets         = 0,
        magicHeight     = 40;

    $window.on('resize orientationChange', function() {
        var offsetTop       = $messageList.offset().top,
            paddingTop      = parseInt($messageList.css('paddingTop'), 10),
            paddingBottom   = parseInt($messageList.css('paddingBottom'), 10);

        offsets = offsetTop + paddingTop + paddingBottom + magicHeight;
    }).trigger('resize');

    $messageBody.autoHeight({
        changeHeight    : function(size) {
            $messageList.height($window.outerHeight(true) - offsets - size.mainHeight);
        }
    }).focus();

    $messageList.autoScroll({
        scrollTo    : -1,
        scrollOnTop : function() {

        }
    });
};