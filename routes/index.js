
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
          confirmPassword,
        });
        
        newUser.save().then((value) => {
          console.log(value);
          res.redirect('/login');
        })
        // //hash password
        // bcrypt.genSalt(10, (err, salt) =>
        //   bcrypt.hash(newUser.password, salt, (err, hash) => {
        //     if (err) throw err;
        //     //save passs to hash
        //     newUser.password = hash;
        //     newUser.confirmPassword = undefined;
        //     //save user
        //     newUser
        //       .save()
        //       .then((value) => {
        //         console.log(value);
        //         // req.flash("success_msg", "You have now registered!");

        //         // res
        //         //   .status(200)
        //         //   .send({ successs_msg: "You have now registered" });
        //         res.redirect("/login");
        //       })
        //       .catch((value) => console.log(value));
        //   })
        // );
      }
    });
  }
});

//login handle
router.get("/login", (req, res) => {
  res.render("login");
});

//Register handle
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, userEmail.password);
    
    if (isMatch) {
      res.status(201).redirect('/chat');
    }else {
      res.status(400).send('invalid login details!@#');
    }
    
    // res.send(userEmail);
    // console.log(userEmail.password);

  } catch (err) {
    res.status(400).send('invalid login details');
  }
  // passport.authenticate("local", {    
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  //   failureFlash: true,
  // })(req, res, next);
  // res.render("login");
});

// chat 
router.get("/chat", (req, res) => {
  res.render("chat");
});

//logout
router.get("/logout", (req, res) => {
  req.logout();
  //   req.flash("success_msg", "Now logged out");
  res.redirect("/login");
});
module.exports = router;
