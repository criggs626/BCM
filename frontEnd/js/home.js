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
  $("#directorName").val(data.director.name);
  $("#directorEmail").val(data.director.email);

  $("#presidentName").val(data.president.name);
  $("#presidentEmail").val(data.president.email);

  $("#vpName").val(data.vp.name);
  $("#vpEmail").val(data.vp.email);

  $("#secrataryName").val(data.secratary.name);
  $("#secrataryEmail").val(data.secratary.email);

  $("#treasurerName").val(data.treasurer.name);
  $("#treasurerEmail").val(data.treasurer.email);
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
