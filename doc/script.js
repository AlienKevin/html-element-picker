(function ($) {
    var $window = $(window);
    var $document = $(document);

    // Scroll to menu anchor
    const menubar = document.querySelector(".menubar");
    menubar.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            // all menu anchors in menubar in position sequence (top to bottom)
            const anchors = Array.from(menubar.querySelectorAll("a"));
            const clickedAnchor = e.target;
            let activeAnchor = document.querySelector(".menubar a.active")
            if (clickedAnchor !== activeAnchor) { // clicked on a different anchor
                if (activeAnchor) {
                    let wait = 100; // initial wait period 100 ms
                    moveActiveAnchor(wait);

                    function moveActiveAnchor() {
                        activeAnchor.classList.remove("active");
                        if (activeAnchor.getBoundingClientRect().top < clickedAnchor.getBoundingClientRect().top) {
                            // clicked anchor is **below** the current active anchor
                            activeAnchor = anchors[anchors.indexOf(activeAnchor) + 1];
                        } else {
                            // clicked anchor is **above** the current active anchor
                            activeAnchor = anchors[anchors.indexOf(activeAnchor) - 1];
                        }
                        activeAnchor.classList.add("active");
                        if (activeAnchor !== clickedAnchor) {
                            if (wait > 0) {
                                wait -= 16; // decrease 16ms for wait period every time
                            }
                            setTimeout(moveActiveAnchor, wait);
                        }
                    }
                } else { // first active anchor
                    clickedAnchor.classList.add("active");
                }
            }
        }
    })

    /*
     * Anchor jump links.
     */

    $document.on('flatdoc:ready', function () {
        $('.menu a').anchorjump();
    });

    /*
     * Title card.
     */

    $(function () {
        var $card = $('.title-card');
        if (!$card.length) return;

        var $header = $('.header');
        var headerHeight = $header.length ? $header.outerHeight() : 0;

        $window
            .on('resize.title-card', function () {
                var windowWidth = $window.width();

                if (windowWidth < 480) {
                    $card.css('height', '');
                } else {
                    var height = $window.height();
                    $card.css('height', height - headerHeight);
                }
            })
            .trigger('resize.title-card');
    });

    /*
     * Sidebar stick.
     */

    $(function () {
        var $sidebar = $('.menubar');
        var elTop;

        $window
            .on('resize.sidestick', function () {
                $sidebar.removeClass('fixed');
                elTop = $sidebar.offset().top;
                $window.trigger('scroll.sidestick');
            })
            .on('scroll.sidestick', function () {
                var scrollY = $window.scrollTop();
                $sidebar.toggleClass('fixed', (scrollY >= elTop));
            })
            .trigger('resize.sidestick');
    });

})(jQuery);

/*! Anchorjump (c) 2012, Rico Sta. Cruz. MIT License.
 *   http://github.com/rstacruz/jquery-stuff/tree/master/anchorjump */

// Makes anchor jumps happen with smooth scrolling.
//
//    $("#menu a").anchorjump();
//    $("#menu a").anchorjump({ offset: -30 });
//
//    // Via delegate:
//    $("#menu").anchorjump({ for: 'a', offset: -30 });
//
// You may specify a parent. This makes it scroll down to the parent.
// Great for tabbed views.
//
//     $('#menu a').anchorjump({ parent: '.anchor' });
//
// You can jump to a given area.
//
//     $.anchorjump('#bank-deposit', options);

(function ($) {
    var defaults = {
        'speed': 500,
        'offset': 0,
        'for': null,
        'parent': null
    };

    $.fn.anchorjump = function (options) {
        options = $.extend({}, defaults, options);

        if (options['for']) {
            this.on('click', options['for'], onClick);
        } else {
            this.on('click', onClick);
        }

        function onClick(e) {
            var $a = $(e.target).closest('a');
            if (e.ctrlKey || e.metaKey || e.altKey || $a.attr('target')) return;

            e.preventDefault();
            var href = $a.attr('href');

            $.anchorjump(href, options);
        }
    };

    // Jump to a given area.
    $.anchorjump = function (href, options) {
        options = $.extend({}, defaults, options);

        var top = 0;

        if (href != '#') {
            var $area = $(href);
            // Find the parent
            if (options.parent) {
                var $parent = $area.closest(options.parent);
                if ($parent.length) {
                    $area = $parent;
                }
            }
            if (!$area.length) {
                return;
            }

            // Determine the pixel offset; use the default if not available
            var offset =
                $area.attr('data-anchor-offset') ?
                parseInt($area.attr('data-anchor-offset'), 10) :
                options.offset;

            top = Math.max(0, $area.offset().top + offset);
        }

        $('html, body').animate({
            scrollTop: top
        }, options.speed);
        $('body').trigger('anchor', href);

        // Add the location hash via pushState.
        if (window.history.pushState) {
            window.history.pushState({
                href: href
            }, "", href);
        }
    };
})(jQuery);