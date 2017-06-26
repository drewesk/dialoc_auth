const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../db/user');

router.get('/', (req, res) => {
  res.json({
    message: '🔐'
  });
});

router.post('/signup', (req, res, next) => {
  if (validUser(req.body)) {
    User.getOneByEmail(req.body.email)
      .then((user) => {
        console.log('user: ', user);

        if (!user) {
          bcrypt.genSalt(8, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              const user = {
                email: req.body.email,
                password: hash,
                created_at: new Date()
              };

              User.create(user)
                .then((id) => {
                  res.json({
                    hash,
                    id,
                    message: 'User has been created 🍜'
                  });
                });
            });
          });
        } else {
          // email is in user
          next(new Error('Email is in use'));
        }
      });
  } else {
    next(new Error('Invalid User Entry'));
  }
});

router.post('/login', (req, res, next) => {
  if (validUser(req.body)) {
    User.getOneByEmail(req.body.email)
      .then((user) => {
        console.log(user);
        if (user) {
          bcrypt.compare(req.body.password, user.password)
            .then((result) => {
              if (result) {

                const isSecure = req.app.get('env') != 'development';
                res.cookie('user_id', user.id, {
                  httpOnly: true,
                  secure: isSecure,
                  signed: true
                });

                res.json({
                  result,
                  message: 'Logged in 👍'
                });
              } else {
                next(new Error('Invalid Login'));
              }
            });
        } else {
          next(new Error('Invalid Login'));
        }
      });
  } else {
    next(new Error('Invalid Login'));
  }
});

//define validation

function validUser(user) {
  const validEmail = typeof user.email == 'string' &&
    user.email.trim() != '';
  const validPassword = typeof user.email == 'string' &&
    user.password.trim() != '' &&
    user.password.trim().length > 5;
  return validEmail && validPassword;
}

module.exports = router;
