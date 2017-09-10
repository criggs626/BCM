/* This file manages the front end and rest requests along with any post request
to update the database.
Created By: Caleb Riggs
*/

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
      if (req.isAuthenticated())
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
