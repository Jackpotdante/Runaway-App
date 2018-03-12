
// Hämtar hem alla användare från databas.
let allUsers = ""
db.ref("/users").once("value").then(function(snapshot){
  allUsers = snapshot.val();


});
//----------------------------END --------------------------------------------//

// Hämtar hem alla statiska sträckor från databas. --------------------------->>
let runningTracks="";
db.ref("/statrundor").once("value").then(function(snapshot){
  runningTracks = snapshot.val();

});
//----------------------------END --------------------------------------------//



// Hämtar hem alla resultat från databas. ------------------------------------>>
let allResults=""
db.ref("/rundor").once("value").then(function(snapshot){
  allResults = snapshot.val();


});
//----------------------------END --------------------------------------------//







// Filtrerar ut alla platser och skapar kort --------------------------------->>
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

  let cardUl = document.createElement('ul');

  wrapperTracks.innerHTML="";

  cardUl.className="cardHolder";

  tracks.map(item => {
    let cardLi = document.createElement("li");
    cardLi.innerHTML = `<div class="cardHeader">
                          <span> &#128095 ${item.length}km </span>
                          <span> ${item.name} </span>

                        </div>

                        <div class="cardMain">
                          <div class="toggle"><img height="10%" width="100%" src="https://firebasestorage.googleapis.com/v0/b/runaway-project.appspot.com/o/skor.jpg?alt=media&token=fe1004a8-43b4-4ff2-9214-298ac7fd99f1" alt="skor"></div>
                          <p>${item.info}</p>
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

    let stars = countStars(countRatingOfTrack(item.trackid)); //Räknar fram medelvärde av rating samt returenera span med stjärnor.
    cardLi.getElementsByClassName('cardHeader')[0].appendChild(stars);


    // eventListener för kapp att visa track information.
    let showCard = true;
    btnShowInfoTrack.addEventListener('click',function(event){
      let range ="";
      let slideSetup =""; //sätter upp hastighet på rezise av li elementen

      if(showCard){
        event.target.innerHTML="Dölj Info"
        range = "1000px";
        slideSetup = "max-height 1s cubic-bezier(0.76, 0.57, 1, 0.72)";
      }else{
        event.target.innerHTML="Visa Info"
        slideSetup = "max-height 1s cubic-bezier(0.34, 0.94, 0.89, 0.54)";
        range = "0px";
      }
      showCard = !showCard

      let card = event.target.parentNode.parentNode.parentNode;
      let toggle = card.getElementsByClassName('toggle');

      for(i=0; i<toggle.length;i++){
        toggle[i].style.transition = slideSetup;
        toggle[i].style.maxHeight = range;
      }

    }) // end

    // eventListener för knapp för att gå till timersidan
    btnGoToTimer.addEventListener('click', function(event){
      console.log(item.trackid);
      currentUser.trackid= item.trackid;
      document.getElementsByClassName('infoTrack')[0].innerText = "Vald bana: "+ runningTracks[item.trackid].name + " Längd: "+ runningTracks[item.trackid].length+"km";
      document.getElementsByClassName('containerTimer')[0].style.display = "flex";
      document.getElementsByClassName('containerRoute')[0].style.display= "none";
    }) // end

    let comments = findCommentsOfTrack(item.trackid);
    cardLi.getElementsByClassName('innerContainerComments')[0].appendChild(comments);

    let result = findResultsOfTrack(item.trackid);
    cardLi.getElementsByClassName('innerContainerResults')[0].appendChild(result);

    cardUl.appendChild(cardLi);
  }) // end av map kort

  wrapperTracks.appendChild(cardUl);

}

//----------------------- END ------------------------------------------------//


// ------------------- SPARA BANA TILL DATABAS ------------------------------->>
let saveTrackToDb =()=>{
  let newPostKey = db.ref("statrundor").push().key;
  let track = {
    trackid: newPostKey,
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

  let totalRating = 1;
  let numberOfTracks = 0;
  let trackRating = 0;

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



//------------------------  Räknar fram rating på inskickad bana ------------->>
let countRatingOfTrack=(trackid)=>{
  let foundedTracks = [];
  for(track in allResults){  // Pushar ner banor som matchar till listan
    if(allResults[track].trackid == trackid && allResults[track].share){
      foundedTracks.push(allResults[track])
    }
  }

  let totalRating = 0;
  let numberOfTracks = 0;
  let trackRating = 0;
  foundedTracks.map(track =>{
    numberOfTracks++;
    totalRating += track.rating;
    trackRating = totalRating/numberOfTracks;

  });

  return trackRating;
}
// ------------------------- Retunerar ul lista ------------------------------//

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
                          <p>${convertToTime(track.time)}</p>
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


//------------------- Skicka in antal stjärnor som ska vara gula ------------->>
let countStars=(numberOfStars)=>{
  let newSpan = document.createElement('span');
  numberOfStars = Math.round(numberOfStars);
  for(i=1;i<=5; i++){
    if(i<=numberOfStars){
      newSpan.innerHTML+=`<i style="color:#FF2BE6;" class="fas fa-star fa-xs"></i>`;
    }else {
      newSpan.innerHTML+=`<i class="far fa-star fa-xs"></i>`;
    }
  }
  newSpan.className ="rating";
  return newSpan;
}

//------------------- END ---------------------------------------------------//


//-------------  Räknar ut tid och skickar tillbaka en sträng ----------------->
let convertToTime=(time)=>{
  let elapsedTimeHours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let elapsedTimeMinutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  let elapsedTimeSecounds = Math.floor((time % (1000 * 60)) / 1000);
  return elapsedTimeHours+"h"+elapsedTimeMinutes+"m"+elapsedTimeSecounds+"s";
}

//----------------------END --------------------------------------------------//
