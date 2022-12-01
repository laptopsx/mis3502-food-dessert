"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02 = "http://mis3502-tertulien.com/8214";

var iteration = 1;
const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);

var usertoken = urlParams.get('usertoken')
console.log(usertoken)
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
	console.log(the_serialized_data);
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
				$("#usertoken").val(localStorage.usertoken) 
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
				$("#div-mymap").hide();
				$("#div-stuff").hide();
				$(".navbar-nav").hide();
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
				txtRow = txtRow + '<td>' + results[i]['length'] + '</td>';
				txtRow = txtRow + '</tr>';
				$('#table-list').append(txtRow);
				$(".navbar-nav").show();
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
				txtRow = txtRow + '<td>' + results[i]['city']  + '<input onclick="getMyCurrentLocation(' + results[i]["#div-mymap"] + ')" type="button" id="map-button" value="Map" class="btn btn-default float-right" style="background-color:gray" >';
				txtRow = txtRow + '<td>' + results[i]['zipcode']  + '</td>';
				txtRow = txtRow + '</tr>';
				$('#address-list').append(txtRow);
				$(".navbar-nav").show();
				$(".container").show();
			}
		},
		error : function(data){
			console.log(data)
		}
	});
}
let createUser = function(){
	$("#message-addTask").html("");
	$("#message-addTask").removeClass();
	let the_serialized_data = $("#form-add-Sub").serialize();
	console.log(the_serialized_data)
	//client-side error trapping
	let name = $("#name").val();
	let duration = $("#duration").val();
	let foodselection = $("#foodOption").val();
	let frequency = $("#frequency").val();

	if (name == "" || name.length < 3){
		$('#message-addSub').html('Your name of at least three characters is required.');
		$('#message-addSub').addClass("alert alert-danger text-center");
		return; //quit the function now!  Get outta town!  Stop. 
	}
	if (duration == "" || duration.length < 3){
		$('#message-addSub').html('Please enter the amount of how long you want to subscribe');
		$('#message-addSub').addClass("alert alert-danger text-center");
		return; //quit the function now!  Get outta town!  Stop. 
	}
	if (foodselection == "") {
		$('#message-addSub').addClass("alert alert-danger text-center");
		$('#message-addSub').html('Please pick the food you want.');
		return; // Quit
	}

	if (frequency == "") {
		$('#message-addSub').addClass("alert alert-danger text-center");
		$('#message-addSub').html('Please pick the frequency of how much you want this to occur to your delivery');
		return; // Quit
	}
	
	$.ajax({
		url: endpoint02 + '/users',
		data: the_serialized_data,
		method: 'POST',
		success: function(results){
			console.log(results)
			getSubscription();
			$(".content-wrapper").hide();
			$("#div-list").show();
			$(".navbar-nav").show();
		},
		error:function(data){
			console.log("Something went wrong.")
		}
	})

}
let createAddress = function(){
	let the_serialized_data = $("#form-addAddress").serialize();
	console.log(the_serialized_data)
	
	$.ajax({
		url: endpoint02 + '/address',
		data: the_serialized_data,
		method: 'POST',
		success: function(results){
			console.log(results)
			getAddress();
			$(".content-wrapper").hide();
			$("#div-list").show();
			$(".navbar-nav").show();
		},
		error:function(data){
			console.log("Something went wrong.")
		}
	})
}

let updateAddress = function(){

	let the_serialized_data = $("#form-addAddress").serialize();
	console.log(the_serialized_data);
	$.ajax({
		url : endpoint02 + '/address',
		data : the_serialized_data,
		method : 'PUT',
		success : function(results){
			console.log(results);
			getAddress();

			$(".content-wrapper").hide(); 	
			$("#div-list").show(); 
			$(".navbar-nav").show();
		},
		error : function(data){
			console.log("Something went wrong.")
		}
	});
}


let updateSubscription = function(){
	let the_serialized_data = $("#form-add-Sub").serialize();
	console.log(the_serialized_data);
	$.ajax({
		url : endpoint02 + '/subscription',
		data : the_serialized_data,
		method : 'PUT',
		success : function(results){
			console.log(results);
			createUser();
			$(".content-wrapper").hide(); 	
			$("#div-list").show(); 
		},
		error : function(data){
			console.log("Something went wrong.")
		}
	});
}
let cancelSubscription = function(){

	let the_serialized_data = $('#form-add-Sub').serialize();
  //form-play is incorrect... will need to be changed to whatever is called (only need usertoken here)
  
	console.log(the_serialized_data);

	$.ajax({
		url : endpoint02 + '/cancel',
		data : the_serialized_data,
		method : 'DELETE',
		success : function(result){
			//This where we would show the cancel DIV and put the message you already have 
			console.log(result)
			
		},
		error : function(data){
			console.log(data)
		}
	});
}
//previous api code 
/*


let validateAddress = function(){
	let key = '144557245378381511'
	let street = $('#street').val();
	let street2 = ''
	let city = $('#city').val();
	let state = $('#state').val(); //Will need to add state to client and server side code 
	let zipcode = $('#zipcode').val();
	
	  let the_serialized_data ='street=' + street + '&street2=' + street2 + '&city=' + city + '&state=' + state + '&zipcode=' + zipcode + '&address-type=us-street-components';
	  console.log(the_serialized_data)
	
		$.ajax({
			url : 'https://misdemo.temple.edu/corsfix',
			data : {the_serialized_data, "key": key },
			method : 'GET',
			success : function(results){
			  console.log(results);
			  
			  //Need to 
			  
			  // This may be incorrect ... results[0]['enhanced_match']
			  
			  if (results[0]['enhanced_match'] != 'postal-match'){
				   // Show a message to client that address is invalid and stop the process
				   $('#message-addSub').html("This is an invalid address. Please enter a real address in order to deliver the food products.")
				   $("#message-addSub").addClass("alert alert-danger text-center")
				return;
			  }
			  
			  if (results[0]['enhanced_match'] == 'postal-match'){
				//Not sure if we need this -- just need it to move to the next function
				 
			  }
			},
			error : function(data){
			  console.log("Something went wrong.")
			  // Show a message to the client that is invalid and stop the process
			}
		  });
	}
	*/
//My API Code
const myAPIKey = "RZzneSw5Vm5SDiA9SZxbozcYNGssF8GT";

let getMyCurrentLocation = function(){
	navigator.geolocation.getCurrentPosition(getTheInteractiveMap);
}

let getTheInteractiveMap = function(position){
	console.log( 39.916962, -75.2272)
	L.mapquest.key = myAPIKey;

// 'map' refers to a <div> element with the ID map
	var tertulienmap = L.mapquest.map('mymap', {
  	center: [39.916962, -75.2272],
  	layers: L.mapquest.tileLayer('map'),
    zoom: 12
});
	tertulienmap.addControl(L.mapquest.control());
}
$(document).ready(function(){
	getMyCurrentLocation

})

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
		$(".content").hide();
		$(".secured").removeClass("locked");		
		$(".secured").addClass("unlocked");
		$("#usertoken").val(localStorage.usertoken)
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
		updateSubscription();
	});
	$("#btnCancel2").click(function(){
		cancelSubscription();
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
		createAddress();
	});

	$("#btnUpdateAddress").click(function(){
		updateAddress();
	})
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
		$("#div-list").show();
		getSubscription();
		getAddress();
		
	});
	$("#map-button").click(function(){
		$(".content-wrapper").hide();
		$("#div-stuff").show();
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
	$('.carousel').carousel()

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
