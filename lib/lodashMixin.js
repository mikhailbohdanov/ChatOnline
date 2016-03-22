/**
 * Created by Mykhailo_Bohdanov on 11/03/2016.
 */

lodash.mixin({
    empty   : function(object) {
        lodash.each(object, function(value, key) {
            delete object[key];
        });

        return object;
    }
});