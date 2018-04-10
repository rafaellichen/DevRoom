const admin = require("firebase-admin");
const serviceAccount = require("./c4q-grading-system-firebase-adminsdk-auy6d-1256425416.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c4q-grading-system.firebaseio.com",
});

const db = admin.database();

function profile() {
  // https://firebase.google.com/docs/auth/admin/manage-users
}

const express	= require('express');
const bodyParser = require('body-parser');
const app = express();
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database("devroom.db")
const PORT = process.env.PORT || 3000

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
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

app.get('/grade/:examididToken',function(req,res) {
  idToken = req.params.examididToken.slice(32)
  examid = req.params.examididToken.slice(0,32)
  let checkRevoked = true;
  admin.auth().verifyIdToken(idToken, checkRevoked)
  .then(function(decodedToken) {
    var uid = decodedToken.uid
    var ref = db.ref("user/"+uid)
    ref.once("value", function(snapshot1) {
      if(snapshot1.val().permission==1) {
        db.ref("grade").once("value", function(snapshot) {
          val = snapshot.val()
          allstudent = []
          keys = Object.keys(val)
          keys.forEach(function(e) {
            if(val[e][examid]) {
              allstudent.push(e)
            }
          })
          db.ref("user").once("value", function(e) {
            val = e.val()
            allnames = []
            for(var i=0; i<allstudent.length; i++) {
              allnames.push(val[allstudent[i]]["first"]+" "+val[allstudent[i]]["last"])
            }
            if(allstudent.length) res.render('instructor', {examlist: true, students: allstudent, allnames: allnames, examid: examid})
            else res.render('instructor', {examlist: true, students: [], allnames: allnames, examid: examid})
          })
        })
      }
    })
  }).catch(function(error) {
    res.render('home');
  });
  // admin.database().ref().child('posts').push().key;
  // -L8dhkOiGQI7J0pQafZF length: 20 chars
  // res.render('student', {home: false, exam: true})
});

app.get('/gradeexam/:examididToken', function(req, res) {
  idToken = req.params.examididToken.slice(60)
  examid = req.params.examididToken.slice(0,32)
  student = req.params.examididToken.slice(32,60)
  let checkRevoked = true;
  admin.auth().verifyIdToken(idToken, checkRevoked)
  .then(function(decodedToken) {
    db.ref("grade/"+student+"/"+examid).once("value", function(snapshot1) {
      db.ref("questions/"+examid).once("value", function(snapshot2) {
        thisexam = snapshot2.val()
        questionkeys = Object.keys(thisexam)
        allquestions = []
        questionkeys.forEach(function(element) {
          obj = thisexam[element]
          obj["questionNum"] = "Question "+element.slice(1)
          obj["choice"] = obj["choice"].split("<!>")
          obj["examid"] = examid
          obj["studentans"]=snapshot1.val()[element]["response"]
          allquestions.push(obj)
        })
        allquestions['studentid'] = student
        // console.log(allquestions)
        res.render('instructor', {exam: true, home: false, allquestions: allquestions})
      })
    })
  })
})

app.get('/exam/:examididToken',function(req,res) {
  idToken = req.params.examididToken.slice(32)
  examid = req.params.examididToken.slice(0,32)
  let checkRevoked = true;
  admin.auth().verifyIdToken(idToken, checkRevoked)
  .then(function(decodedToken) {
    var uid = decodedToken.uid
    var ref = db.ref("user/"+uid)
    ref.once("value", function(snapshot) {
      if(snapshot.val().permission==0) {
        var questions = db.ref("questions/")
        questions.once("value", function(snapshot) {
          thisexam = snapshot.val()[examid]
          questionkeys = Object.keys(thisexam)
          allquestions = []
          questionkeys.forEach(function(element) {
            obj = thisexam[element]
            obj["questionNum"] = "Question "+element.slice(1)
            obj["choice"] = obj["choice"].split("<!>")
            obj["examid"] = examid
            allquestions.push(obj)
          })
          // console.log(allquestions)
          res.render('student', {home: false, exam: true, questions: allquestions})
        })
      }
    })
  }).catch(function(error) {
    res.render('home');
  });
  // admin.database().ref().child('posts').push().key;
  // -L8dhkOiGQI7J0pQafZF length: 20 chars
  // res.render('student', {home: false, exam: true})
});

