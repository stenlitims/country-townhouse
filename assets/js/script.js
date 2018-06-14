$('body').addClass('loaded');



var wow = new WOW({
    //	boxClass: 'wow', // default
    //	animateClass: 'animated', // default
    //	offset: 0, // default
    mobile: false, // default
    //live: false // default
    //	callback: function (box) {
    //	}
});
wow.init();


setTimeout(function () {
    $('body').addClass('loaded');
}, 4000);


var LoadedMap = false;

function loadMap() {
    if (LoadedMap) return;
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAmWmdKbeYcWqCZrLJSoMV6ygZgELvWxmE", function () {
        $.getScript("assets/js/infobox.js", function () {
            $.getScript("assets/js/map.js");
            LoadedMap = true;
        });
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


if ($('.js-map').length > 0) loadMap();


var plModal = '';
if ($('#plModal').length > 0) {
    var plModal = $('#plModal').html();
}
var fancyModal = {
    animationDuration: 350,
    animationEffect: 'fade',
    slideClass: "a-modal",
    buttons: [
        // "zoom",
        "share",
        //"slideShow",
        //"fullScreen",
        "download",
        // "thumbs",
        "close"
    ],
    afterShow: function (e) {

        if ($(window).width() < 1200) {
            var $par = $(e.current.$slide[0]).closest('.fancybox-inner');
            if ($par.find('.wr-form').length > 0) return;
            $par.append(plModal);
        } else {
            if ($(e.current.$content[0]).find('.wr-form').length > 0) return;
            $(e.current.$content[0]).append(plModal);
        }
        $('.wr-form input[name=phone]').mask('+38(000) 000 00 00');
    }
};


var loFn = false;

function loadFancy() {
    if (loFn) return;
    loFn = true;
    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.css'));
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.js", function () {

        $('.apartments-list a').fancybox(fancyModal);



        if ($(window).width() > 1200) {
            $(document).on(eventClick, '.btn-sh .btn-def', function (e) {
                $(this).parent().next().addClass('active');
            });

            $(document).on(eventClick, '.wr-form .link-close', function (e) {
                $('.wr-form').removeClass('active');
            });
        } else {
            $(document).on(eventClick, '.btn-sh .btn-def', function (e) {
                $.fancybox.open({
                    src: '#plModal .wr-form',
                    type: 'inline',
                    slideClass: "c-modal",
                });
            });
        }

        $(document).on(eventClick, '.js-th', function () {
            fancyModal.baseClass = "pl-thumbs";
            fancyModal.thumbs = {
                autoStart: true
            };
            $.fancybox.open(plans[$(this).data('id')], fancyModal);
        });


        var user = getCookie("user1");

        if (user == "" || user == null) {
            setCookie("user1", '123', 30);
            if ($('.modal-count').length > 0) {
                $.fancybox.open({
                    src: '.modal-count',
                    type: 'inline',
                });

                var $countdown = $('.countdown'),
                    data = $countdown.data(),
                    date = new Date(data.y, data.m - 1, data.d, data.h, 0, 0, 0);
                $countdown.countdown({
                    until: date
                });

            }

        }







    });
}



var g = {
    getOs: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        return "unknown";
    }
}

var os = g.getOs(),
    eventClick = os == 'iOS' ? 'touchstart' : 'click';


