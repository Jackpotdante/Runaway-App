window.addEventListener('load', function(event){




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

  sendBtn.addEventListener('click', function(event){
    sendMessage();
    console.log("Message sent");
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
  console.log(snap);
  let nameMe = snap.namn;
  let timeMe = snap.time;
  let messageMe = snap.message;
  let photoMe = snap.photo;
  createMessage(nameMe, messageMe, timeMe, photoMe);
    updateScroll();

});
/*** TOOGLE MEMBERS ***/
 let toggleMembers = document.getElementById("toggleMembers");

 toggleMembers.addEventListener('click', function(event){
   document.getElementsByClassName("chatt")[0].style.display = "none";
   document.getElementById("toggleMembers").style.visibility= "hidden";
   document.getElementById("toggleChat").style.visibility= "visible";
   document.getElementsByClassName("send")[0].style.display = "none";
 });

 toggleChat.addEventListener('click', function(event){
   document.getElementsByClassName("chatt")[0].style.display = "flex";
   document.getElementById("toggleMembers").style.visibility= "visible";
   document.getElementById("toggleChat").style.visibility= "hidden";
   document.getElementsByClassName("send")[0].style.display = "flex";
 });

/*** HÄMTAR ALLA USERS ***/
 let runningTracks="";
 db.ref("/statrundor").once("value").then(function(snapshot){
   runningTracks = snapshot.val();

 });
/**WINDOW LOAD**/
})
