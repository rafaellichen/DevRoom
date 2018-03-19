const admin = require("firebase-admin");
const serviceAccount = require("./c4q-grading-system-firebase-adminsdk-auy6d-1256425416.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c4q-grading-system.firebaseio.com"
});
const db = admin.database();

function write() {
  db.ref("grade/hihihihi/abcdefg").set({
    grade: 0,
    q1: {
      check: 0,
      grade: 0,
      response: "none"
    },
    q2: {
      check: 0,
      grade: 0,
      response: "none"
    },
    q3: {
      check: 0,
      grade: 0,
      response: "none"
    },
    q4: {
      check: 0,
      grade: 0,
      response: "none"
    },
    status: 0
  })
}
// write()

function signup() {
  admin.auth().createUser({
    email: "admin@gmail.com",
    password: "password",
  })
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully created new user:", userRecord.uid);
  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
  });
}
// signup()

function profile() {
  // https://firebase.google.com/docs/auth/admin/manage-users
}

const express	= require('express');
const bodyParser = require('body-parser');
const app = express();
const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database("devroom.db")
const PORT = process.env.PORT || 3000

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/views'));

app.get('/',function(req,res) {
  res.render('home');
});

app.get('/register/:username/:code/:password',function(req,res) {
  password = req.params.password
  username = req.params.username
  code = req.params.code
  var ref = db.ref("invitation/"+code);
  ref.once("value", function(snapshot) {
    if(snapshot.val()!=null) {
      admin.auth().createUser({
        email: username,
        password: password
      })
      .then(function(userRecord) {
        db.ref("user/"+userRecord.uid).set({
          last: "none",
          first: "none",
          permission: 0,
          avatar: "none"
        })
        db.ref("invitation/"+code).remove()
        res.send({status: "success"})
      })
      .catch(function(error) {
        res.send({status: error.message})
      });
    } else {
      res.send({status: "Invalide invitation code."})
    }
  })
})

app.get('/revoke/:uid',function(req,res) {
  uid = req.params.uid
  admin.auth().revokeRefreshTokens(uid)
  res.render("home")
})

app.get('/:idToken',function(req,res) {
  idToken = req.params.idToken
  let checkRevoked = true;
  admin.auth().verifyIdToken(idToken, checkRevoked)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    var ref = db.ref("user/"+uid);
    ref.once("value", function(snapshot) {
      if(snapshot.val().permission==0) {
        res.render('student')
      }
      if(snapshot.val().permission==1) {
        res.render('instructor')
      }
    });
  }).catch(function(error) {
    res.render('home');
  });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))