/**
    Lighweight Concertina Plugin
    ============================

    <ul class="concertina">
        <li>
            <h2>header</h2>
            <div>content</div>
        </li>
        <li>
            <h2>header</h2>
            <div>content</div>
        </li>
        <li>
            <h2>header</h2>
            <div>content</div>
        </li>
    </ul>
    $('.concertina').concertina();

*/
/*jslint browser: true, vars: true, white: true, forin: true, nomen: true */
/*global define,require */
(function($) {
    'use strict';

    var DEFAULT_SETTINGS = {
            itemClass: 'concertina-item',
            headerClass: 'concertina-header',
            headerSelector: '>li>h2',
            contentClass: 'concertina-content',
            selectedClass: 'concertina-on',
            excludeSelector: 'a,input',
            speed: 200
        },

        WRAPPER_CLASS = 'concertina',
        DATA_KEY = 'concertina.settings'
    ;

    var openItem = function($item, $content, settings) {
        $content.slideDown(settings.speed);
        $item.addClass(settings.selectedClass);
        $item.trigger('concertina-openItem', [$item, $content, settings]);
    };
    var closeItem = function($item, $content, settings) {
        $content.slideUp(settings.speed);
        $item.removeClass(settings.selectedClass);
        $item.trigger('concertina-closeItem', [$item, $content, settings]);
    };
    var toggleItem = function($item, $content, settings) {
        if ($item.hasClass(settings.selectedClass)) {
            closeItem($item, $content, settings);
        } else {
            openItem($item, $content, settings);
        }
    };
    var checkHash = function(settings) {
        if (location.hash) {
            var $hashSelected = $(location.hash);
            if ($hashSelected.hasClass(settings.itemClass)) {
                openItem($hashSelected, $hashSelected.find('>.' + settings.contentClass), settings);
            }
        }
    };

    $.fn.concertina = function(options) {
        var settings,
            $content;
        if (typeof (options) === "string") {
            settings = this.closest('.' + WRAPPER_CLASS).data(DATA_KEY);
            if (options === "expandAll") {
                this.find(">." + settings.itemClass)
                    .removeClass(settings.selectedClass)
                    .addClass(settings.selectedClass)
                    .find(">." + settings.contentClass).show();
            }
            if (options === "closeAll") {
                this.find(">." + settings.itemClass)
                    .removeClass(settings.selectedClass)
                    .find(">." + settings.contentClass).hide();
            }
            if (options === "openItem") {
                if (this.hasClass(settings.itemClass)) {
                    $content = this.find('.' + settings.contentClass);
                    openItem(this, $content, settings);
                }
            }
            if (options === "closeItem") {
                if (this.hasClass(settings.itemClass)) {
                    $content = this.find('.' + settings.contentClass);
                    closeItem(this, $content, settings);
                }
            }
        } else {
            return this.each(function(){
                var $concertina = $(this),
                    settings = $.extend({}, DEFAULT_SETTINGS, options)
                ;

                $concertina.addClass(WRAPPER_CLASS)
                .data(DATA_KEY, settings)
                .find(settings.headerSelector)
                .attr('tabindex', '0')
                .each(function() {
                    var $this = $(this),
                    $item = $this.parent().addClass(settings.itemClass),
                    itemId = $item[0].id,
                    header = $this.addClass(settings.headerClass),
                    $content = $this.next().addClass(settings.contentClass);

                    if (!$item.hasClass(settings.selectedClass)) {
                        $content.hide();
                    }
                    header.click(function(e) {
                        if (!$(e.target).closest(settings.excludeSelector).length) {
                            toggleItem($item, $content, settings);
                            e.preventDefault();
                        }
                    })
                    .keyup(function(e){
                        if ((e.keyCode === 13 || e.keyCode === 32)
                            && !$(e.target).closest(settings.excludeSelector).length) {
                                toggleItem($item, $content, settings);
                                e.preventDefault();
                            }
                    });
                });
                checkHash(settings);
            });
        }
    };
    
}(window.jQuery));


