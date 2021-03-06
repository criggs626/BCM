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

$.get("/getInfo",function(data){
  $("#aboutText").text(data.about);
  $("#undergroundTime").val(data.undergroundTime);
  var display="";
  for(i=0;i<data.smallGroups.length;i++){
    display+="<tr><td><input type=\"textbox\" class=\"form-control\" value=\""+data.smallGroups[i]+"\"></td><td><button class=\"btn btn-danger\">X</button></td></tr>";
  }
  $("#smallGroups").html(display);
});

function addOption(tableID,name){
  if(name=="questionText"){
    $(tableID).append("<tr><td><textarea class=\"form-control "+name+"\" placeholder=\"Enter question Here\"></textarea></td><td><button class=\"btn btn-danger\">X</button></td></tr>")
  }
  else{
    $(tableID).append("<tr><td><input type=\"text\" class=\"form-control "+name+"\" placeholder=\"Enter leader name Here\"></td><td><button class=\"btn btn-danger\">X</button></td></tr>")
  }
}

function startDiscussions(){
  var temp={};
  var questions=[];
  var groups=[];
  $(".questionText").each(function(){
    if($(this).val()!=""){
      questions.push($(this).val());
    }
  });
  $(".groupText").each(function(){
    if($(this).val()!=""){
      groups.push($(this).val());
    }
  });
  temp["questions"]=questions;
  temp["groups"]=groups;
  temp["number"]=groups.length;
  temp["current"]=true;
  console.log(temp);
  $.post("/startDiscussions",{"values":temp},function(data){
    alert(data);
  });
}

$('table').on('click', 'button', function(e){
   $(this).closest('tr').remove()
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