app.post('/submitgrades', function(req, res) {
  data = req.body.allpoints
  questionkeys = []
  if(data.includes("0")) allchecked = false
  else allchecked = true
  for(var i=1; i<data.length-1; i++) {
    questionkeys.push("q"+i)
  }
  console.log(allchecked)
  if(allchecked==true) {
    db.ref("grade/"+data[data.length-1]+"/"+data[data.length-2]).update({
      status: 1
    })
  }
  questionkeys.forEach(function(e, index) {
    db.ref("grade/"+data[data.length-1]+"/"+data[data.length-2]+"/"+e).update({
      grade: data[index]
    })
  })
  res.json({ success: true });
})

app.post('/submitresponse', function(req, res){
  data = req.body.responsesubmit
  path = "grade/"+data[data.length-2]+"/"+data[data.length-1]
  answers = {}
  answers["status"]=0
  for(var i=0; i<data.length-3; i+=2) {
    qnum = String(data[i]).split(" ")[0][0].toLocaleLowerCase()+String(data[i]).split(" ")[1]
    answers[qnum]={}
    answers[qnum]["grade"]=0
    downurl = data[i+1].split("<!>")
    answers[qnum]["response"]=downurl
    if(data[i+1]=="?" || data[i+1]=="") answers[qnum]["response"]="none"
  }
  db.ref(path).set(answers)
  res.json({ success: true });
})

app.get('/user/:idToken',function(req,res) {
  idToken = req.params.idToken
  let checkRevoked = true;
  admin.auth().verifyIdToken(idToken, checkRevoked)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    var ref = db.ref("user/"+uid);
    ref.once("value", function(snapshot) {
      // console.log(snapshot.val().permission)
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
          // console.log(result)
          // result = result.filter(function(e, index) {
          //   return Number(e.date) >= Number(timecode) && Number(e.date) <= Number(timecode2)
          // })
          // quizkeys = quizkeys.filter(function(e) {
          //   return Number(e.slice(0,8)) >= Number(timecode) && Number(e.slice(0,8)) <= Number(timecode2) 
          // })
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
          // console.log(final)
          // console.log(quizkeys)
          for(var i=0; i<final.length; i++) {
            for(var j=0; j<final[i].length; j++) {
              final[i][j]=[final[i][j],
                          result[quizkeys.indexOf(final[i][j])].name,
                          String(result[quizkeys.indexOf(final[i][j])].start).slice(0,2)+":"+String(result[quizkeys.indexOf(final[i][j])].start).slice(2),
                          examStarted(currenttime,result[quizkeys.indexOf(final[i][j])].date,timecode,result[quizkeys.indexOf(final[i][j])].start)]
            }
            final[i].unshift([textDate(final[i][0][0].slice(0,8))])
          }
          // console.log(final)
          final = final.reverse()
          res.render('student',{home: true, exam: false, examcard: final})
        })
      }
      if(snapshot.val().permission==1) {
        // fetch all the exams
        var exams = db.ref("quiz/")
        var today = new Date();
        var future = new Date();
        future.setDate(today.getDate()-11);
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
          // console.log(result)
          // result = result.filter(function(e, index) {
          //   return Number(e.date) <= Number(timecode) && Number(e.date) >= Number(timecode2)
          // })
          // quizkeys = quizkeys.filter(function(e) {
          //   return Number(e.slice(0,8)) <= Number(timecode) && Number(e.slice(0,8)) >= Number(timecode2) 
          // })
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
          // console.log(final)
          // console.log(quizkeys)
          for(var i=0; i<final.length; i++) {
            for(var j=0; j<final[i].length; j++) {
              final[i][j]=[final[i][j],
                          result[quizkeys.indexOf(final[i][j])].name,
                          String(result[quizkeys.indexOf(final[i][j])].start).slice(0,2)+":"+String(result[quizkeys.indexOf(final[i][j])].start).slice(2),
                          examStarted(currenttime,result[quizkeys.indexOf(final[i][j])].date,timecode,result[quizkeys.indexOf(final[i][j])].start)]
            }
            final[i].unshift([textDate(final[i][0][0].slice(0,8))])
          }
          // console.log(final)
          final = final.reverse()
          res.render('instructor',{home: true, exam: false, examcard: final})
        })
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