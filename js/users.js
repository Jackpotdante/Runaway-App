
//Global variable creating empty current user object
var currentUser = {
	name: "",
	email: "",
	uid: "",
	photoUrl: "",
	age: 0,
	city: "",
	memberDate: "",
	gender: "",
	key: "",
	totalLength: 0,
	longestRun: 0
};

var userExist = false;

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

//Loader function

		var loader;
		function loaderFunction() {
			document.getElementsByClassName("lds-spinner")[0].style.display = "inline-block";
			loader = setTimeout(showPage, 3000);
		}

		function showPage() {
		  document.getElementsByClassName("lds-spinner")[0].style.display = "none";
		}

//facebook provider object
var provider = new firebase.auth.FacebookAuthProvider();
var providerGoogle = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        //console.log('onAuthStateChanged: user is signed in', user);

        //gotoAccountPage(user);
        pushUserIntoFirebase(user);
        //gotoTimerPage();


    } else {
      // User is signed out.
      // ...
    //console.log('onAuthStateChanged: user is signed out');
    }
  });


window.addEventListener('load', function(event) {

		var btnLoginFace = document.getElementById('btnLoginFace');
		var wrapUsersMob = document.getElementById('containerLoginMob');
		var wrapUsersDesk = document.getElementById('containerLoginDesk');
		var wrapProfile = document.getElementById('containerProfil');
		var btnLoginGoogle = document.getElementById('btnLoginGoogle');


	 

	  //facebok login functionality
	  btnLoginFace.addEventListener('click', function(event){

	  	 //To sign in with a pop-up window, call redirect
	  	 	  firebase.auth().signInWithRedirect(provider);
		      firebase.auth().getRedirectResult().then(function(result) {
		        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
		        var token = result.credential.accessToken;
		        //console.log('Token: ' + token);
		        // The signed-in user info.
		        var user = result.user;
		        //console.log('User info: ' + user);
		           var user = result.user;
		        //console.log('User info: ' + user);
		        //console.log('User email: ' + user.email);
		        //console.log('User name: ' + user.displayName);
		        //console.log('User uid: ' + user.uid);


		        //console.log('User is logged in inside load');
		        //gotoAccountPage(user);
		        pushUserIntoFirebase(user);
		        //gotoTimerPage();



		      }).catch(function(error) {
		        // Handle Errors here.
		        var errorCode = error.code;
		        var errorMessage = error.message;
		        // The email of the user's account used.
		        var email = error.email;
		        // The firebase.auth.AuthCredential type that was used.
		        var credential = error.credential;
		        //console.log('sign in is uncessful: ' + errorMessage);
		      });//end of signInWithPopup function


	  })//end of btnLoginFace eventListener

	  //Google login functionality
	  btnLoginGoogle.addEventListener('click', function(event){

	  		//To sign in with a pop-up window, call redirect
	  	 	  firebase.auth().signInWithRedirect(providerGoogle);
		      firebase.auth().getRedirectResult().then(function(result) {
		        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
		        var token = result.credential.accessToken;
		        //console.log('Token: ' + token);
		        // The signed-in user info.
		        var user = result.user;
		        //console.log('User info: ' + user);
		        //console.log('User email: ' + user.email);
		        //console.log('User name: ' + user.displayName);
		        //console.log('User uid: ' + user.uid);


		        //console.log('User is logged in inside load');
		        //gotoAccountPage(user);
		        pushUserIntoFirebase(user);
		       



		      }).catch(function(error) {
		        // Handle Errors here.
		        var errorCode = error.code;
		        var errorMessage = error.message;
		        // The email of the user's account used.
		        var email = error.email;
		        // The firebase.auth.AuthCredential type that was used.
		        var credential = error.credential;
		        //console.log('sign in is uncessful: ' + errorMessage);
		      });//end of signInWithPopup function

	  })//end of btnLoginGoogle eventListener


	  //Log out button functionality
	 var btnLogOut = document.getElementById('logOut');
	 btnLogOut.addEventListener('click', function(event) {

	 		logOut();

	 }) //end of btnSignOut eventlistener*/

	 //btnSEnare funktion
	 var btnSenare = document.getElementById('btnSenare');
	 btnSenare.addEventListener('click', function(event) {

	 	var moreInfoProfile = document.getElementById('moreInfoProfile');
	    moreInfoProfile.style.display = "none";

	 }) //end of btnSenare eventlistener

	 //Edit profile during first time login
	 var btnAdd = document.getElementById('btnAdd');
	 btnAdd.addEventListener('click', function(event) {

	 	callAfter(currentUser.key);

	 }) //end of btnAdd eventlistener

	  //Edit profile from Profile page
		/* EDIT *****/

	 var btnEdit = document.getElementById('settings');
	 btnEdit.addEventListener('click', function(event) {

	 	//var innerProfil1 = document.getElementById('innerProfil1');
	    document.getElementById("contentProfil").style.display = "none";

	    var innerProfil2 = document.getElementById('innerProfil2');
	    innerProfil2.style.display = "block";

	    var picUser = document.getElementById('pic2');
  		picUser.src = currentUser.photoUrl;

  		var inputUserName = document.getElementById('uName2');
	 	inputUserName.placeholder = currentUser.name;

	 	if (currentUser.age != 0) {
	 		var inputUserAge = document.getElementById('uAge2');
	 		inputUserAge.placeholder = currentUser.age;
	 	}

	 	if (currentUser.city != "") {
	 		var inputUserCity = document.getElementById('uCity2');
	 		inputUserCity.placeholder = currentUser.city;
	 	}

	 }) //end of btnEdit eventlistener


	var btnCancel = document.getElementById('btnCancelP');
	 btnCancel.addEventListener('click', function(event) {

	    document.getElementById("contentProfil").style.display = "block";

	    var innerProfil2 = document.getElementById('innerProfil2');
	    innerProfil2.style.display = "none";

	    var inputUserAge = document.getElementById('uAge2');
	    inputUserAge.placeholder = "Ålder";
	    var inputUserCity = document.getElementById('uCity2');
	    inputUserCity.placeholder = "Plats";

	 }) //end of btnCancel eventlistener


	 var btnSave = document.getElementById('btnSave');
	 btnSave.addEventListener('click', function(event) {

			 	//Updating users name
			var inputUserName = document.getElementById('uName2');
			var uName = inputUserName.value;
		    inputUserName.value = "";

		    	if (uName != "") {
		    		firebase.database().ref('users/' + currentUser.key + '/name').set(uName);
		    		currentUser.name = uName;
		    	}


		    //Updating users age
		    var uAge = document.getElementById('uAge2').value;
		    document.getElementById('uAge').value = "";

		    	if (uAge != "") {
		    		firebase.database().ref('users/' + currentUser.key + '/age').set(uAge);
		    		currentUser.age = uAge;
		    	}

		    //Updating users city
		    var uCity = document.getElementById('uCity2').value;
		    document.getElementById('uCity').value = "";
		    	if (uCity != "") {
		    		firebase.database().ref('users/' + currentUser.key + '/city').set(uCity);
		    		currentUser.city = uCity;
		    	}

		    //Updating gender info
			var e = document.getElementById("selectGender2");
			var value = e.options[e.selectedIndex].value;
			//console.log("Users gender: " + value);
		       if (value != "") {
		    		firebase.database().ref('users/' + currentUser.key + '/gender').set(value);
		    		currentUser.gender = value;
		    	}


			updateAccountPage();

			var moreInfoProfile = document.getElementById('moreInfoProfile');
			moreInfoProfile.style.display = "none";


	    	var innerProfil2 = document.getElementById('innerProfil2');
	   		innerProfil2.style.display = "none";

	   		

			document.getElementById("contentProfil").style.display = "block";


		    var inputUserAge = document.getElementById('uAge2');
		    inputUserAge.placeholder = "Ålder";
		    var inputUserCity = document.getElementById('uCity2');
		    inputUserCity.placeholder = "Plats";
	}) //end of btnSave eventlistener*/

	//Windows resized to desktop läge
	window.addEventListener('resize', resizeDesktop);
}); //windows.load

