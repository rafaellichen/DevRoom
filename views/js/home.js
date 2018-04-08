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
        if($('input[name="password"]').val()=="" || $('input[name="username"]').val()=="") {
            Jackbox.warning("All fields are required.")
        } else {
            email=$('input[name="username"]').val()
            password=$('input[name="password"]').val()
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                Jackbox.error(errorMessage);
            });
        }
    }
    if($(this).text() == "Register") {
        if($('input[name="repeat"]').val()=="" || $('input[name="password"]').val()=="" || $('input[name="code"]').val()=="" || $('input[name="username"]').val()=="") {
            Jackbox.warning("All fields are required.")
        } else if($('input[name="password"]').val()==$('input[name="repeat"]').val()) {
            email=$('input[name="username"]').val()
            password=$('input[name="password"]').val()
            code=$('input[name="code"]').val()
            fetch("/register/"+email+"/"+code+"/"+password)
            .then(function(response) {
                return response.json();
            }).then(function(obj) {
                if(obj.status=="success") {
                    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        Jackbox.error(errorMessage)
                    });
                } else {
                    Jackbox.error(obj.status)
                }
            })
        } else {
            Jackbox.warning("Passwords do not match.")
        }
    }
})

document.addEventListener("DOMContentLoaded", function(event) {
    Jackbox.init();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Jackbox.success("Verification successful. Maximum warp.")
            setTimeout(function(){
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    window.location.href = "/user/"+idToken
                })
            }, 2000);
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
