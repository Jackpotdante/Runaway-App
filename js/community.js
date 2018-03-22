window.addEventListener('load', function(event){


  /*** HÄMTAR ALLA USERS ***/
   let users=[];
   db.ref('/users').on('child_added', function(snapshot , prevChildKey) {
     let snaps = snapshot.val();
     users.push(snaps);
   });

/*** SENDS MESSAGE TO DATABASE ***/
  function sendMessage(){
    let inputMessage = document.getElementById("inputMessage").value; // Input
    let timeFix = function(){
        var currentTime = new Date(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes();
        var timeSent = hours + ":" + minutes;
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
        return hours + ":" + minutes;
      }


    var pushedRef = firebase.database().ref('/message').push({'message' : inputMessage, 'time': timeFix() , 'namn' : currentUser.name, "UID" : currentUser.uid, "photo" : currentUser.photoUrl});

    document.getElementById("inputMessage").value = " ";
  };





/** SENDS MESSAGE **/

  let sendBtn = document.getElementById("sendBtn");
  let sendInput = document.getElementById("inputMessage");

  sendBtn.addEventListener('click', function(event){
    if(sendInput.value == ""){
      console.log("Empty input");
    }else{
      sendMessage();
      console.log("Message sent");
    }

  });

  sendInput.addEventListener('keypress', function (e) {
      var key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        if(sendInput.value == ""){
          console.log("Empty input");
        }else{
          sendMessage();
          console.log("Message sent");
        }
      }
  });

/*** KEEPS CHATT SCROLL AT BOTTOM AS STANDARD ***/
  function updateScroll() {
          let ele = document.getElementsByClassName("chatt")[0];
          ele.scrollTop= ele.scrollHeight;
  }

/*** CREATE MESSAGE ***/
function createMessage(name, message , time, photo){
  let containerChatt = document.getElementsByClassName("chatt")[0];


  const conHead = document.createElement("div");
  const conMain = document.createElement("div");
  const conTime = document.createElement("div");
  const containerM = document.createElement("div");
  const imageM = document.createElement("img");
  const nameM = document.createElement("p");
  const messageM = document.createElement("p");
  const timeM = document.createElement("p");

  nameM.innerHTML = name;
  messageM.innerHTML = message;
  timeM.innerHTML = time;
  imageM.src = photo;

  conTime.className = "containerTime";
  conHead.className = "containerHead";
  conMain.className = "containerMain";
  containerM.className = "containerMessage";
  imageM.className = "imageMessage";
  nameM.className = "nameMessage";
  messageM.className = "mainMessage";
  timeM.className = "timeMessage";

  containerChatt.appendChild(containerM);
  containerM.appendChild(conHead);
  containerM.appendChild(conMain);
  containerM.appendChild(conTime);
  conHead.appendChild(imageM);
  conHead.appendChild(nameM);
  conMain.appendChild(messageM);
  conTime.appendChild(timeM);

}

db.ref('/message').on('child_added', function(snapshot , prevChildKey) {
  let snap= snapshot.val();
  let nameMe = snap.namn;
  let timeMe = snap.time;
  let messageMe = snap.message;
  let photoMe = snap.photo;
  createMessage(nameMe, messageMe, timeMe, photoMe);
    updateScroll();

});



let containerCards = document.getElementsByClassName("containerCards")[0];
let getMembers = function(){
  containerCards.innerHTML = " ";
  for(let i = 0; i < users.length; i++){
    let nameCard = users[i].name;
    let ageCard = users[i].age;
    let locationCard = users[i].city;
    let distance = users[i].stats.totalLength;
    let run = users[i].stats.longestRun;
    let photoCard = users[i].photoUrl;
    createMembers(nameCard, ageCard, photoCard, locationCard, distance, run);

  }
}
let inputSearch = document.getElementById('searchMembers');
/***FEL KOLLA ***/
inputSearch.addEventListener('keyup', function(event){
  containerCards.innerHTML = " ";
  var keyword = inputSearch.value.toUpperCase();
  var filtered_data = users.filter(function(item) {
      return item.name.toUpperCase().includes(keyword);
    });
    function newSearch(){
        for(let i = 0; i < 5 ; i++){
          if(filtered_data[i] != undefined){
            let nameCard = filtered_data[i].name;
            let ageCard = filtered_data[i].age;
            let locationCard = filtered_data[i].city;
            let distance = "25";
            let run = "10";
            let photoCard = filtered_data[i].photoUrl;
            createMembers(nameCard, ageCard, photoCard, locationCard, distance, run);
          }
        }
      }
    newSearch();
  });




/*** CREATE MEMEBERS ***/
function createMembers(name, age, img, location, distance, run){
  let containerCards = document.getElementsByClassName("containerCards")[0];

  /** ALL CONTAINERS FOR CARD **/
  const memberCard = document.createElement("div");
  const headCard = document.createElement("div");
  const headInfo = document.createElement("div");
  const distanceCard = document.createElement("div");
   /** CONTENT OF CONTAINERS **/
   const imgCard = document.createElement("img");
   const nameCard = document.createElement("p");
   const locationCard = document.createElement("p");
   const totalDistance = document.createElement("p");
   const longestRun = document.createElement("p");

   nameCard.innerHTML = name + " , " + age;
   locationCard.innerHTML = `<i class="fas fa-map-marker-alt" id="iconLocation"></i>` + location;
   totalDistance.innerHTML = "Total distance: " + distance + "km";
   longestRun.innerHTML = "Longest run: " + run + "km";
   imgCard.src = img;


   memberCard.className = "memberCard";
   headCard.className = "headCard";
   imgCard.className = "imgCard";
   headInfo.className ="headInfo";
   distanceCard.className ="distanceCard";
   nameCard.className = "nameCard";
   locationCard.className ="locationCard";
   totalDistance.className = "totalDistance";
   longestRun.className = "longestRun";

   containerCards.appendChild(memberCard);
   memberCard.appendChild(headCard);
   memberCard.appendChild(distanceCard);
    headCard.appendChild(imgCard);
   headCard.appendChild(headInfo);
   headInfo.appendChild(nameCard);
   headInfo.appendChild(locationCard);
   distanceCard.appendChild(totalDistance);
   distanceCard.appendChild(longestRun);


}
/*** TOOGLE MEMBERS ***/
 let toggleMembers = document.getElementById("toggleMembers");

 toggleMembers.addEventListener('click', function(event){
   document.getElementsByClassName("chatt")[0].style.display = "none";
   document.getElementById("toggleMembers").style.visibility= "hidden";
   document.getElementById("toggleChat").style.visibility= "visible";
   document.getElementsByClassName("send")[0].style.display = "none";
   document.getElementsByClassName("containerMembers")[0].style.display = "flex";
   document.getElementsByClassName("navContainer")[0].style.display = "none";
   getMembers();

 });

 toggleChat.addEventListener('click', function(event){
   document.getElementsByClassName("chatt")[0].style.display = "flex";
   document.getElementById("toggleMembers").style.visibility= "visible";
   document.getElementById("toggleChat").style.visibility= "hidden";
   document.getElementsByClassName("send")[0].style.display = "flex";
    document.getElementsByClassName("navContainer")[0].style.display = "block";
    document.getElementsByClassName("containerMembers")[0].style.display = "none";
 });

 communityDesktop.addEventListener('click', function(event){
   getMembers();
   updateScroll();
 });



/**WINDOW LOAD**/
})
