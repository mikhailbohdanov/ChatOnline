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
    function AutoScroll($el, options) {
        if (this.inited) {
            return;
        }

        this.$el        = $el;
        this.el         = $el[0];
        this.options    = _.extend({}, AutoScroll.defaults, options);
    }
    _.extend(AutoScroll, {
        defaults    : {
            onScroll    : null,
            onScrollTop : null,
            firstScroll : -1,
            scrollSpeed : 200
        }
    });
    _.extend(AutoScroll.prototype, {
        init        : function() {
            if (this.inited) {
                return;
            }

            this.scrollData = {
                scroll      : 0,
                maxScroll   : 0,
                height      : 0
            };

            this.$el
                .on('scroll.autoScroll', function() {
                    var prevScroll      = {
                            scroll      : this.scrollData.scroll,
                            maxScroll   : this.scrollData.maxScroll,
                            height      : this.scrollData.height
                        },
                        updatedScroll   = {
                            scroll      : this.el.scrollTop,
                            maxScroll   : this.el.scrollHeight,
                            height      : this.$el.outerHeight(true)
                        };

                    _.extend(this.scrollData, updatedScroll);

                    if (this.inited && this.options.onScroll) {
                        this.options.onScroll.call(this, updatedScroll, prevScroll);
                    }

                    if (this.inited && this.options.onScrollTop && updatedScroll.scroll === 0) {
                        this.options.onScrollTop.call(this, updatedScroll, prevScroll);
                    }
                }.bind(this))
                .trigger('scroll.autoScroll');

            this.scrollTo(this.options.firstScroll, true);

            this.inited = true;
        },
        scroll      : function() {
            if (this.scrollData.maxScroll - this.scrollData.height == this.scrollData.scroll) {
                this.scrollTo(this.el.scrollHeight);
            }
        },
        scrollTo    : function(to, animateOff) {
            if (_.isNumber(to)) {
                if (to < 0) {
                    to = this.scrollData.maxScroll - this.scrollData.height;
                }

                if (!animateOff) {
                    this.$el
                        .stop()
                        .animate({
                            scrollTop   : to
                        }, this.options.scrollSpeed);
                } else {
                    this.$el
                        .stop()
                        .scrollTop(to);
                }
            } else {
                this.scrollTo($(to).offset().top - this.$el.offset().top, animateOff);
            }
        },
        scrollTopOffset : function() {

        },
        destroy     : function() {
            this.$el
                .off('.autoScroll')
                .removeData('autoScroll');
        }
    });

    $.fn.autoScroll = function(method, options) {
        var args;

        if (_.isString(method)) {
            args    = Array.prototype.slice.call(arguments, 1);
        } else {
            args    = Array.prototype.slice.call(arguments, 0);
            method  = 'init';
        }

        return this.each(function() {
            var $self   = $(this),
                autoScroll  = $self.data('autoScroll');

            if (method === 'init' && (!autoScroll || !(autoScroll instanceof AutoScroll) || !autoScroll.inited)) {
                autoScroll  = new AutoScroll($self, args[0]);
                $self.data('autoScroll', autoScroll);
            }

            if (autoScroll && autoScroll instanceof AutoScroll) {
                autoScroll[method].apply(autoScroll, args);
            }
        });
    };
})(jQuery);