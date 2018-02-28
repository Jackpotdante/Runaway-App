


// Hämtar hem alla sträckor från databas.
let runningTracks="";
db.ref("/statrundor").once("value").then(function(snapshot){
  runningTracks = snapshot.val();
  getTracks("Skatås");
});


window.addEventListener("load", function(){


})


// Filtrerar ut alla platser
let getTracks = (location)=>{
  let tracks = [];
  for(track in runningTracks){
    if(runningTracks[track].place==location){
      tracks.push(runningTracks[track])
    }
  }
  makeCards(tracks,location);
}


let makeCards = (tracks,location)=>{
  let containerRoute = document.getElementsByClassName('containerRoute')[0];
  let cardHeader = document.createElement('h2');
  cardHeader.innerText = location;
  containerRoute.appendChild(cardHeader);
  let cardUl = document.createElement('ul');
  cardUl.className="cardHolder";

  tracks.map(item => {
    let cardLi = document.createElement("li");
    cardLi.innerHTML = `<div class="cardMain">
                          <p><h3>Längd: ${item.length}km </h3></p>
                          <p>Info: ${item.info}</p>
                          <button>Resultat</button>
                          <button>Start Run</button>
                        </div>
                        <div class="cardMenu">
                          <div>
                            <i class="far fa-star star"></i>
                            <i class="far fa-comment-alt comment"></i>
                          </div>
                        </div>
                       `;
    cardUl.appendChild(cardLi)
  })

  containerRoute.appendChild(cardUl);

}

let saveTrackToDb =()=>{
  let track = {
    length: 10,
    place: "Skatås",
    type: "Terräng",
    info: "Med en höjdskillnad på 100m gör denna till en utmanande slinga"

  }
  db.ref("/statrundor").push(track)

}
