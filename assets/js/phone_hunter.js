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