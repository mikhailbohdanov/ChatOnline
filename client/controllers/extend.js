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
        this.$el    = $el;
        this.el     = $el[0];
        this.conf   = _.extend({}, AutoScroll.defaults, options);

        this.scrollEvent    = function(e) {
            e.preventDefault();

            var prevent = {
                    scroll      : this._scroll.scroll,
                    scrollHeight: this._scroll.scrollHeight,
                    height      : this._scroll.height
                },
                changed = {
                    scroll      : this.el.scrollTop,
                    scrollHeight: this.el.scrollHeight,
                    height      : this.$el.outerHeight(true)
                };

            _.extend(this._scroll, changed);

            this._scroll.userScroll = this.inited ? changed.scroll + changed.height === changed.scrollHeight : false;

            if (this.inited && this.conf.onScroll) {
                this.conf.onScroll.call(this, changed, prevent);
            }

            if (this.inited && this.conf.onScrollTop && !changed.scroll) {
                this.conf.onScrollTop.call(this, changed, prevent);
            }
        }.bind(this);
    }
    _.extend(AutoScroll, {
        defaults    : {
            onScroll    : null,
            onScrollTop : null,
            startFrom   : -1,
            scrollSpeed : 200
        }
    });
    _.extend(AutoScroll.prototype, {
        init        : function() {
            this._scroll = {
                userScroll  : this.conf.startFrom >= 0,
                scroll      : this.el.scrollTop,
                scrollHeight: this.el.scrollHeight,
                height      : this.$el.outerHeight(true)
            };

            this.$el
                .on('scroll.autoScroll', this.scrollEvent)
                .trigger('scroll');

            this.inited = true;
        },
        scroll      : function() {
            this._scroll.scrollHeight = this.el.scrollHeight;

            if (!this._scroll.userScroll) {
                this.scrollTo(-1);
            }
        },
        scrollTo    : function(to, animateOff) {
            if (_.isNumber(to)) {
                if (to < 0) {
                    to  = this._scroll.scrollHeight - this._scroll.height;
                }

                if (!animateOff) {
                    this.$el
                        .stop()
                        .animate({
                            scrollTop   : to
                        }, this.conf.scrollSpeed);
                } else {
                    this.$el
                        .stop()
                        .scrollTop(to);
                }
            } else {
                this.scrollTo($(to).offset().top - this.$el.offset().top, animateOff);
            }
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

            if (method === 'init' && (!autoScroll || !(autoScroll instanceof AutoScroll))) {
                autoScroll  = new AutoScroll($self, args[0]);
                $self.data('autoScroll', autoScroll);
            }

            if (autoScroll && autoScroll instanceof AutoScroll && autoScroll[method]) {
                autoScroll[method].apply(autoScroll, args);
            }
        });
    };
})(jQuery);