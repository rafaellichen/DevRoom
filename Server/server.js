var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./c4q-grading-system-firebase-adminsdk-auy6d-1256425416.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c4q-grading-system.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("quiz/abcdefg");
ref.once("value", function(snapshot) {
  // console.log(snapshot.val());
});

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

function login() {
  // login on client side, and server verifies id token
  // https://firebase.google.com/docs/auth/admin/verify-id-tokens
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

app.get('/student',function(req,res) {
  res.render('student');
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))