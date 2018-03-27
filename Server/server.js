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

app.get('/exam',function(req,res) {
  res.render('student', {home: false, exam: true})
})

app.get('/home',function(req,res) {
  res.render('student', {home: true, exam: false})
})

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

app.get('/user/:idToken/exam/:examid',function(req,res) {
  idToken = req.params.idToken
  examid = req.params.examid
  console.log(examid)
});

app.get('/user/:idToken',function(req,res) {
  idToken = req.params.idToken
  let checkRevoked = true;
  admin.auth().verifyIdToken(idToken, checkRevoked)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    var ref = db.ref("user/"+uid);
    ref.once("value", function(snapshot) {
      if(snapshot.val().permission==0) {
        // fetch all the exams
        var exams = db.ref("quiz/")
        var today = new Date();
        var future = new Date();
        future.setDate(today.getDate()+11);
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10) dd = '0'+dd
        if(mm<10) mm = '0'+mm
        var timecode = mm+dd+yyyy
        var dd = future.getDate();
        var mm = future.getMonth()+1;
        var yyyy = future.getFullYear();
        if(dd<10) dd = '0'+dd
        if(mm<10) mm = '0'+mm
        var timecode2 = mm+dd+yyyy
        hour = today.getHours()
        minute = today.getMinutes()
        if (Number(hour)<10) hour = '0'+hour
        if (Number(minute)<10) minute = '0'+minute
        var currenttime = String(hour)+String(minute)
        exams.once("value", function(snapshot) {
          result = Object.values(snapshot.val())
          quizkeys = Object.keys(snapshot.val())
          result = result.filter(function(e, index) {
            return Number(e.date) >= Number(timecode) && Number(e.date) <= Number(timecode2)
          })
          quizkeys = quizkeys.filter(function(e) {
            return Number(e.slice(0,8)) >= Number(timecode) && Number(e.slice(0,8)) <= Number(timecode2) 
          })
          final = []
          tempfinal = []
          currfinal = ""
          quizkeys.forEach(function(element,index) {
              if(element.slice(0,8)==currfinal) {
                  tempfinal.push(element)
              } else {
                  currfinal = element.slice(0,8)
                  if(!index) {
                    tempfinal.push(element)
                  } else {
                    final.push(tempfinal)
                    tempfinal = []
                    tempfinal.push(element)
                  }
              }
          });
          final.push(tempfinal)
          for(var i=0; i<final.length; i++) {
            for(var j=0; j<final[i].length; j++) {
              final[i][j]=[final[i][j],
                          result[quizkeys.indexOf(final[i][j])].name,
                          result[quizkeys.indexOf(final[i][j])].start,
                          examStarted(currenttime,result[quizkeys.indexOf(final[i][j])].date,timecode,result[quizkeys.indexOf(final[i][j])].start)]
            }
            final[i].unshift([textDate(final[i][0][0].slice(0,8))])
          }
          console.log(final)
          res.render('student',{home: true, exam: false, examcard: final})
        })
      }
      if(snapshot.val().permission==1) {
        res.render('instructor')
      }
    });
  }).catch(function(error) {
    res.render('home');
  });
});

function examStarted(cur, date, today, time) {
  if(cur>time && date==today) return true
  else return false
}

function textDate(examDate) {
  var parts =String(examDate.slice(4)+"-"+examDate.slice(0,2)+"-"+examDate.slice(2,4)).split('-');
  var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
  return mydate.toDateString().split(" ").slice(0,3).join(" ")
}

app.listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))