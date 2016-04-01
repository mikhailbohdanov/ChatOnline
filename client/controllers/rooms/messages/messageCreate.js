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
        $document       = $(document),
        offsets         = 0,
        magicHeight     = 40;

    $document.on('resize orientationChange', function() {
        var offsetTop       = $messageList.offset().top,
            paddingTop      = parseInt($messageList.css('paddingTop'), 10),
            paddingBottom   = parseInt($messageList.css('paddingBottom'), 10);

        offsets = offsetTop + paddingTop + paddingBottom + magicHeight;
    }).trigger('resize');

    $messageList.autoScroll({
        scrollTo    : -1,
        scrollOn    : function(scrollData) {
            console.log('scrolled', scrollData);
        },
        scrollOnTop : function(scrollData) {
            console.log('load more messages', scrollData);
        }
    });

    $messageBody.autoHeight({
        changeHeight    : function(size) {
            $messageList
                .height($document.outerHeight(true) - offsets - size.mainHeight)
                .autoScroll('scroll');
        }
    }).focus();

    Messages.find({
        roomId  : $roomId.val()
    }).observe({
        added   : function() {
            $messageList.autoScroll('scroll');
        }
    })
};