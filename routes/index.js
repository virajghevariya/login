// const express = require("express");
// const router = express.Router();
// const { ensureAuthenticated } = require("../config/auth");
// const passport = require('../config/passport');
// //register page
// router.get("/", (req, res) => {
//   res.render("welcome");
//   // const { name, email, password, confirmPassword } = req.body;
//   // console.log(name, email, password, confirmPassword);
//   // console.log(req.body.name, req.body.email, req.body.password, req.body.confirmPassword);
// });

// router.get("/register", (req, res) => {
//   res.render("register");
// });

// router.post("/register",  async (req, res, next) => {
//   console.log(req.body.name, req.body.email, req.body.password, req.body.confirmPassword);
//   const { name, email, password, confirmPassword } = req.body;

//   res.status(400).redirect("register");

// //   console.log(name, email, password, confirmPassword);
// //   passport.authenticate('local', {});

// });

// //login page
// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.post("/login", (req, res) => {
//   res.render("login");
// });

// router.get("/dashboard", ensureAuthenticated, (req, res) => {});
// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("welcome");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//register post handle
router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  let errors = [];
  console.log("Name: " + name, " email :" + email, " pass:" + password);
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ msg: "Please fill in all fields" });
    res.status(400).send({ msg: "Please fill in all fields" });
  }
  //check if match
  if (password !== confirmPassword) {
    errors.push({ msg: "passwords dont match" });
    res.status(400).send({ msg: "PAssword does nOt mAtch" });
  }

  //check if password is more than 6 characters
  if (password.length < 6) {
    errors.push({ msg: "password atleast 6 characters" });
    res.status(400).send({ msg: "PASSWORD atleast 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors: errors,
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
  } else {
    //validation passed
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        console.log(user);

        errors.push({ msg: "email already registered" });
        res.send({ msg: "email already registered" });
        // res.render("register", { errors, name, email, password, confirmPassword });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          // confirmPassword,
        });

        //hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //save passs to hash
            newUser.password = hash;
            // newUser.confirmPassword = hash;
            //save user
            newUser
              .save()
              .then((value) => {
                console.log(value);
                // req.flash("success_msg", "You have now registered!");

                // res
                //   .status(200)
                //   .send({ successs_msg: "You have now registered" });
                res.redirect("/login");
              })
              .catch((value) => console.log(value));
          })
        );
      }
    });
  }
});

//login handle
router.get("/login", (req, res) => {
  res.render("login");
});

//Register handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {    
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
  res.render("login");
});

//logout
router.get("/logout", (req, res) => {
  req.logout();
  //   req.flash("success_msg", "Now logged out");
  res.redirect("/login");
});
module.exports = router;
