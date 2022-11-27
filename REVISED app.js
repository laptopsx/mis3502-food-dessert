"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02 = "http://mis3502-tertulien.com/8214";

/* SUPPORTING FUNCTIONS */

let loginController = function(){
	//clear any previous messages
	$('#login_message').html("");
	$('#login_message').removeClass();

	//first, let's do some client-side 
	//error trapping.
	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == ""){
		$('#login_message').html('The user name and password are both required.');
		$('#login_message').addClass("alert alert-danger text-center");
		return; //quit the function now!  Get outta town!  Stop. 
	}
	
	//whew!  We didn't quit the function because of an obvious error
	//what luck!  Let's go make an ajax call now

	//go get the data off the login form
	let the_serialized_data = $('#form-login').serialize();
	//the data I am sending
	console.log(the_serialized_data);;
	$.ajax({
		"url" : endpoint01,
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			console.log(result); //the result I got back
			if (typeof result === 'string'){
				// login failed.  Remove usertoken 
				localStorage.removeItem("usertoken");
				$('#login_message').html("Login Failed. Try again.");
				$('#login_message').addClass("alert alert-danger text-center");
			} else {
				//login succeeded.  Set usertoken.
				localStorage.usertoken = result['user_id']; 
				//console log the result ... a bad idea in prodcution
				//but useful for teaching, learning and testing
				console.log(result);
				//manage the appearence of things...
				$('#login_message').html('');
				$('#login_message').removeClass();
				$('.secured').removeClass('locked');
				$('.secured').addClass('unlocked');
				$('#div-login').hide(); //hide the login page
				$('#div-home').show();   //show the default page
			}			
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	}); //end of ajax 

	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};
let getSubscription = function(){

	let the_serialized_data = $('#form-add-Sub').serialize(); //This needs to be a usertoken - could you maybe add a hidden on the first page with the images of the food
	console.log(the_serialized_data)
	$.ajax({
		url : endpoint02 + '/subscription',
		data : the_serialized_data,
		method : 'GET',
		success : function(results){
			console.log(results)
			
			for(let i = 0; i< results.length; i++){
			
				let txtRow ='<tr>';
				txtRow = txtRow + '<td>' + results[i]['name']  + '</td>';
				txtRow = txtRow + '<td>' + results[i]['frequency']  + '</td>';
				txtRow = txtRow + '<td>' + results[i]['food']  + '</td>';
				txtRow = txtRow + '<td>' + results[i]['duration'] + '</td>';
				txtRow = txtRow + '</tr>';
				$('#table-list').append(txtRow);
			}
		},
		error : function(data){
			console.log(data)
		}
	});
}
let getAddress = function(){

	let the_serialized_data = $('#form-addAddress').serialize(); //This needs to be a usertoken - could you maybe add a hidden on the first page with the images of the food
	console.log(the_serialized_data)
	$.ajax({
		url : endpoint02 + '/address',
		data : the_serialized_data,
		method : 'GET',
		success : function(results){
			console.log(results)
			
			for(let i = 0; i< results.length; i++){
			
				let txtRow ='<tr>';
				txtRow = txtRow + '<td>' + results[i]['street']  + '</td>';
				txtRow = txtRow + '<td>' + results[i]['city']  + '</td>';
				txtRow = txtRow + '<td>' + results[i]['zip code']  + '</td>';
				txtRow = txtRow + '</tr>';
				$('#address-list').append(txtRow);
			}
		},
		error : function(data){
			console.log(data)
		}
	});
}
let createUser = function(){
	let the_serialized_data = $("#form-add-Sub").serialize();
	console.log(the_serialized_data)
	$.ajax({
		url: endpoint02 + '/users',
		data: the_serialized_data,
		method: 'POST',
		success: function(results){
			console.log(results)
			getSubscription();
			$("#content-wrapper").hide();
			$("#div-list").show();

		},
		error:function(data){
			console.log("Something went wrong.")
		}
	})

}

