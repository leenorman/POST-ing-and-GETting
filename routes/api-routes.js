// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      FieldId: req.body.FieldId
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        FieldId: req.user.FieldId
      });
    }
  });

  // PUT route for updating posts
  // INCOMPLETE
  //   app.put("/api/userProfile", function(req, res) {
  //     db.Post.update(req.body, {
  //       where: {
  //         id: req.body.id
  //       }
  //     }).then(function(dbPost) {
  //       res.json(dbPost);
  //     });
  //   });

  // app.get("/api/jobSearch/:keywords", function(req, res) {
  //   var queryUrl = `
  //   http://openlibrary.org/search.json?q=${req.params.keywords}
  //   `;

  //   var jobSearchResults = axios
  //     .get(queryUrl)
  //     .then(function(res) {
  //       return res.data.docs;
  //     })
  //     .catch(function(err) {
  //       console.log(err);
  //     });
  //   // Otherwise send back the user's email and id
  //   // Sending back a password, even a hashed password, isn't a good idea
  //   res.json({
  //     jobSearchResults
  //   });
  // });
};