function callAfter(key){
	//console.log("Current users key outside: " + key);
	//Updating users name
	var inputUserName = document.getElementById('uName');
	var uName = inputUserName.value;
    inputUserName.value = "";
    	if (uName != "") {
    		firebase.database().ref('users/' + key + '/name').set(uName);
    		currentUser.name = uName;
    	}
    //Updating users age
    var uAge = document.getElementById('uAge').value;
    document.getElementById('uAge').value = "";
    	if (uAge != "") {
    		firebase.database().ref('users/' + key + '/age').set(uAge);
    		currentUser.age = uAge;
    	}
    //Updating users city
    var uCity = document.getElementById('uCity').value;
    document.getElementById('uCity').value = "";
    	if (uCity != "") {
    		firebase.database().ref('users/' + key + '/city').set(uCity);
    		currentUser.city = uCity;
    	}
    //Updating gender info
	var e = document.getElementById("selectGender");
	var value = e.options[e.selectedIndex].value;
	//console.log("Users gender: " + value);
       if (value != "") {
    		firebase.database().ref('users/' + key + '/gender').set(value);
    		currentUser.gender = value;
    	}
    var moreInfoProfile = document.getElementById('moreInfoProfile');
	moreInfoProfile.style.display = "none";
	updateAccountPage()
}//end of function callAfter

