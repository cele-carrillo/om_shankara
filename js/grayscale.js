---
---

// jQuery to keep track of the current section when switching languages
$("ul.nav").on('activate.bs.scrollspy', function () {
   var hash = $(this).find("li.active a").attr("href");

   $("a.lang-choice").each(function() {
      var base = this.href.split("#")[0];
      if (base != null && hash != null){
        this.href = base.concat(hash);
      }
    });
});

// jQuery to open promotion modal
$(document).ready(function () {
    var cookieName = "promo-shown";
    
    if (getCookie(cookieName) === "") {
       $('[data-remodal-id=modal-promo]').remodal().open();
       setCookie(cookieName, "true", 3600);
    }
});

function setCookie(cname, cvalue, seconds) {
    var date = new Date();
    date.setTime(date.getTime() + (seconds*1000));
    var expires = "expires="+ date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookies = decodedCookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// jQuery to process the form
$(document).ready(function() {
    $('#form-contact').submit(function(event) {
        $form = $(this);
        var name = $('input[name=name]');
        var email = $('input[name=_replyto]');
        var question = $('textarea[name=question]');

        event.preventDefault();

        if (! validateForm(name, email, question)){
            return;
        }

        var formData = {
            'name'         : name.val(),
            'email'        : email.val(),
            'question'     : question.val(),
            '_gotcha'      : $('input[name=_gotcha]').val(),
            '_subject'     : $('input[name=_subject]').val()
        };

        $.ajax({
            type        : 'POST',
            url         : $form.attr('action'),
            data        : formData,
            dataType    : 'json',
            encode      : true
        })
            .done(function(data) {
                var inst = $('[data-remodal-id=modal-success]').remodal();
                inst.open();
                name.val("");
                email.val("");
                question.val("");
            })
            .fail(function() {
                var inst = $('[data-remodal-id=modal-fail]').remodal();
                inst.open();
            });
        event.preventDefault();
    });
});

function validateForm(name, email, question){
    var valid = true;
    var invalidClass = 'invalid-field';

    if (isEmpty(name.val())) {
        valid = false;
        name.addClass(invalidClass);
    }
    else{
        name.removeClass(invalidClass);
    }

    if (!validateEmail(email.val())){
        valid = false;
        email.addClass(invalidClass);
    }
    else{
        email.removeClass(invalidClass);
    }

    if (isEmpty(question.val())) {
        valid = false;
        question.addClass(invalidClass);
    }
    else{
        question.removeClass(invalidClass);
    }
    return valid;
}

function isEmpty(str){
    var re = /^\s*$/;
    return re.test(str);
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Google Maps Scripts
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: {{ site.map.zoom }},

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng({{ site.map.center_lat }}, {{ site.map.center_lng }}),

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image = '/img/map-marker.png';
    {% for marker in site.map.markers %}
    new google.maps.Marker({
        position: new google.maps.LatLng({{ marker.lat }}, {{ marker.lng }}),
        map: map,
        icon: image
    });
    {% endfor %}
}
