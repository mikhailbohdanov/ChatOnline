/**
 * Created by Mykhailo_Bohdanov on 25/03/2016.
 */

(function($) {
    $.fn.autoHeight = function(options) {
        if (this.data('autoHeight') !== 'inited') {
            options = _.extend({
                defaultHeight   : 14,
                changeHeight    : null
            }, options);

            var $self       = this,
                self        = $self[0],
                minHeight   = $self.data('min'),
                maxHeight   = $self.data('max'),
                height, top, bottom, lineHeight;

            if (!minHeight && !maxHeight) {
                return false;
            }

            top         = parseInt($self.css('paddingTop'), 10);
            bottom      = parseInt($self.css('paddingBottom'), 10);
            lineHeight  = parseInt($self.css('lineHeight'), 10);

            if (_.isNaN(lineHeight)) {
                lineHeight  = parseInt($self.css('fontSize'), 10);

                if (_.isNaN(lineHeight)) {
                    lineHeight  = options.defaultHeight;
                }
            }

            if (!minHeight) {
                minHeight   = lineHeight;
            } else if (parseInt(minHeight, 10) == minHeight) {
                minHeight   = minHeight * lineHeight;
            } else {
                minHeight   = parseInt(minHeight, 10);

                if (minHeight < lineHeight) {
                    minHeight   = lineHeight;
                }
            }

            if (!maxHeight && parseInt(maxHeight, 10)  < minHeight) {
                maxHeight   = 0;
            } else if (parseInt(maxHeight, 10) == maxHeight) {
                maxHeight   = maxHeight * lineHeight;
            } else {
                maxHeight   = parseInt(maxHeight, 10);
            }

            $self
                .on('input', function() {
                    $self.height(minHeight);

                    height  = self.scrollHeight - top - bottom;

                    if (height < minHeight) {
                        height  = minHeight;
                    }

                    if (height > maxHeight) {
                        height  = maxHeight;
                    }

                    $self.height(height);

                    if ($self.scrollTop() + height >= self.scrollHeight - top - bottom - lineHeight) {
                        $self.scrollTop(self.scrollHeight);
                    }

                    if (options.changeHeight) {
                        options.changeHeight.call(this, {
                            minHeight   : minHeight,
                            maxHeight   : maxHeight,
                            height      : height,
                            mainHeight  : $self.outerHeight(true)
                        });
                    }
                })
                .data('autoHeight', 'inited');
        }

        return this.trigger('input');
    };
})(jQuery);

(function($) {
    function load($el) {
        return $el.data('autoHeight');
    }
    function save($el, data) {
        return $el.data('autoHeight', data);
    }

    var methods = {
        init        : function(options) {
            var $self   = this,
                data    = load($self);

            if (!data) {
                options = _.extend({}, $.fn.autoScroll.defaults, options);

                data    = {
                    currentScroll   : 0,
                    currentHeight   : 0,
                    maxScroll       : 0,
                    options         : options
                };

                $self
                    .on('scroll', function() {
                        var update  = {
                            currentScroll   : this.scrollTop,
                            maxScroll       : this.scrollHeight,
                            currentHeight   : $self.outerHeight(true)
                        };

                        _.extend(data, update);

                        if (data.inited && data.options.scrollOn) {
                            data.options.scrollOn.call($self, update, data);
                        }

                        if (data.inited && data.options.scrollOnTop && data.currentScroll == 0) {
                            data.options.scrollOnTop.call($self, update, data);
                        }

                        save($self, data);
                    })
                    .trigger('scroll');

                methods.scrollTo.call($self, data.options.scrollTo, data, true);

                data.inited = true;
            }

            return save(this, data);
        },
        scroll      : function(data) {
            if (!data) {
                data    = load(this);
            }

            if (!data) {
                return;
            }

            if (data.maxScroll - data.currentHeight == data.currentScroll) {
                methods.scrollTo.call(this, this[0].scrollHeight);
            }
        },
        scrollTo    : function(to, data, animateOff) {
            if (_.isBoolean(data)) {
                animateOff = data;
            }

            if (!data) {
                data    = load(this);
            }

            if (!data) {
                return;
            }

            if (_.isNumber(to)) {
                if (to < 0) {
                    to = data.maxScroll - data.currentHeight;
                }

                if (!animateOff) {
                    this
                        .stop()
                        .animate({
                            scrollTop   : to
                        }, data.options.scrollSpeed);
                } else {
                    this
                        .stop()
                        .scrollTop(to);
                }
            } else if (_.isObject(to)) {
                methods.scrollTo.call(this, $(to).offset().top - this.offset().top, data, animateOff);
            }
        },
        scrollTopOffset : function(data) {
            if (!data) {
                data    = load(this);
            }

            if (!data) {
                return;
            }

            var scrollOffset = this[0].scrollHeight - data.maxScroll;

            console.log(data, scrollOffset, this);
        }
    };

    $.fn.autoScroll = function(method, options) {
        var args;

        if (_.isString(method)) {
            args    = Array.prototype.slice.call(arguments, 1);
        } else {
            args    = Array.prototype.slice.call(arguments, 0);
            method  = 'init';
        }

        return this.each(function() {
            var $this   = $(this);

            if (methods[method]) {
                methods[method].apply($this, args);
            } else {
                methods.init.apply($this, args);
            }
        });
    };

    $.fn.autoScroll.defaults = {
        inited      : false,
        scrollTo    : -1,
        scrollOn    : null,
        scrollOnTop : null,
        scrollSpeed : 200
    };
})(jQuery);