//Push user object into firebase
function pushUserIntoFirebase(userO){


	//console.log("Logged in user: " + userO);
	//console.log("Logged in user email: " + userO.email);
	var displayName = userO.displayName;
	var email = userO.email;
	var uid = userO.uid;
	var photoUrl = userO.photoURL;
	
	//console.log("Email: " + email);

	if(email==null){
		logOut();
		errorMessage = document.getElementById("errorMessage");
		errorMessage.style.display = "block";
	} else {

			//Checks if user already exist in the DB
			db.ref('users/').once('value', function(snapshot) {
				let data = snapshot.val();
				for(let child in data){
					let r = data[child];
					//console.log("remail: " + r.email);
					//console.log("userO.email: " + userO.email);
					if(r.email == userO.email){
						//console.log("remail: " + r.email);
						
						//console.log("userO.email: " + userO.email);
						//console.log('User exist is set to true');
						userExist = true;
						currentUser.name = r.name;
						currentUser.email = r.email;
						currentUser.uid = r.uid;
						currentUser.photoUrl = r.photoUrl;
						currentUser.age = r.age;
						currentUser.city = r.city;
						currentUser.memberDate = r.memberDate;
						currentUser.gender = r.gender;
						currentUser.key = r.key;
					} //end of if else
				}//end of for
				callLater();
			})//end of db.ref

	} //end of else
	function callLater() {
		if (userExist == false){
			//console.log('User exist is set to false');
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
		        gender: "",
		        key: ""
		      }//end of obj
				currentUser.name = newUser.name;
				currentUser.email = newUser.email;
				currentUser.uid = newUser.uid;
				currentUser.photoUrl = newUser.photoUrl;
				currentUser.age = newUser.age;
				currentUser.city = newUser.city;
				currentUser.memberDate = newUser.memberDate;
				currentUser.gender = newUser.gender;
		      //Adding new user into the DB
		      var userKey = db.ref('users/').push(newUser).key;
		      //console.log("Users key recieved: " + userKey);
		      firebase.database().ref('users/' + userKey + '/key').set(userKey);
		      currentUser.key = userKey;

		      	//First time edit prfile info page shows up
			    /*var moreInfoProfile = document.getElementById('moreInfoProfile');
		    	moreInfoProfile.style.display = "block";
		    	var inputUserName = document.getElementById('uName');
		 		inputUserName.placeholder = currentUser.name;*/
	    }//end of if
	    
	    
	    gotoTimerPage();
	    updateAccountPage();
	    //Show additional user info window for first time user
	    

	}//end of callLater
}//end of pushUserInfoIntoFirebase

function gotoTimerPage(){

	var containerLogin = document.getElementsByClassName("containerLogin")[0];
	var navContainer = document.getElementsByClassName("navContainer")[0];
	navContainer.style.display = 'block';
	containerLogin.style.display = 'none';

	 var screenWidth = document.documentElement.clientWidth;

	 if (screenWidth > 501) {
	 	var routePage = document.getElementsByClassName("containerRoute")[0];
		routePage.style.display = "flex";
	 } else {
		var timerPage = document.getElementsByClassName("containerTimer")[0];
		timerPage.style.display = "flex";
	}

	if (userExist==false) {
		var moreInfoProfile = document.getElementById('moreInfoProfile');
		 moreInfoProfile.style.display = "block";
		 var inputUserName = document.getElementById('uName');
		inputUserName.placeholder = currentUser.name;
	}
	
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
	let profileAge = document.getElementsByClassName("dynamic")[0];
	let profileGender = document.getElementsByClassName("dynamic")[1];
	let profileSince = document.getElementsByClassName("dynamic")[2];
	let profilePicture = document.getElementById("profilePicture");
	let profileName = document.getElementsByClassName("profileName")[0];
	let profileLocation = document.getElementsByClassName("profileLocation")[0];
	let locationCity = document.getElementById("locationCity");
  	profilePicture.src = currentUser.photoUrl;
		profileName.innerText = currentUser.name;

		/** SETS USER INFO DESKTOP **/
		let nameDesktop = document.getElementById("nameDesktop");
		let imgDesktopNav = document.getElementById("imgDesktopNav");

		nameDesktop.innerHTML = currentUser.name;
		imgDesktopNav.src = currentUser.photoUrl;

	/******************************************/

	if(currentUser.gender != ""){
		var gender = currentUser.gender;
		profileGender.innerText = gender;
	}
	if(currentUser.age != 0){
		var age = currentUser.age;
		profileAge.innerText = age;
	}
	if(currentUser.city != ""){

		locationCity.innerText = currentUser.city;

		var markerLocation = document.getElementById('markerLocation');
	    markerLocation.style.display = "block";
	}

	var mdate =  currentUser.memberDate;
	profileSince.innerText = mdate;

}//end of updateAccountPage

