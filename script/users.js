//Global variables
var currentUser = {};


// Initialize Firebase
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

//facebook provider object
var provider = new firebase.auth.FacebookAuthProvider();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
        console.log('onAuthStateChanged: user is signed in', user);

        //gotoAccountPage(user);
        console.log('User is logged in outside load');
        gotoAccountPage(user);


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

	  	 //To sign in with a pop-up window, call signInWithPopup
		      firebase.auth().signInWithPopup(provider).then(function(result) {
		        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
		        var token = result.credential.accessToken;
		        console.log('Token: ' + token);
		        // The signed-in user info.
		        var user = result.user;
		        //console.log('User info: ' + user) 

		        //gotoAccountPage(user);
		        console.log('User is logged in inside load');
		        currentUser = user;
		        gotoAccountPage(user);
		        pushUserIntoFirebase(user);
		        


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

				var wrapUsersMob = document.getElementById('containerLoginMob');
				var wrapUsersDesk = document.getElementById('containerLoginDesk');

				var screenWidth = document.documentElement.clientWidth;

				console.log('Current screen width: ' + screenWidth);
				if (screenWidth <= 400) {
					
					wrapUsersMob.style.display = 'block';
				} else {
					
					wrapUsersDesk.style.display = 'block';
				}

				currentUser = {};


			}).catch(function(error) {
			  console.log('Error sign out: ' + error);
			});


	 }) //end of btnSignOut eventlistener


}); //windows.load


//changing into profile page page
function gotoAccountPage(userObj){

	var wrapUsersMob = document.getElementById('containerLoginMob');
	var wrapUsersDesk = document.getElementById('containerLoginDesk');
	var wrapProfile = document.getElementById('containerProfil');

	wrapProfile.style.display = 'block';
    //console.log(userObj);

	wrapUsersMob.style.display = 'none';

	wrapUsersDesk.style.display = 'none';


}//end of gotoAccountPage

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

	//Creating user object
      const newUser = {
        name: displayName,
        email: email,
        uid: uid,
        photoUrl: photoUrl 
      }
      console.log(newUser);

      //Adding new user into the DB
      db.ref('users/').push(newUser);

}

