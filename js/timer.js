

window.addEventListener('load',function(event){
  //let btnClock = document.getElementById('btnClock');
  let btnStartClock = document.getElementById('btnStartClock');
  let btnClockPause = document.getElementById('btnClockPause');
  let btnClockStop = document.getElementById('btnClockStop');
  let btnSaveToDb = document.getElementById('btnSaveToDb');
  let infoSelectedTrack = document.getElementsByClassName('infoTrack')[0];
  let timeElapsedSecound = document.getElementsByClassName('timeElapsedSecound')[0].innerText="00s";
  let timeElapsedMinutes = document.getElementsByClassName('timeElapsedMinutes')[0].innerText="0m";
  let timeElapsedHours = document.getElementsByClassName('timeElapsedHours')[0].innerText="0h";

  btnClockStop.addEventListener('click',function(event){
    timer.stopTimer();
    timer.resetTimer();
  })

  btnClockPause.addEventListener('click',function(event){
    timer.pauseTimer();
  })

  btnSaveToDb.addEventListener('click',function(){
    if(currentUser.hasOwnProperty("trackid")){
      saveRoundToDbTimer();
    }
  })

  btnStartClock.addEventListener('click', function(event){
    //timerForRun();
    timer.startTimer();
  })
  infoSelectedTrack.innerText = "Ingen vald bana";

  let timer = new Timer();

}); // end of load


let saveRoundToDbTimer =()=>{
  //let newPostKey = db.ref("rundor").push().key;
  let track = {
    share: false,
    date: new Date().getTime(),
    time: currentUser.timeOfRun,
    trackid: currentUser.trackid,
    user: currentUser.uid
  }
  db.ref(`/rundor/`).push(track)
}


class Timer{
  constructor(time){
    this.timeRunning = false;
    this.timeoutValue = 0;

  }
  stopTimer(){
    clearInterval(this.elapsedTime)
  }
  startTimer(){
    if(!this.timeRunning){
      this.timeRunning = true;
      this.startTime = new Date().getTime();
      let _this = this;
      this.elapsedTime = setInterval(function (){
        let timeNow = new Date().getTime();
        let elapsedTimeHours= 0;
        let elapsedTimeMinutes = 0;
        let elapsedTimeSecounds = 0;
        let elasped = timeNow - _this.startTime + _this.timeoutValue;
        elapsedTimeHours = Math.floor((elasped % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        elapsedTimeMinutes = Math.floor((elasped % (1000 * 60 * 60)) / (1000 * 60));
        elapsedTimeSecounds = Math.floor((elasped % (1000 * 60)) / 1000);

        document.getElementsByClassName('timeElapsedHours')[0].innerText = elapsedTimeHours+"h";
        if(elapsedTimeSecounds < 10){
          document.getElementsByClassName('timeElapsedSecound')[0].innerText = "0"+String(elapsedTimeSecounds)+"s"
        }else{
          document.getElementsByClassName('timeElapsedSecound')[0].innerText = elapsedTimeSecounds +"s"
        }
        document.getElementsByClassName('timeElapsedMinutes')[0].innerText = elapsedTimeMinutes+"m";
        currentUser.timeOfRun = elasped;
      }, 1000);
    }// check end

  }

  pauseTimer(){
    if(this.timeRunning){
      this.timeRunning = false;
      let timeNow = new Date().getTime();
      this.timeoutValue = timeNow-this.startTime+this.timeoutValue;
      this.stopTimer();
    }
  }

  resetTimer(){
    this.timeRunning = false;
    this.timeoutValue= 0;
    currentUser.timeOfRun = "";
    document.getElementsByClassName('timeElapsedHours')[0].innerText = 0+"h";
    document.getElementsByClassName('timeElapsedMinutes')[0].innerText = "0m";
    document.getElementsByClassName('timeElapsedSecound')[0].innerText= "00s";
  }


}
