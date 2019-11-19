module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // This will bring you to the login page immediately
    app.get('/', function(req, res) {
        res.render('login.ejs');
    });

    // PROFILE SECTION =========================
    // This route brings the user to the "home page" once they have successfully logged in.
    app.get('/home', isLoggedIn, function(req, res) {
        db.collection('userList').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('index.ejs', {
            user : req.user,
            userList: result
          })
        })
    });

// Once the user logouts , the page goes to the login page
    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// ===================================================

// This request grabs the index.ejs and displays the page along with an object of the results
app.get('/', (req, res) => {
  db.collection('userList').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {userList: result})
  })
})

// This takes the user's information from the form and saves it into the database.Then it goes to the home route which redisplays the page with the new information.
app.post('/bookInput', (req, res) => {
  db.collection('userList').save({bookName: req.body.bookName, category: req.body.category, price: parseFloat(req.body.price)}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/home')
  })
})

// This updates our table by finding the book name and category and matching the name of the book and category in the database, then updating the price to now be the new price the user has seen.
app.put('/bookInput', (req, res) => { console.log('hello')
  db.collection('userList')
  .findOneAndUpdate({bookName: req.body.bookName, category: req.body.category}, {
    $set: {
      price:req.body.price
    }
  },
  {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// this finds all of the properties,once it is a match, it then deletes them
app.delete('/bookInput', (req, res) => { console.log(req.body)
  db.collection('userList').findOneAndDelete({bookName: req.body.bookName, category: req.body.category, price: req.body.price }, (err, result) => {
    if (err) return res.send(500, err)
      res.send('Message deleted!')
  })
})

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { userList: req.flash('loginMessage')});
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));



        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
