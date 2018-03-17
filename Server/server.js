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
var ref = db.ref("quiz");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});