/*
//the old Login Controller ... it used the getJSON method 
let loginController = function(){
	//clear any previous messages
	$('#login_message').html("");
	$('#login_message').removeClass();

	//first, let's do some client-side 
	//error trapping.
	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == ""){
		$('#login_message').html('The user name and password are both required.');
		$('#login_message').addClass("alert alert-danger text-center");
		return; //quit the function now!  Get outta town!  Stop. 
	}
	
	//whew!  We didn't quit the function because of an obvious error
	//what luck!  Let's go make an ajax call now

	//go get the data off the login form
	let the_serialized_data = $('#form-login').serialize();
	//the data I am sending
	console.log(the_serialized_data);;
	$.getJSON(endpoint01,the_serialized_data, function(result){
		if (typeof result === 'string'){
			// login failed.  Remove usertoken 
			localStorage.removeItem("usertoken");
			$('#login_message').html(result);
			$('#login_message').addClass("alert alert-danger text-center");
		} else {
			//login succeeded.  Set usertoken.
			localStorage.usertoken = result['user_id']; 
			//console log the result ... a bad idea in prodcution
			//but useful for teaching, learning and testing
			console.log(result);
			//manage the appearence of things...
			$('#login_message').html('');
			$('#login_message').removeClass();
			$('.secured').removeClass('locked');
			$('.secured').addClass('unlocked');
			$('#div-login').hide(); //hide the login page
			$('#div-ABC').show();   //show the default page
		}
	}); //end of getJSON

	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};
*/



//document ready section
$(document).ready(function (){

    /* ----------------- start up navigation -----------------*/	
    /* controls what gets revealed when the page is ready     */

    /* this reveals the default page */
	if (localStorage.usertoken){
		$("#div-home").show()
		$(".secured").removeClass("locked");		
		$(".secured").addClass("unlocked");
	}
	else {
		$("#div-login").show();
		$(".secured").removeClass("unlocked");
		$(".secured").addClass("locked");
	}

    /* ------------------  basic navigation -----------------*/	
    /* this controls navigation - show / hide pages as needed */

	/* links on the menu */
		
	/* what happens if the link-AAA anchor tag is clicked? */
	$('#btnAddSub').click(function(){
		$('.content-wrapper').hide();
		$("#div-addsub").show();
		$("#btnUpdateSub").hide();
	});
	$('#btnAddSub1').click(function(){
		$('.content-wrapper').hide();
		$("#div-addsub").show();
	});
	$("#btnCancel2").click(function(){
		// First ... remove usertoken from localstorage
		localStorage.removeItem("usertoken");
		// Now force the page to refresh
		window.location = "./cancel.html";
	})
	$("#btnCancel3").click(function(){
		$('.content-wrapper').hide();
		$("#div-list").show();
	});
	$("#btnAddSub2").click(function(){
		//make a function 
		createUser();
	});
	$("#btnAddAddress").click(function(){
		$(".content-wrapper").hide();
		$("#div-addaddress").show();
	});
	$("#btnAddAddress2").click(function(){
		//make a function and put the list on there
		$(".content-wrapper").hide();
		$("#div-list").show();
	});
	$("#btnViewSub").click(function(){
		$(".content-wrapper").hide();
		$("#div-list").show();
	});
	$('#link-addaddress').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-addaddress").show(); /* show the chosen content wrapper */
	});
	$('#link-list').click(function(){
		$(".content-wrapper").hide();
		$("#div-list").show()
		getSubscription();
		getAddress();
	});
	/* what happens if the link-BBB anchor tag is clicked? */
	$('#link-history').click(function(){
		//make a function first
		$(".content-wrapper").hide(); 	
		$("#div-history").show(); 
	});

	/* what happens if the link-CCC anchor tag is clicked? */
	$('#link-addsub').click(function(){
		//make a function first
		$(".content-wrapper").hide(); 	
		$("#div-addsub").show(); 
	});

	/* what happens if any of the navigation links are clicked? */
	$('.nav-link').click(function(){
		$("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
		$(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */
	});

	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function(){
		loginController();
	});

	/* what happens if the logout link is clicked? */
	$('#link-logout').click(function(){
		// First ... remove usertoken from localstorage
		localStorage.removeItem("usertoken");
		// Now force the page to refresh
		window.location = "./index.html";
	});


}); /* end the document ready event*/
