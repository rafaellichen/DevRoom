// Initialize Firebase
// TODO: Replace with your project's customized code snippet
// Initialize Firebase

var config = {
    apiKey: "AIzaSyDRO_VABdZ977j8sGa0bgecv3tWiJb1AvI",
    authDomain: "c4q-grading-system.firebaseapp.com",
    databaseURL: "https://c4q-grading-system.firebaseio.com",
    projectId: "c4q-grading-system",
    storageBucket: "c4q-grading-system.appspot.com",
    messagingSenderId: "282583165744"
};
firebase.initializeApp(config);

$('button[name="login"]').on("click",function(){
    if($(this).text() == "Login") {
        email=$('input[name="username"]').val()
        password=$('input[name="password"]').val()
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            alert(errorMessage)
        });
    }
})

document.addEventListener("DOMContentLoaded", function(event) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                // Send token to your backend via HTTPS
                // ...
                window.location.replace("/"+idToken)
            }).catch(function(error) {
            // Handle error
            });
        }
    });
});

$(document).ready(function() {
    $('.wrap-login100 div:eq(1)').hide();
    $('.wrap-login100 div:eq(2)').hide();
})

function showall() {
    $('.wrap-login100 div:eq(1)').show();
    $('.wrap-login100 div:eq(2)').show();
    $('.wrap-login100 div:eq(3)').show();
}

function reset() {
    $('input').val("")
    $('.input100').each(function(){
        $(this).blur() 
    })
}

function hideall() {
    $('.wrap-login100 div:eq(1)').hide();
    $('.wrap-login100 div:eq(2)').hide();
    $('.wrap-login100 div:eq(3)').hide();
}

$('a[name="signup"]').on("click",function(){
    reset()
    $('a[name="retrieve"]').text("Password?")
    $('ul li:eq(0) span').show()
    if($(this).text()=="Login") {
        hideall()
        $('.wrap-login100 div:eq(0)').show();
        $('.wrap-login100 div:eq(3)').show();
        $('button[name="login"]').text("Login")
        $('li span[name="have"]').text("Don’t have an account?")
        $(this).text("Sign up")
    } else {
        showall()
        $('button[name="login"]').text("Register")
        $('li span[name="have"]').text("Already have an account!")
        $(this).text("Login")
    }
})

$('a[name="retrieve"]').on("click",function(){
    reset()
    if($(this).text() == "Password?") {
        hideall()
        $(this).text("Go back.")
        $('ul li:eq(0) span').hide()
        $('button[name="login"]').text("Retrieve")      
        $('ul li:eq(1)').hide()  
    } else {
        hideall()
        $('ul li:eq(0) span').show()
        $('.wrap-login100 div:eq(3)').show();
        $(this).text("Password?")
        $('button[name="login"]').text("Login")
        $('li span[name="have"]').text("Don’t have an account?")
        $('a[name="signup"]').text("Sign up")
        $('ul li:eq(1)').show()
    }
})

$('.input100').each(function(){
    $(this).on('blur', function(){
        if($(this).val().trim() != "") {
            $(this).addClass('has-val');
        }
        else {
            $(this).removeClass('has-val');
        }
    })    
})