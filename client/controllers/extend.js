/**
 * Created by Mykhailo_Bohdanov on 25/03/2016.
 */

(function($) {
    $.fn.autoHeight = function() {
        if (this.data('autoHeight') === 'inited') {
            this.trigger('input');
        } else {
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
                lineHeight  = 14;
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
            })
            .trigger('input')
            .data('autoHeight', 'inited');
        }

        return this;
    };
})(jQuery);