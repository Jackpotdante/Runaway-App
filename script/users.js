//Global variables creating empty current user object
var currentUser = {
	name: "",
	email: "",
	uid: "",
	photoUrl: "",
	age: 0,
	city: "",
	memberDate: "",
	gender: "",
	totalLength: 0,
	longestRun: 0
};
var totalRun = 0;
var longestRun = 0;


// Initialize Firebase
/*
var config = {
    apiKey: "AIzaSyB_jUOkuZqQulxnav7DWKndDXSilpTc-1s",
    authDomain: "runaway-project.firebaseapp.com",
    databaseURL: "https://runaway-project.firebaseio.com",
    projectId: "runaway-project",
    storageBucket: "runaway-project.appspot.com",
    messagingSenderId: "223527826161"
};
firebase.initializeApp(config);

const db = firebase.database();
*/
//facebook provider object
var provider = new firebase.auth.FacebookAuthProvider();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        console.log('onAuthStateChanged: user is signed in', user);

        //gotoAccountPage(user);
        console.log('User is logged in outside load');
        pushUserIntoFirebase(user);
        gotoTimerPage();


    } else {
      // User is signed out.
      // ...
    console.log('onAuthStateChanged: user is signed out');
    }
  });


window.addEventListener('load', function(event) {

		var btnLoginFace = document.getElementById('btnLoginFace');
		var wrapUsersMob = document.getElementById('containerLoginMob');
		var wrapUsersDesk = document.getElementById('containerLoginDesk');
		var wrapProfile = document.getElementById('containerProfil');


	  //console.log('windows is loaded');
	  //var screenH = document.documentElement.clientHeight;

	  //wrapUsersMob.style.height = screenH;
	  //wrapUsersDesk.style.height = screenH;
	  //console.log('Current screen heigth: ' + screenH);

	  //facebok login functionality
	  btnLoginFace.addEventListener('click', function(event){

	  	 //To sign in with a pop-up window, call redirect
	  	 	  firebase.auth().signInWithRedirect(provider);
		      firebase.auth().getRedirectResult().then(function(result) {
		        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
		        var token = result.credential.accessToken;
		        console.log('Token: ' + token);
		        // The signed-in user info.
		        var user = result.user;
		        //console.log('User info: ' + user)

		        console.log('User is logged in inside load');
		        //gotoAccountPage(user);
		        pushUserIntoFirebase(user);
		        gotoTimerPage();



		      }).catch(function(error) {
		        // Handle Errors here.
		        var errorCode = error.code;
		        var errorMessage = error.message;
		        // The email of the user's account used.
		        var email = error.email;
		        // The firebase.auth.AuthCredential type that was used.
		        var credential = error.credential;
		        console.log('sign in is uncessful: ' + errorMessage);
		      });//end of signInWithPopup function


	  })//end of btnLoginFace eventListener


	  //Log out button functionality
	 var btnLogOut = document.getElementById('btnLogOut');
	 btnLogOut.addEventListener('click', function(event) {

	 		firebase.auth().signOut().then(function() {
			  // Sign-out successful.
			  	var wrapProfile = document.getElementById('containerProfil');
				wrapProfile.style.display = 'none';

				var timerPage = document.getElementsByClassName("containerTimer")[0];
				timerPage.style.display = "none";

				var containerLogin = document.getElementsByClassName("containerLogin")[0];

				containerLogin.style.display = 'block';

				var navContainer = document.getElementsByClassName("navContainer")[0];

				navContainer.style.display = 'none';


				currentUser = "";


			}).catch(function(error) {
			  console.log('Error sign out: ' + error);
			});


	 }) //end of btnSignOut eventlistener


}); //windows.load


//Push user object into firebase
function pushUserIntoFirebase(userO){
	var displayName = userO.displayName;
	console.log('Display name: ' + displayName);

	var email = userO.email;
	console.log('Email: ' + email);

	var uid = userO.uid;
	console.log('User id: ' + uid);

	var photoUrl = userO.photoURL;
	console.log('Photo URL: ' + photoUrl);

	var userExist = false;


	//Checks if user already exist in the DB
	db.ref('users/').once('value', function(snapshot) {
		let data = snapshot.val();
		console.log("Here is inside db.ref");
		for(let child in data){
			let r = data[child];

			//console.log('r.uid: ' + r.uid);
			//console.log('userO.uid: ' + userO.uid);

			if(r.uid == userO.uid){
				console.log("User is already registered");
				userExist = true;
				currentUser.name = r.name;
				currentUser.email = r.email;
				currentUser.uid = r.uid;
				currentUser.photoUrl = r.photoUrl;
				currentUser.age = r.age;
				currentUser.city = r.city;
				currentUser.memberDate = r.memberDate;
				currentUser.gender = r.gender;
			} //end of if else

		}//end of for
		callLater();
	})//end of db.ref

	function callLater() {
		console.log('User exist value after db:  ' + userExist);
		if (userExist != true){

			console.log('User exist is set to false');

			//getting current date
			var currentDate = getCurrentDate();

			//Creating user object
		      const newUser = {
		        name: displayName,
		        email: email,
		        uid: uid,
		        photoUrl: photoUrl,
		        age: 0,
		        city: "",
		        memberDate: currentDate,
		        gender: ""
		      }//end of obj
		      console.log("New user is added" + newUser);

				currentUser.name = newUser.name;
				currentUser.email = newUser.email;
				currentUser.uid = newUser.uid;
				currentUser.photoUrl = newUser.photoUrl;
				currentUser.age = newUser.age;
				currentUser.city = newUser.city;
				currentUser.memberDate = newUser.memberDate;
				currentUser.gender = newUser.gender;

		      //Adding new user into the DB
		      db.ref('users/').push(newUser);
	    }//end of if

	    updateAccountPage();
	}//end of callLater


}//end of pushUserInfoIntoFirebase

