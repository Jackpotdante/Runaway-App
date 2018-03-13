
/*** CONFIG ***/

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


/*** MAKE CARD WHEN LOCATION IS PRESSED ***/



window.addEventListener('load', function(event){




/*** ROUTING BETWEEN PAGES MOBILE***/

let timerBtn = document.getElementById("timerBtn");
let presBtn = document.getElementById("presBtn");
let routeBtn = document.getElementById("routeBtn");
let comBtn = document.getElementById("comBtn");
let profileBtn = document.getElementById("profileBtn");

let conLogin = document.getElementsByClassName("containerLogin")[0];
let conTimer = document.getElementsByClassName("containerTimer")[0];
let conPres = document.getElementsByClassName("containerPrestation")[0];
let conRoute = document.getElementsByClassName("containerRoute")[0];
let conCom = document.getElementsByClassName("containerCommunity")[0];
let conProfile = document.getElementsByClassName("containerProfile")[0];
let sendBar = document.getElementsByClassName("send")[0];

timerBtn.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "flex";
  conPres.style.display = "none"
  conRoute.style.display = "none";
  conCom.style.display = "none";
  conProfile.style.display = "none";
});

presBtn.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "none";
  conPres.style.display = "flex"
  conRoute.style.display = "none";
  conCom.style.display = "none";
  conProfile.style.display = "none";
});

routeBtn.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "none";
  conPres.style.display = "none"
  conRoute.style.display = "flex";
  conCom.style.display = "none";
  conProfile.style.display = "none";
});

comBtn.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "none";
  conPres.style.display = "none"
  conRoute.style.display = "none";
  sendBar.style.display = "flex;"
  conCom.style.display = "flex";
  conProfile.style.display = "none";
});

profileBtn.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "none";
  conPres.style.display = "none"
  conRoute.style.display = "none";
  conCom.style.display = "none";
  conProfile.style.display = "flex";
});


/** ROUTING BETWEEN PAGES DESKTOP **/
let mapDesktop = document.getElementById("mapDesktop");
let achDesktop = document.getElementById("achDesktop");
let communityDesktop = document.getElementById("communityDesktop");

mapDesktop.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "none";
  conPres.style.display = "none"
  conRoute.style.display = "flex";
  conCom.style.display = "none";
  conProfile.style.display = "none";
});


achDesktop.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "none";
  conPres.style.display = "flex"
  conRoute.style.display = "none";
  conCom.style.display = "none";
  conProfile.style.display = "flex";
});

communityDesktop.addEventListener('click', function(event){
  conLogin.style.display = "none";
  conTimer.style.display = "none";
  conPres.style.display = "none"
  conRoute.style.display = "none";
  conCom.style.display = "flex";
  conProfile.style.display = "none";
});




/*** WINDOW LOAD**/

});
