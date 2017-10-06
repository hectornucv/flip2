/*
 * Flip2win v.1.0.0
 *
 */
; (function ($, window, document, undefined) {
    var pluginName = "flip2win",
        defaults = {
            onCompleted: null,
            timer: null,
            width: 500,
            height: 500,
            cols: 4,
            rows: 4,
            image: 'https://unsplash.it/500/500',
        };

    var container = null;
    var tiles = null;
    var $that = null,
        timerOn = false,
        timer = null,
        clock = null;
        
	/*===================================
	=            Cunstructor            =
	===================================*/
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(element);
    }

	/*=========================================
	=            Private Functions            =
	=========================================*/
    function rotateZ(elem, pos) {
        $(elem).velocity({
            rotateZ: "+=" + (90 * pos) + "deg"
        }, {
                duration: 150,
                easing: "ease",
                complete: function () {
                    $(this).css("z-index", 0);
                }
            });
    }

	/*========================================
	=            Public Functions            =
	========================================*/
    Plugin.prototype = {


        init: function (element) {
            $that = this;
            timer = $that.settings.timer;

            /*----------  Drawing timer  ----------*/
            if (timer) {

                var min = Math.floor(timer.seconds / 60);

                var sec = timer.seconds % 60;

                // Output the result in an element with id="demo"
                $(timer.container).html(((min > 9) ? min : "0" + min) + ":" + ((sec > 9) ? sec : "0" + sec));
            } //if

            var tile_width = $that.settings.width / $that.settings.cols;
            var tile_heigth = $that.settings.height / $that.settings.rows;
            var wrap = $("<div class='wrap'></div>");
            for (var i = 0; i < $that.settings.rows; i++) {
                var row = $("<ul></ul>");
                for (var k = 0; k < $that.settings.cols; k++) {
                    var pos = Math.floor((Math.random() * 3) + 1);
                    // console.log("row: "+i+" col: "+k+" pos: "+pos);
                    var col = $("<li class='tile'></li>").data({ "col": k, "row": i, "pos": pos });
                    rotateZ(col, pos);
                    col.css("background-image", "url('" + $that.settings.image + "')");
                    col.css("width", tile_width);
                    col.css("height", tile_heigth);
                    col.css("background-position", (-tile_width * k) + "px " + (-tile_heigth * i) + "px");
                    $(col).bind('click', $that.click);
                    $(row).append(col);
                }
                wrap.append(row);
            }
            $(element).append(wrap);

            tiles = $(element).find("li");

        },
        restart: function () {
            // $.extend(true, this.settings, options);
            $($that.element).empty();
            $($that.element).css("background-image", "");
            $that.resetTimer();
            $that.init($that.element);
        },
        update: function (options) {
            $.extend(true, this.settings, options);
            $($that.element).empty();
            $($that.element).css("background-image", "");
            $that.resetTimer();
            $that.init($that.element);
        },
        timeOff: function (tiles, callback) {
            console.log("TimeOff");

            $(tiles).each(function (index, tile) {
                $(tile).unbind('click', $that.click);
            });
            if (callback) {
                callback($that.element);
            }
            // $that.reStart({image : 'https://unsplash.it/500/500?image=1'})
        },
        resetTimer: function () {
            clearInterval(clock);
            timerOn = false;
        },
        timerInit: function (container, seconds, callback) {
            var timer_content = $(container);
            // Update the count down every 1 second
            var countDown = seconds;
            clock = setInterval(function () {
                countDown--;
                // Time calculations for minutes and seconds
                var min = Math.floor(countDown / 60);
                var sec = countDown % 60;
                // Output the result in an element with id="demo"
                timer_content.html( ((min>9)?min:"0"+min) + ":" + ((sec>9)?sec:"0"+sec));
                // If the count down is over, do callback
                if (min === 0 && sec === 0) {
                    clearInterval(clock);
                    $that.timeOff(tiles, callback);

                }
            }, 1000);

        },
        click: function (ev) {
            ev.preventDefault();
            /*----------  Starting Timer  ----------*/
            if (!timerOn) {
                if (timer) {
                    $that.timerInit(timer.container, timer.seconds, timer.callback);
                }
                timerOn = true;
            }
            /*----------  Rotate tail  ----------*/

            $(this).css("z-index", 2);
            var pos = $(this).data("pos");
            pos++;
            if (pos > 3) {
                pos = 0;
            }
            $(this).data("pos", pos);
            console.log("row: " + $(this).data("row") + " col: " + $(this).data("col") + " pos: " + $(this).data("pos"));
            rotateZ(this, 1);

            if ($that.checkCompleted()) {
                log("completed");

                if ($that.settings.onCompleted) {
                    $that.settings.onCompleted($that.element);
                }
            } else {
                log("Not completed");
            }
        },

        checkCompleted: function () {
            // var tiles = $($that.element).find("li");
            var completed = true;
            $(tiles).each(function (index, tile) {
                if ($(tile).data("pos") !== 0) {
                    completed = false;
                }
            });

            if (completed) {
                $(tiles).each(function (index, tile) {
                    clearInterval(clock);
                    $(tile).unbind('click', $that.click);
                    $(tile).velocity({
                        rotateZ: '+=360deg',
                        /*rotateX: '360deg'*/
                    },
                        {
                            duration: 575,
                            easing: 'easeInQuad'
                        });
                });
                var wrap = $($that.element).find(".wrap");
                wrap.css("background-image", "url(" + $that.settings.image + ")");
            }

            return completed;

        },

    };

    $.fn[pluginName] = function (options) {
        var args = [].slice.call(arguments);
        //console.log(args);

        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
            else if (args.length === 1) {
                if ($.isFunction(Plugin.prototype[args[0]])) {
                    $.data(this, 'plugin_' + pluginName)[args[0]]();
                }
            } else if (args.length === 2) {
                if ($.isFunction(Plugin.prototype[args[0]])) {
                    $.data(this, 'plugin_' + pluginName)[args[0]](args[1]);

                }

            }
        });

        return this;
    };

})(jQuery, window, document);