function gotoTimerPage(){
	var timerPage = document.getElementsByClassName("containerTimer")[0];
	var containerLogin = document.getElementsByClassName("containerLogin")[0];
	var navContainer = document.getElementsByClassName("navContainer")[0];

	containerLogin.style.display = 'none';
	timerPage.style.display = "flex";
	navContainer.style.display = 'block';


	console.log('Here is timer page');
}

function getCurrentDate() {

	var currentDate = new Date();

	//get the day
	var dayNr = currentDate.getDate();
	var day = "";
	if (dayNr <= 9){
		day = '0' + dayNr;
	} else if (dayNr > 9) {
		day = dayNr;
	}

	var monthNr = currentDate.getMonth() + 1;
	var month = "";
	if (monthNr <= 9){
		month = '0' + monthNr;
	} else if (monthNr > 9) {
		month = monthNr;
	}

	var year = currentDate.getFullYear();

	var fullDate = year + '-' + month + '-' + day;

	//var date = "2018-03-01";
	return fullDate;
}

//changing into profile page page
function updateAccountPage(){

	console.log("Here is updateAccountPage function");

	console.log('Current user displayName: ' + currentUser.name);
	console.log('Current user memberDate: ' + currentUser.memberDate);
	console.log('Current user photo: ' + currentUser.photoUrl);
	console.log('Current user gender: ' + currentUser.gender);
	console.log('Current user age: ' + currentUser.age);
	console.log('Current user location: ' + currentUser.city);
	console.log('Current user membership date: ' + currentUser.memberDate);

	var picUser = document.getElementById('pic');
  	picUser.src = currentUser.photoUrl;

	var nameUser = document.getElementById('nameUser');
	nameUser.innerText = currentUser.name;

	if(currentUser.gender != ""){
		var genderUser = document.getElementById('genderUser');
		var gender = "Kön: " + currentUser.gender;
		genderUser.innerText = gender;
		genderUser.style.display = "block";
	}

	if(currentUser.age != 0){
		var ageUser = document.getElementById('ageUser');
		var age = "Ålder: " + currentUser.age;
		ageUser.innerText = age;
		ageUser.style.display = "block";
	}

	if(currentUser.city != ""){
		var locationUser = document.getElementById('locationUser');
		//var location = "Stad: " + currentUser.city;
		locationUser.innerHTML += currentUser.city;
		locationUser.style.display = "block";
	}

	var medlemSedan = document.getElementById('medlemSedan');
	var mdate = "Medlem sedan " + currentUser.memberDate;
	medlemSedan.innerText = mdate;

	getRunInfo();




}//end of updateAccountPage


function getRunInfo(){

	var runArray = [];

	//Getting current users running data from DB
	db.ref('rundor/').once('value', function(snapshot) {
		let data = snapshot.val();
		console.log("Here is inside db.ref rundor");
		for(let child in data){
			let r = data[child];

			//console.log('r.uid: ' + r.uid);
			//console.log('userO.uid: ' + userO.uid);

			if(r.user == currentUser.uid){
				console.log("Users run info available");
				//removing km from string
				var str = r.length;
				//str = str.substring(0, str.length - 2);
				var number = parseInt(str);
				//console.log(number);
				runArray.push(number);
			} //end of if else

		}//end of for
		console.log("runArray: " + runArray);
		totalRun = runArray.reduce((a, b) => a + b, 0);
		longestRun = Math.max(runArray);
		console.log("Total run: " + totalRun);
		console.log("Longest run: " + longestRun);

		var runLength = document.getElementById('length');
		var length = "Total löplängd: " + totalRun + "km";
		runLength.innerText = length;

		var longRun = document.getElementById('totalLength');
		var longestLength = "Längst sträcka: " + longestRun + "km";
		longRun.innerText = longestLength;

	})//end of db.ref

}
