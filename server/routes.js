/* This file manages the front end and rest requests along with any post request
to update the database.
Created By: Caleb Riggs
*/

const DEBUG = true;
var fs = require('fs');
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

    app.post('/updatePicture',upload.single('file'), isLoggedIn,function(req, res) {
      var validIn="header1,header2,header3,header4,header5,group,ist,logo";
      if(validIn.includes(req.body.picID)){
        fs.rename(req.file.path, "../frontEnd/img/test.jpg", function (err) {
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
