/* This file manages the front end and rest requests along with any post request
to update the database.
Created By: Caleb Riggs
*/

const DEBUG = true;
var fs = require('fs');
var multer=require('multer');
var globVar={groups:0,students:0,date:"",active:false};
//establish the frontEnd director structure

const ROOT_DIR = "../frontEnd/";
module.exports = function (app, passport, express, MongoClient,url,mongo,md5) {
    //pull additional dependency
    var path = require('path');
    //set root directory for front end elements
    app.use(express.static(ROOT_DIR));

    app.use('/admin', function(req, res) {
      send(res, "login.html");
    });

    app.use('/home', isLoggedIn,function(req, res) {
      send(res, "home.html");
    });

    app.get('/getDiscussionStatus',function(req, res) {
      res.send(globVar.active);
    });

    app.post('/joinDiscussionGroup',function(req, res) {
      MongoClient.connect(url,function(err,db){
          var attend=db.collection("attendance");
          attend.find({"date":globVar.date}).toArray(function(err,item){
            var attendees=item[0];
            db.close();
            if(err){
              console.err(err);
              res.send("error: Gonna be honest... not sure why. Have you tried turning it off and on again?");
            }
            var found=false;
            for(var i=0;i<item[0].attendees.length;i++){
              if(req.body.id==item[0].attendees[i].id){
                found=true;
                break;
              }
            }
            if (found) {
              MongoClient.connect(url,function(err,db){
                var discussion=db.collection("discussion");
                discussion.find({"current":"true"}).toArray(function(err,item){
                  if(err){
                       console.error(err);
                       res.send("error: Gonna be honest... not sure why. Have you tried turning it off and on again?");
                  }
                  db.close();
                  var temp=item[0];
                  delete temp._id;
                  temp["groupNumber"]=attendees.attendees[i].groupNumber;
                  res.json(temp);
                });
              });
            }
            else{
              var groupNumber=(globVar.students%globVar.groups);
              globVar.students+=1;
              MongoClient.connect(url,function(err,db){
              var attendance = db.collection("attendance");
              attendance.update({"date":globVar.date},{$push:{"attendees":{$each:[{"id":req.body.id,"groupNumber":groupNumber}]}}},function(err,result){
                if(err) {
                console.error(err);
                db.close()
                res.send("error: Gonna be honest... not sure why. Have you tried turning it off and on again?")
                }
                else{
                  var discussion=db.collection("discussion");
                  discussion.find({"current":"true"}).toArray(function(err,item){
                    if(err){
                    console.err(err);
                    res.send("error: Gonna be honest... not sure why. Have you tried turning it off and on again?");
                    }
                    db.close();
                    var temp=item[0];
                    delete temp._id;
                    temp["groupNumber"]=groupNumber;
                    res.json(temp);
                  });
                }
              });
            });
          }
        });
      });
    });

    app.post('/updatePicture',multer({ dest: './uploads/'}).single('upl'), isLoggedIn,function(req, res) {
      var validIn="header1.jpg,header2.jpg,header3.jpg,header4.jpg,header5.jpg,group.jpg,ist.jpg,logo.png";
      if(validIn.includes(req.body.picID)){
        fs.rename(req.file.path, "../frontEnd/img/"+req.body.picID, function (err) {
          if (err){
            console.error(err);
            res.send("error: issue uploading file");
          }
          res.send('Success: New Image Uploaded');
        });
      }
      else{
        console.error("Invalid Input");
        res.send("error: invalid input");
      }
    });

    app.post('/startDiscussions', isLoggedIn,function(req, res) {
      globVar.groups=req.body.values.number;
      globVar.students=0;
      globVar.active=true;
      date = new Date();
      globVar.date=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
      MongoClient.connect(url,function(err,db){
        var attendance=db.collection("attendance");
        attendance.insert({"date":globVar.date,"attendees":[]})
        var discussion=db.collection("discussion");
        discussion.update({"current":"true" },{$set:{"current":"false"}}, function (err, item) {
          console.log("Begin updating dsicussion info");
          discussion.insertOne(req.body.values,function(err,result){
            if(err){
              console.error(err);
              db.close();
              res.send("error");
            }
            else{
              db.close();
              setTimeout(function(){globVar.active=false;},((1000*60))*120)
              res.send("success");
            }
          });
        });
      });
    });

    app.post('/updateLeader',multer({ dest: './uploads/'}).single('upl'), isLoggedIn,function(req, res) {
      try{
        newFile=req.file.path;
        fs.rename(newFile, "../frontEnd/img/"+req.body.person+".jpg", function (err) {
          if (err){
            console.error(err);
          }
          var temp={};
          temp[req.body.person]={};
          if(req.body.name!=""){
            temp[req.body.person]["name"]=req.body.name;
          }
          if(req.body.email!=""){
            temp[req.body.person]["email"]=req.body.email;
          }
          MongoClient.connect(url,function(err,db){
            var collection=db.collection("board");
            //Update user with new information
            collection.update({"status":"current" },{$set:temp}, function (err, item) {
              console.log("Updated user info");
            });
            db.close();
            res.send("Success");
          });
        });
      }
      catch(e){
        var temp={};
        temp[req.body.person]={};
        if(req.body.name!=""){
          temp[req.body.person]["name"]=req.body.name;
        }
        if(req.body.email!=""){
          temp[req.body.person]["email"]=req.body.email;
        }
        MongoClient.connect(url,function(err,db){
          var collection=db.collection("board");
          //Update user with new information
          collection.update({"status":"current" },{$set:temp}, function (err, item) {
            console.log("Updated user info");
          });
          db.close();
          res.send("Success");
        });
      }
    });

    app.get('/getMembers',function(req, res) {
      MongoClient.connect(url,function(err,db){
          var board=db.collection("board");
          board.find().toArray(function(err,item){
            if(err){
              console.err(err);
              res.send("error: check logs");
            }
            db.close();
            res.json(item[0]);
        });
      });
    });

    app.get('/getInfo',function(req, res) {
      MongoClient.connect(url,function(err,db){
          var collection=db.collection("about");
          collection.find().toArray(function(err,item){
            if(err){
              console.err(err);
              res.send("error: check logs");
            }
            db.close();
            res.json(item[0]);
        });
      });
    });

    //handle login event
    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/home', // redirect to the secure profile section
      failureRedirect: '/admin' // redirect back to the signup page if there is an error
    }));

    //logout
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    //redirect requests to the default login page
    app.use('/', function(req, res) {
      send(res, "index.html");
    });


    function isLoggedIn(req, res, next) {
      // return next();
      // if user is authenticated in the session, carry on
      if (req.isAuthenticated() || DEBUG)
          return next();

      // if they aren't redirect them to the home page
      res.redirect('/');
      console.log('Not logged in redirecting...');
    }

    //function to simplify sending front end elements
    function send(request, file) {
      request.sendFile(path.join(__dirname, ROOT_DIR, file));
    }
}
