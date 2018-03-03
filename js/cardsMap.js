
// Hämtar hem alla användare från databas.
let allUsers = ""
db.ref("/users").once("value").then(function(snapshot){
  allUsers = snapshot.val();
  console.log(allUsers);

});
//----------------------------END --------------------------------------------//

// Hämtar hem alla sträckor från databas. ------------------------------------>>
let runningTracks="";
db.ref("/statrundor").once("value").then(function(snapshot){
  runningTracks = snapshot.val();

});
//----------------------------END --------------------------------------------//



// Hämtar hem alla resultat från databas. ------------------------------------>>
let allResults=""
db.ref("/rundor").once("value").then(function(snapshot){
  allResults = snapshot.val();
  console.log("rundor laddade");

});
//----------------------------END --------------------------------------------//





//------------------------------ Window LOAD --------------------------------->>
window.addEventListener("load", function(){
  let btnToggleTracks = document.getElementById('btnToggleTracks')
  let wrapperTracks = document.getElementsByClassName('wrapper-Tracks')[0];
  btnToggleTracks.addEventListener('click',function(){
    if(btnToggleTracks.innerHTML=="Hide Tracks"){
      wrapperTracks.style.display="none";
      console.log("hide");

      btnToggleTracks.innerHTML="Show Tracks"
    }else{
      wrapperTracks.style.display="flex";
      btnToggleTracks.innerHTML="Hide Tracks"
      console.log("show");
    }
  })


  let btnLoadTracks = document.getElementById('loadTracks');
  btnLoadTracks.addEventListener('click',function(event){
    getTracks("Skatås");

  })
  //saveRoundToDb();
}) // --------------------------- window load End ---------------------------//


// Filtrerar ut alla platser ------------------------------------------------->>
let getTracks = (location)=>{
  let tracks = [];
  for(track in runningTracks){
    if(runningTracks[track].place==location){
      tracks.push(runningTracks[track])
    }
  }
  makeCards(tracks,location);
}

//--------- SKAPAR KORT AV ALLA BANOR ---------------------------------------->>
let makeCards = (tracks,location)=>{
  let wrapperTracks = document.getElementsByClassName('wrapper-Tracks')[0];
  wrapperTracks.innerHTML="";
  let cardHeader = document.createElement('h2');
  let cardUl = document.createElement('ul');

  //cardHeader.innerHTML = `${location}<br/>`;
  wrapperTracks.appendChild(cardHeader);
  cardUl.className="cardHolder";

  tracks.map(item => {
    let cardLi = document.createElement("li");
    cardLi.innerHTML = `<div class="cardMain">
                          <h3>${item.length}km <i class="far fa-star star"></i> 7.5 </h3>
                          <div class="toggle"><img height="10%" width="100%" src="https://firebasestorage.googleapis.com/v0/b/runaway-project.appspot.com/o/skor.jpg?alt=media&token=fe1004a8-43b4-4ff2-9214-298ac7fd99f1" alt="skor"></div>
                          <p>Info: ${item.info}</p>
                          <div class="divForBtnInCard">
                            <button class="btnShowInfoTrack">Visa Info</button>
                            <button class="btnGoToTimer">Start Run</button>
                          </div>
                        </div>
                        <div class="innerContainerResults toggle">
                          <h3>Resultat</h3>
                        </div>
                        <div class="innerContainerComments toggle">
                          <h3>Kommentarer</h3>
                        </div>

                       `;
    let btnShowInfoTrack = cardLi.getElementsByClassName('btnShowInfoTrack')[0];
    let btnGoToTimer = cardLi.getElementsByClassName('btnGoToTimer')[0];

    let showCard = true;
    btnShowInfoTrack.addEventListener('click',function(event){
      let range ="";
      let slideSetup =""; //sätter upp hastighet på rezise av li elementen
      if(showCard){
        event.target.innerHTML="Dölj Info"
        range = "1000px";
        slideSetup = "max-height 1s cubic-bezier(0.76, 0.57, 1, 0.72)";
        showCard = !showCard
      }else{
        event.target.innerHTML="Visa Info"
        slideSetup = "max-height 1s cubic-bezier(0.34, 0.94, 0.89, 0.54)";
        range = "0px";
        showCard = !showCard
      }
      let card = event.target.parentNode.parentNode.parentNode;
      let toggle = card.getElementsByClassName('toggle');

      for(i=0; i<toggle.length;i++){
        toggle[i].style.transition = slideSetup;
        toggle[i].style.maxHeight = range;
      }

    })

    btnGoToTimer.addEventListener('click', function(event){
      console.log("Gå till TimerSite");
    })

    let comments = findCommentsOfTrack(item.trackid);
    cardLi.getElementsByClassName('innerContainerComments')[0].appendChild(comments);

    let result = findResultsOfTrack(item.trackid);
    cardLi.getElementsByClassName('innerContainerResults')[0].appendChild(result);

    cardUl.appendChild(cardLi);
  })

  wrapperTracks.appendChild(cardUl);

}

