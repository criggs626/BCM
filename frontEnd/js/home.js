$("form").submit(function(e){
  var form = $(this);
  var formData = new FormData(form[0]);
  $.ajax({
    url   : form.attr('action'),
    type  : form.attr('method'),
    processData: false,
    contentType: false,
    data  :formData, // data to be submitted
    success: function(data){
      location.reload();
    },
    error: function(data){
      alert("Unknown error occured");
    }
  });
  return false;
});

$.get("/getMembers",function(data){
  $("#directorName").attr("placeholder",data.director.name);
  $("#directorEmail").attr("placeholder",data.director.email);

  $("#presidentName").attr("placeholder",data.president.name);
  $("#presidentEmail").attr("placeholder",data.president.email);

  $("#vpName").attr("placeholder",data.vp.name);
  $("#vpEmail").attr("placeholder",data.vp.email);

  $("#secrataryName").attr("placeholder",data.secratary.name);
  $("#secrataryEmail").attr("placeholder",data.secratary.email);

  $("#treasurerName").attr("placeholder",data.treasurer.name);
  $("#treasurerEmail").attr("placeholder",data.treasurer.email);
});

var routes = Backbone.Router.extend({
    routes: {
        "images": "header",
        "leaders": "leadership",
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
