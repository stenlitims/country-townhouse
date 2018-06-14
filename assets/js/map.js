(function ($) {
    var map,
        dataMap = null;

    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(50.3616081, 30.84672),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        mapTypeControl: false,
        scaleControl: false,
        //styles: styles,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);


    var InfoBoxs = [],
        markers = [],
        data = [{
                adress: 'Country Townhouse',
                gps: '50.36143,30.84782',
                pin: 'main',
            }, {
                adress: 'магазин "Фора"',
                met: '2200 м',
                gps: '50.3753691,30.8617222',
                pin: 'shop',
                dis: '',
            }, {
                adress: 'КантриМаркет',
                gps: '50.3611436,30.8478338',
                pin: 'shop',
                dis: '150м',
            }, {
                adress: 'Остановка общественного транспорта',
                met: '450 м',
                gps: '50.3602196,30.8554459',
                pin: 'bus',
                dis: '',
            }, {
                adress: 'Международный аэропорт Борисполь',
                met: '7500 м',
                gps: '50.3358193,30.8920097',
                pin: 'plane',
                dis: '',
            }, {
                adress: 'Басейн',
                gps: '50.3607329,30.8530211',
                pin: 'pool',
            }, {
                adress: 'АЗС Formula',
                gps: '50.3774431,30.8677885',
                pin: 'zapravka',
            }, {
                adress: 'АПТЕКА "СЕЛЕНА-ФАРМ"',
                gps: '50.3730077,30.8612028',
                pin: 'apteka',
            }, {
                adress: 'Гірська середня загальноосвітня школа І-ІІІ ступенів',
                gps: '50.3745117,30.8624441',
                pin: 'school',
            }, {
                adress: 'ЗООмагазин',
                gps: '50.3760680,30.8619487',
                pin: 'zoo',
            }, {
                adress: 'новая почта отделение №9',
                met: '2200 м',
                gps: '50.3754235,30.8614921',
                pin: 'post',
            }, {
                adress: 'Конный клуб "Магнат"',
                met: '5900 м',
                gps: '50.3839392,30.8320751',
                //   pin: 'zoo',
            }, {
                adress: 'Страусина ферма "Чубинський страус"',
                met: '5700 м',
                gps: '50.3872646,30.8284538',
                //  pin: 'zoo',
            }, {
                adress: 'Гипермаркет FOZZY',
                met: '9300 м',
                gps: '50.389575,30.7984281',
                pin: 'shop',
            }, {
                adress: 'АЗК ОККО',
                gps: '50.387945,30.7812981',
                pin: 'zapravka',
            }, {
                adress: 'Socar',
                gps: '50.380707,30.8316869',
                pin: 'zapravka',
            }, {
                adress: 'Загородная резиденция Kidev',
                met: '4500 м',
                gps: '50.3809593,30.8434018',
                pin: 'hotel',
            }, {
                adress: 'Гипермаркет "Новая Линия"',
                met: '5900 м',
                gps: '50.370205,30.91001',
                //   pin: 'shop',
            }, {
                adress: 'Школа',
                gps: '50.3671585,30.929381',
                pin: 'school',
            }, {
                adress: 'Щасливський навчально-виховний комплекс',
                gps: '50.3793462,30.7966357',
                pin: 'school',
            }, {
                adress: 'Дитячий навчальний заклад "Сонячні промінчики"',
                gps: '50.3747665,30.8734748',
                pin: 'child',
            }, {
                adress: 'ЛЕС',
                gps: '50.3615063,30.8418202',
                pin: 'forest',
            }, {
                adress: 'Ж/Д станция Чубинское',
                met: '4900 м',
                gps: '50.3910922,30.8564544',
                pin: 'bus',
            }, {
                adress: 'детский сад "Новый Я"',
                met: '750 м',
                gps: '50.3650379,30.8525115',
                pin: 'child',
            }


        ];


    if ($('.adr-list').length > 0) {
        var adrs = '';
        $.each(data, function (index) {
            var pin = this['pin'] ? this['pin'] : 'star';
            adrs += '<a href="#" data-id="' + index + '" class="ic-'+this['pin']+'"><div class="ico"><svg><use xlink:href="#icon-' + pin + '"></use></svg></div><div>' + this['adress'] + '</div></a>';
        });
        $('.adr-list').html(adrs);
    }

    $(document).on(eventClick, '.adr-list a', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        $('.adr-list a').removeClass('active');
        $(this).addClass('active');
        markers.forEach(function (item, i) {
            InfoBoxs[i].close();
        });
        InfoBoxs[id].open(map, markers[id]);
    });


    //   $.getJSON('ajax?action=getLoc', function (d) {




    $.each(data, function (index) {
        var cord = this.gps.split(',');
        var pin = 'assets/images/icons/star.png',
            zIndex = 0;

        var pixelOffset = new google.maps.Size(0, -40);

        if (this.pin == 'main') {
            pixelOffset = new google.maps.Size(0, -85);
            zIndex = 2;
        }

        if (this.pin) pin = 'assets/images/icons/' + this.pin + '.png';


        markers[index] = new google.maps.Marker({
            position: {
                lat: +cord[0],
                lng: +cord[1]
            },
            map: map,
            title: this['adress'],
            MIGX_id: index,
            icon: {
                url: pin,
            },
            zIndex: zIndex
        });


        InfoBoxs[index] = new InfoBox({
            content: '<div class="infobox-wrapper"><div class="title">' + this.adress + '</div></div>',
            alignBottom: true,
            pixelOffset: pixelOffset,
            pane: "floatPane",
            zIndex: 999,
        });

        /*
        google.maps.event.addListener(markers[index], 'click', function (i) {
            markers.forEach(function (item, i) {
                InfoBoxs[i].close();
            });
            InfoBoxs[index].open(map, markers[index]);
        });
        */


        google.maps.event.addListener(markers[index], 'mouseover', function (i) {
            InfoBoxs[index].open(map, markers[index]);

        });

        google.maps.event.addListener(markers[index], 'mouseout', function (i) {
            InfoBoxs[index].close(map, markers[index]);
        });


    });









    //  });


})(jQuery);