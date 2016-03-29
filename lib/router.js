/**
 * Created by Mykhailo_Bohdanov on 21/03/2016.
 */

var RouteParams = {};

Router.configure({
    layoutTemplate      : 'mainLayout',
    loadingTemplate     : 'loading',
    notFoundTemplate    : 'notFound',
    waitOn              : function() {
        return [
            Meteor.subscribe('rooms'),
            Meteor.subscribe('users'),
            Meteor.subscribe('lastRoomMessage')
        ];
    }
});

Router.route('main', {
    path        : '/',
    action      : function() {
        Router.go('room.list');
    }
});

Router.route('room.list', {
    path        : '/rooms',
    template    : 'roomList',
    data        : function() {
        return Rooms.find();
    }
});

Router.route('room.view', {
    path        : '/room/:_id',
    template    : 'roomView',
    waitOn      : function() {
        return Meteor.subscribe('roomMessages', this.params._id);
    },
    data        : function() {
        return RoomsOpen.open(this.params._id);
    }
});

Router.route('room.create', {
    path        : '/room/create',
    template    : 'roomCreate'
});

Router.onBeforeAction(function() {
    lodash.empty(RouteParams);

    lodash.forEach(lodash.extend({}, this.params), function(value, key) {
        RouteParams[key] = value;
    });

    this.next();
});



isRouteTemplate = function(template) {
    var data = template.hash;

    return isRoute(data.route, data.data, data.textTrue, data.textFalse);
};

isRoute = function(routeName, data, textTrue, textFalse) {
    if (routeName === Router.current().route.getName() && checkRouteParams(data)) {
        return textTrue;
    } else {
        return textFalse;
    }
};

function checkRouteParams(data) {
    var check = true;

    if (data) {
        _.forEach(data, function(value, key) {
            if (!RouteParams[key] || RouteParams[key] !== value) {
                check = false;
            }
        });
    }

    return check;
}