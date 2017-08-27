setInterval(changeImage, 4000);
var imageNumber = 1;
var images = ["url('img/header1.jpg')", "url('img/header2.jpg')", "url('img/header3.jpg')", "url('img/header4.jpg')", "url('img/header5.jpg')"];
function changeImage() {
    if (imageNumber > 4) {
        imageNumber = 0;
    }
    $('#header').css('background-image', images[imageNumber]);
    imageNumber++;
}
$(window).resize(function () {
    if ($(document).width() < 440) {
        $('#facebook').width(200);
    } else {
        $('#facebook').width(340);
    }
});

var routes = Backbone.Router.extend({
    routes: {
        "contact": "contact",
        "webmaster": "webmaster",
        '': 'home'
    },
    contact: function () {
        $('#main').hide();
        $('#webMaster').hide();
        $('#contact').show();
    },
    webmaster: function () {
        $('#main').hide();
        $('#contact').hide();
        $('#webMaster').show();
    },
    home: function (data) {
        $('#main').show();
        $('#contact').hide();
        $('#webMaster').hide();
    }
});
var appRoutes = new routes();
Backbone.history.start();

$("#slogan").on("click", function () {
    $("#slogan").html("Basically the only Bible study on campus");
    setTimeout(revert, 5000);

});

function revert() {
    $("#slogan").html("A community with a purpose");
}
