$(document).ready(function() {
    $('.wrap-login100 div:eq(1)').hide();
    $('.wrap-login100 div:eq(2)').hide();
})

function showall() {
    $('.wrap-login100 div:eq(1)').show();
    $('.wrap-login100 div:eq(2)').show();
    $('.wrap-login100 div:eq(3)').show();
}

function hideall() {
    $('.wrap-login100 div:eq(1)').hide();
    $('.wrap-login100 div:eq(2)').hide();
    $('.wrap-login100 div:eq(3)').hide();
}

$('a[name="signup"]').on("click",function(){
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