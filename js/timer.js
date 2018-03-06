

window.addEventListener('load',function(event){
  let btnClock = document.getElementById('btnClock');
  let infoSelectedTrack = document.getElementsByClassName('infoTrack')[0];

  btnClock.addEventListener('click',function(){
    if(currentUser.hasOwnProperty("trackid")){
      saveRoundToDbTimer();
    }
  })
  infoSelectedTrack.innerText = "Ingen vald bana";

});


let saveRoundToDbTimer =()=>{
  //let newPostKey = db.ref("rundor").push().key;
  let track = {
    comment: "En jäkligt jobbig bana",
    date: 20180301,
    rating: 4,
    share: true,
    time: 23.50,
    trackid: currentUser.trackid,
    user: currentUser.uid
  }
  db.ref(`/rundor/`).push(track)
}
