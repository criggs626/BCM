var routes = Backbone.Router.extend({
    routes: {
        "images": "header",
        "leadership": "leadership",
        "questions": "questions",
        '': 'home'
    },
    header: function () {
        $('#main').hide();
        $('#header').show();
        $('#leadership').hide();
        $('#questions').hide();
    },
    leadership: function () {
        $('#main').hide();
        $('#header').hide();
        $('#questions').hide();
        $('#leadership').show();
    },
    questions: function () {
        $('#main').hide();
        $('#header').hide();
        $('#questions').show();
        $('#leadership').hide();
    },
    home: function (data) {
        $('#main').show();
        $('#header').hide();
        $('#questions').hide();
        $('#leadership').hide();
    }
});
var appRoutes = new routes();
Backbone.history.start();