//----------------------- END ------------------------------------------------//


// ------------------- SPARA BANA TILL DATABAS ------------------------------->>
let saveTrackToDb =()=>{
  let newPostKey = db.ref("statrundor").push().key;
  let track = {
    id: newPostKey,
    length: 15,
    place: "Skatås",
    type: "Terräng",
    info: "Med en höjdskillnad på 100m gör denna till en utmanande slinga"
  }
  db.ref(`/statrundor/${newPostKey}/`).set(track)
}
//----------------------- END ------------------------------------------------//

// ------------------- SPARA Runda TILL DATABAS ------------------------------->>
let saveRoundToDb =()=>{
  //let newPostKey = db.ref("rundor").push().key;
  let track = {
    comment: "En jäkligt jobbig bana",
    date: 20180301,
    length: "2km",
    place: "Skatås",
    rating: 5,
    share: true,
    time: 23.50,
    trackid: "-L6LjaTNyYJcMyDp40cM",
    user: "qQb6a9XJyhUPnpayyyh652Azc7j2"
  }
  db.ref(`/rundor/`).push(track)
}
//----------------------- END ------------------------------------------------//


//-----  FILTRERA UT KOMMENTARER PÅ INSKICKAD BANA OCH RETUNERAR UL LISTA ---->>

let findCommentsOfTrack=(trackid)=>{
  let foundedTracks = [];
  for(track in allResults){  // Pushar ner banor som matchar till listan
    if(allResults[track].trackid == trackid && allResults[track].share){
      foundedTracks.push(allResults[track])
    }
  }


  foundedTracks.sort(function(a,b){  //Sorterar allar rundor på tid
    return a.date - b.date;
  })

  let ulComment = document.createElement("ul");
  ulComment.className="trackComments toggle";
  foundedTracks.map(track=>{
    let liComment = document.createElement("li");
    let user = findUser(track.user);
    liComment.innerHTML=`<div>
                          <img src=${user.photoUrl}>
                          <p>${user.name} #${track.rating}</p>
                          <p>${track.comment}</p>
                        </div>`
    ulComment.appendChild(liComment);
  })

  return ulComment
}
//------------------------  END ----------------------------------------------//



//---  FILTRERAR UT ALLA RESULTAT PÅ AKUTELL BANA OCH RETUNERAR UL LISTA  ---->>

let findResultsOfTrack=(trackid)=>{
  let foundedTracks = [];
  for(track in allResults){  // Pushar ner banor som matchar till listan
    if(allResults[track].trackid == trackid && allResults[track].share){
      foundedTracks.push(allResults[track])
    }
  }

  foundedTracks.sort(function(a,b){  //Sorterar allar rundor på datum för att kommentarer skall komma i ordning.
    return a.time - b.time;
  })

  let ulResult = document.createElement('ul');
  ulResult.className="trackResult toggle";

  foundedTracks.map(track=>{
    let user = findUser(track.user);
    let liResults = document.createElement('li');

    liResults.innerHTML=`<div>
                          <img src=${user.photoUrl}>
                          <p>${user.name}</p>
                          <p>${track.time}min</p>
                        </div>`
    ulResult.appendChild(liResults);
  })

  return ulResult
}
//------------------------  END ----------------------------------------------//



//-------------  LETAR RÄTT PÅ ANVÄNDARE I DATABASEN  ------------------------>>
let findUser=(userUId)=>{
  let selectedUser ="";
  for(user in allUsers){
    if (allUsers[user].uid == userUId) {
      selectedUser=user;
    }
  }
  return allUsers[selectedUser]
}
//------------------------  END ----------------------------------------------//
