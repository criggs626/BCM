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

$.get("/getDiscussionStatus",function(data){
  if(data){
    $("#discussionMessage").text("Click below to receive your group number and questions");
    $("#discussionButton").removeClass("disabled");
    $("#discussionButton").attr("onclick","discussionButton()");
  }
});

function discussionButton(){
  $.get("/joinDiscussionGroup",function(data){
    var display="<div class=\"row\"><div class=\"col-md-12 contentAuto\"><h1>Group #"+(data.groupNumber+1)+"</h1><hr><h3>"+data.groups[parseInt(data.groupNumber)]+"</h3></div></div>";
    for(i=0;i<data.questions.length;i++){
      display+="<div class=\"row\"><div class=\"col-md-12 contentAuto\"><h2>Question #"+(i+1)+"</h2><hr>"+data.questions[i]+"</div></div>";
    }
    $("#discussionGroups").html(display);
    updateFooter();
  });
};

$.get("/getMembers",function(data){
  $("#directorName").text(data.director.name);
  $("#directorContact").text(data.director.email);
  $("#directorContact").attr("href","mailto:"+data.director.email);

  $("#presidentName").text(data.president.name);
  $("#presidentContact").text(data.president.email);
  $("#presidentContact").attr("href","mailto:"+data.president.email);

  $("#vpName").text(data.vp.name);
  $("#vpContact").text(data.vp.email);
  $("#vpContact").attr("href","mailto:"+data.vp.email);

  $("#secrataryName").text(data.secratary.name);
  $("#secrataryContact").text(data.secratary.email);
  $("#secrataryContact").attr("href","mailto:"+data.secratary.email);

  $("#treasurerName").text(data.treasurer.name);
  $("#treasurerContact").text(data.treasurer.email);
  $("#treasurerContact").attr("href","mailto:"+data.treasurer.email);
});

$.get("/getInfo",function(data){
  $("#aboutUs").text(data.about);
  $("#undergroundTime").text(data.undergroundTime);
  var display="";
  for(i=0;i<data.smallGroups.length;i++){
    display+="<li>"+data.smallGroups[i]+"</li>"
  }
  $("#smallGroups").html(display);
});

function updateFooter(){
  if($("body").height()<$(window).height()-20){
    $(".custFoot").attr("style","position:fixed;");
  }
  else{
    $(".custFoot").attr("style","position:static;");
  }
}

$(window).resize(function() {
  updateFooter();
});

var routes = Backbone.Router.extend({
    routes: {
        "contact": "contact",
        "webmaster": "webmaster",
        "discussion":"discussion",
        '': 'home'
    },
    contact: function () {
        $('#main').hide();
        $('#webMaster').hide();
        $('#contact').show();
        $('#discussionGroups').hide();
        updateFooter();
    },
    webmaster: function () {
        $('#main').hide();
        $('#contact').hide();
        $('#webMaster').show();
        $('#discussionGroups').hide();
        updateFooter();
    },
    discussion: function () {
        $('#main').hide();
        $('#contact').hide();
        $('#webMaster').hide();
        $('#discussionGroups').show();
        updateFooter();
    },
    home: function (data) {
        $('#main').show();
        $('#contact').hide();
        $('#webMaster').hide();
        $('#discussionGroups').hide();
        updateFooter();
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