function updateEditAccountPage(){
	var picUser = document.getElementById('pic2');
  	picUser.src = currentUser.photoUrl;
  	//console.log("hhhhh");
}

function logOut(){
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

				var containerPrestation = document.getElementsByClassName("containerPrestation")[0];

				containerPrestation.style.display = 'none';

				var moreInfoProfile = document.getElementById('moreInfoProfile');

	    		moreInfoProfile.style.display = "none";



				currentUser = {
					name: "",
					email: "",
					uid: "",
					photoUrl: "",
					age: 0,
					city: "",
					memberDate: "",
					gender: "",
					key: "",
					totalLength: 0,
					longestRun: 0
				};


			}).catch(function(error) {
			  //console.log('Error sign out: ' + error);
			});

			var inputUserAge = document.getElementById('uAge2');
	    	inputUserAge.placeholder = "Ålder";
	    	var inputUserCity = document.getElementById('uCity2');
	    	inputUserCity.placeholder = "Plats";


}

function resizeDesktop(){
	let conLogin = document.getElementsByClassName("containerLogin")[0];
	let conTimer = document.getElementsByClassName("containerTimer")[0];
	let conPres = document.getElementsByClassName("containerPrestation")[0];
	let conRoute = document.getElementsByClassName("containerRoute")[0];
	let conCom = document.getElementsByClassName("containerCommunity")[0];
	let conProfile = document.getElementsByClassName("containerProfile")[0];

	var screenWidth = document.documentElement.clientWidth;
	var displayValue = conProfile.style.display;
	var displayValuePres = conPres.style.display;

	 if (screenWidth > 501 && displayValuePres=="flex" && currentUser.name!="") {
	 	//console.log("Desktop screen Läge");
	 	//var routePage = document.getElementsByClassName("containerRoute")[0];
		//routePage.style.display = "flex";

		conLogin.style.display = "none";
		conTimer.style.display = "none";
		conPres.style.display = "flex"
		conRoute.style.display = "none";
		conCom.style.display = "none";
		conProfile.style.display = "flex";
	 } 

	 if (screenWidth > 501 && displayValue=="flex" && currentUser.name!="") {
	 	//console.log("Desktop screen Läge");
	 	//var routePage = document.getElementsByClassName("containerRoute")[0];
		//routePage.style.display = "flex";

		conLogin.style.display = "none";
		conTimer.style.display = "none";
		conPres.style.display = "flex"
		conRoute.style.display = "none";
		conCom.style.display = "none";
		conProfile.style.display = "flex";
	 } 

	 
	 if (screenWidth <= 501 && displayValuePres=="flex") {
	 	//console.log("Desktop screen Läge");
	 	//var routePage = document.getElementsByClassName("containerRoute")[0];
		//routePage.style.display = "flex";

		conLogin.style.display = "none";
		conTimer.style.display = "none";
		conPres.style.display = "flex"
		conRoute.style.display = "none";
		conCom.style.display = "none";
		conProfile.style.display = "none";
	 } 
}

function getRunInfo(){
	//var runArray = [];
	//Getting current users running data from DB
	/*
	db.ref('rundor/').once('value', function(snapshot) {
		let data = snapshot.val();
		for(let child in data){
			let r = data[child];
			//console.log('r.uid: ' + r.uid);
			//console.log('userO.uid: ' + userO.uid);
			if(r.user == currentUser.uid){
				//removing km from string
				var str = r.length;
				//str = str.substring(0, str.length - 2);
				var number = parseInt(str);
				var fullNumber = Math.round(number);
				//console.log(number);
				runArray.push(fullNumber);
				//console.log(number);
				runArray.push(number);
			} //end of if else
		}//end of for
		console.log("runArray: " + runArray);
		if (runArray != []) {
				totalRun = runArray.reduce((a, b) => a + b, 0);
				var longestRun = runArray.reduce(function(a, b) {
		    		return Math.max(a, b);
				});
				//longestRun = Math.max(runArray);
				console.log("Longest run: " + longestRun);
				console.log("Total run: " + totalRun);
				console.log("Longest run: " + longestRun);
				var runLength = document.getElementById('length');
				var length = "Total löplängd: " + totalRun + "km";
				runLength.innerText = length;
				var longRun = document.getElementById('totalLength');
				var longestLength = "Längst sträcka: " + longestRun + "km";
				longRun.innerText = longestLength;
		}//end of if
	})//end of db.ref*/


			/*var runLength = document.getElementById('length');
			runLength.innerText = "Total löplängd: " + 5 + "km";;
			var longRun = document.getElementById('totalLength');
			var longestLength = "Längst sträcka: " + 5 + "km";
			longRun.innerText = longestLength;*/


}