(function () {
    var form = {
        url: 'ajax',
        load: function (tpl, id) {
            var data = {
                data: tpl,
                action: 'loadForm'
            };

            if (id) data.id = id;

            $.ajax({
                url: this.url,
                type: "POST",
                data: data,
                success: function (data) {
                    $('#modal-content .modal-body').html(data);
                    $('#modal-content').modal('show');
                }
            });
        },
        valid: function (par) {
            var valid = true,
                name = '',
                patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $(par).find("input.required, textarea.required").each(function (i, e) {
                $(e).removeClass("in-error");
                name = $(e).attr('name');
                if (name == 'email' && !patternEmail.test($(e).val())) {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
                if ($(e).val() == "") {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
            });
            return valid;
        },

        send: function (that) {
            var formData = new FormData($(that).get(0));
            $(that).addClass('loder');
            var action = $(that).data('action');
            if (action) formData.append('action', action);
            formData.append('pagetitle', $('title').text());
            formData.append('link', location.href);
            $.ajax({
                url: this.url,
                type: "POST",
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                    txt = '<div class="alert alert-' + data.type + '">' + data.text + '</div>';
                    $(that).find('.btns').before(txt);
                    if (data.type == 'success') {
                        $(that).find('input[type=text], input[type=email]').val('');
                        $(that).find('textarea').val('');
                    }
                    $(that).removeClass('loder');
                    var time = 5000;
                    if (data.url) time = 3000;

                    setTimeout(function () {
                        $.fancybox.close();
                        if (data.url) {
                            location.href = data.url;
                        }
                        $('.alert').remove();
                        $('.js-in').removeClass('comp');
                    }, time);
                }
            });

        }
    }


    if ($('a[data-fancybox]').length > 0) {
        loadFancy();
    }

    // copy nav
    $('body').append('<div class="mob-nav"><div class="close-modal hidden-lg"></div><div class="main-nav">' + $('.main-nav').html() + '</div></div>');


    // mob mav
    $(document).on(eventClick, '.js-open-nav', function () {
        $('.mob-nav').addClass('active');
        $('body').append('<div class="mask-site"></div>');
        setTimeout(function () {
            $('body').addClass('o-hide');
        }, 10);
    });

    $(document).on(eventClick, '.mask-site, .close-modal', function () {
        $('.mob-nav').removeClass('active');
        $('.mask-site').remove();
        setTimeout(function () {
            $('body').removeClass('o-hide');
        }, 100);

    });





    if ($('.wrap-genplan').length > 0) {
        loadFancy();
    }


    $(document).on('submit', '.js-form', function (e) {
        e.preventDefault();
        if (form.valid(this)) {
            form.send(this);
        }
    });

    $(document).on('click', '.js-form-call', function (e) {
        form.load('form-call');
    });


    if ($('a[href="#"]').length > 0) {
        $(document).on('click', 'a[href="#"]', function (e) {
            e.preventDefault();
        })
    }

    $('.main-slider').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        dots: false,
        items: 1,
        center: true,
        //  autoplay: true,
        smartSpeed: 900,
        autoplaySpeed: 900,
        autoplayTimeout: 6000,
        navText: ['', ''],
        responsiveClass: true,
    });

    $(document).on('blur', '.js-in .form-control', function () {
        if ($(this).val() != '') {
            $(this).closest('.js-in').addClass('comp');
        } else {
            $(this).closest('.js-in').removeClass('comp');
        }
    });

    $('input[name=phone]').mask('+38(000) 000 00 00');

    $(document).on('click', '.show-all-sp', function () {
        $(this).hide();
        $('.js-all').slideDown(300);
    });


    $(document).on(eventClick, '.list-city a', function (e) {
        e.preventDefault();
        var $par = $(this).closest('.list-city');
        $par.find('a').removeClass('active');
        $(this).addClass('active');
    });


    // scroll header
    $('.js-scroll').on(eventClick, function (e) {
        e.preventDefault();
        $('body').scrollTo($(this).attr('href'), 500, {
            offset: -$('.line1').outerHeight()
        });
    });



    if ($(window).width() > 1200 && $('.main-nav').length > 0) {
        $('.main-nav').prepend('<div class="sh"></div>');
        $('.main-nav > ul > li > a').hover(function () {
            $('.main-nav .sh').css({
                left: $(this).offset().left + 'px',

                width: $(this).outerWidth(),
                height: $(this).outerHeight()
            });
        });
    }

    if ($('.hot-st').length > 0) {
        loadFancy();

        $(document).on(eventClick, '.hot-st .item > a', function (e) {
            e.preventDefault();
            var data = [];

            $(this).closest('.item').find('.items a').each(function (i) {
                data.push({
                    src: $(this).attr('href'),
                    opts: {
                        caption: $(this).attr('title'),
                        thumb: $(this).data('t')
                    }
                });
            });

            //  console.log(data);

            $.fancybox.open(data, {
                idleTime: false,
                baseClass: 'fancybox-custom-layout',
                margin: 0,
                infobar: false,
                thumbs: {
                    hideOnClose: false
                },
                touch: {
                    vertical: 'auto'
                },
                buttons: [
                    'close',
                    'thumbs',
                    'slideShow',
                ],
                animationEffect: "fade",
                closeClickOutside: false,
            });
        });

    }


    if ($('.help-swipe').length > 0) {
        $('.help-swipe').addClass('load');
    }


})();











//phone_hunter
$(function () {

    // This timeout, started on mousedown, triggers the beginning of a hold
    var holdStarter = null;

    // This is how many milliseconds to wait before recognizing a hold
    var holdDelay = 200;

    // This flag indicates the user is currently holding the mouse down
    var holdActive = false;

    $('.phone-hunter-phone').mouseover(function () {
        $(this).addClass('phone-hunter-hover').addClass('phone-hunter-active').removeClass('phone-hunter-static');
    }).mouseleave(function () {
        $(this).removeClass('phone-hunter-hover').addClass('phone-hunter-static').removeClass('phone-hunter-active');
    });


    // MouseDown
    $('.target').mousedown(onMouseDown);

    function onMouseDown() {
        // Do not take any immediate action - just set the holdStarter
        //  to wait for the predetermined delay, and then begin a hold
        holdStarter = setTimeout(function () {
            holdStarter = null;
            holdActive = true;
            // begin hold-only operation here, if desired
        }, holdDelay);
    }

    // MouseUp
    function onMouseUp() {
        // If the mouse is released immediately (i.e., a click), before the
        //  holdStarter runs, then cancel the holdStarter and do the click
        if (holdStarter) {
            clearTimeout(holdStarter);
            $('.callback_phone_link').trigger('click'); // run click-only operation here
        }
        // Otherwise, if the mouse was being held, end the hold
        else if (holdActive) {
            holdActive = false;
            // end hold-only operation here, if desired
        }
    }
    var phone_click = true;
    $('#phone_hunter').mousedown(function () {
        onMouseDown();
        $(this).addClass('draggable').parents().on('mousemove', function (e) {

            $('.draggable').offset({
                top: e.pageY - $('.draggable').outerHeight() / 2,
                left: e.pageX - $('.draggable').outerWidth() / 2
            }).on('mouseup', function () {
                $(this).removeClass('draggable');

            });
        });

    }).mouseup(function () {
        $('.draggable').removeClass('draggable');
        onMouseUp();

    });

    function make_ring_imitation() {
        if ($('#phone_hunter').hasClass('phone-hunter-static')) {
            $('#phone_hunter').toggleClass('phone-hunter-static').toggleClass('phone-hunter-active');
            setTimeout(function () {
                $('#phone_hunter').toggleClass('phone-hunter-static').toggleClass('phone-hunter-active');
            }, 2600);
        }

    }
    make_ring_imitation();
    setInterval(make_ring_imitation, 12000);

});