

window.addEventListener('load',function(event){
  //let btnClock = document.getElementById('btnClock');
  let btnStartClock = document.getElementById('btnStartClock');
  let btnClockPause = document.getElementById('btnClockPause');
  let btnClockStop = document.getElementById('btnClockStop');
  let btnSaveToDb = document.getElementById('btnSaveToDb');
  let btnShowStars = document.getElementById('btnShowStars');
  let infoSelectedTrack = document.getElementsByClassName('infoTrack')[0];
  let timeElapsedSecound = document.getElementsByClassName('timeElapsedSecound')[0].innerText="00s";
  let timeElapsedMinutes = document.getElementsByClassName('timeElapsedMinutes')[0].innerText="0m";
  let timeElapsedHours = document.getElementsByClassName('timeElapsedHours')[0].innerText="0h";
  let stars = document.getElementsByClassName('stars');
  let containerStars= document.getElementsByClassName('containerStars')[0];

  btnClockStop.addEventListener('click',function(event){ // Stoppa klockan
    btnClockStop.style.display = "none";
    btnShowStars.style.display = "none";
    btnClockPause.style.display = "none";
    btnStartClock.innerText = "Start Timer";
    timer.stopTimer();
    timer.resetTimer();
  })

  btnClockPause.addEventListener('click',function(event){ // Pausa klockan
    btnShowStars.style.display = "inline-block";
    btnClockStop.style.display = "inline-block";
    btnStartClock.style.display = "inline-block";
    btnStartClock.innerText = "Continue";
    btnClockPause.style.display = "none";
    timer.pauseTimer();
  })

  btnSaveToDb.addEventListener('click',function(){ // spara runda/rating till databas.
    let containerPrestation = document.getElementsByClassName('containerPrestation')[0];
    let containerTimer = document.getElementsByClassName('containerTimer')[0];

    if (containerTimer.style.display=="flex"){          // händer om timersida är aktiv
      if(currentUser.hasOwnProperty("trackid")){
        saveRoundToDbTimer();
        containerStars.style.display="none";
        btnStartClock.style.display = "inline-block";
        btnStartClock.innerText = "Start Timer";
        timer.resetTimer();
        containerPrestation.style.display="flex";
        containerTimer.style.display="none";
      }
    }else{                                            // händer om prestationsida är aktiv
      saveRoundStarsToDb(currentUser.stars)
      containerStars.style.display="none";
    }


  })
  btnShowStars.addEventListener('click',function(){  // Rating av banan
    if(currentUser.hasOwnProperty("trackid")){
      btnClockStop.style.display = "none";
      btnShowStars.style.display = "none";
      btnClockPause.style.display = "none";
      btnStartClock.style.display = "none";
      containerStars.style.display="flex";
    }
  })

  btnStartClock.addEventListener('click', function(event){  // starta klockan
    btnClockPause.style.display = "block";
    btnStartClock.style.display = "none";
    btnClockStop.style.display = "none";
    btnShowStars.style.display = "none";
    timer.startTimer();
  })

  for(let i=0;i<stars.length;i++){ //lägger till lyssnare och skickar vidare värdet
    stars[i].addEventListener("click",function(event){
      currentUser.stars=i+1;
      fillStars(i,stars);
    })
  }


  infoSelectedTrack.innerText = "Ingen vald bana";
  let timer = new Timer();
  let weatherNow = new Weather();
  weatherNow.loadWeather();

}); // end of window load



//------------------ Sätter stjärnor som är uppp till i --------------------->>
let fillStars=(i,stars)=>{
  for(let j=0;j<stars.length;j++){
    if(j<=i){
      stars[j].innerHTML=`<i style="color:#fff72b;" class="fas fa-star fa-2x">`
    }else{
      stars[j].innerHTML=`<i style="color: rgb(181, 181, 181);" class="far fa-star fa-2x"></i>`
    }
  }
}
//---------------------- END -------------------------------------------------//




//------------------------- Sparar runda till db ----------------------------->>
let saveRoundToDbTimer =()=>{
  let newPostKey = db.ref("rundor").push().key;
  let track = {
    share: false,
    date: new Date().getTime(),
    time: currentUser.timeOfRun,
    trackid: currentUser.trackid,
    user: currentUser.uid,
    rating: currentUser.stars,
    roundid: newPostKey
  }
  db.ref(`/rundor/${newPostKey}`).set(track)
}

//------------------------ END -----------------------------------------------//




//-----------------------  Spara Rating till databas ------------------------->>
let saveRoundStarsToDb=(nb)=>{
  db.ref(`/rundor/${currentUser.trackid}/rating`).set(nb)
}

//----------------------- END ------------------------------------------------//



//----------------------------- Skapa klocka -------------------------------->>
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
//----------------------- END ------------------------------------------------//




//-----------------------  SKapa väder --------------------------------------->>
class Weather{
  constructor(){
    this.loaded = true;
  }

  loadWeather(){
    let _this = this;
    fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/11.96294/lat/57.6909/data.json').then(function(response) {
      return response.json();
    }).then(function(obj){

      let measurementNow = obj.timeSeries[0].parameters
      let temperature = measurementNow.filter(measurement => (measurement.name=="t"));
      let windSp =  measurementNow.filter(measurement => (measurement.name=="ws"));
      let weatherSymbol = measurementNow.filter(measurement => (measurement.name=="Wsymb2"));
      temperature = temperature[0].values[0]
      windSp = windSp[0].values[0]
      weatherSymbol = weatherSymbol[0].values[0]

      _this.category = weatherSymbol // väder symbol
      _this.temperature = temperature;
      _this.windSpeed = windSp; // wind speed
      _this.showWeather()
    });
  }

  showWeather(){
    document.getElementById('weatherIcon')

    let symbolNb = this.category;
    if(symbolNb){
      let y = 0
      while(symbolNb>5){
        symbolNb=symbolNb-5;
        y++
      }

      let x = symbolNb
      let xcord= 10;
      switch(x){
        case 1:
          xcord=10;
          break;
        case 2:
          xcord=-72;
          break;
        case 3:
          xcord= -155;
          break;
        case 4:
          xcord= -242;
          break;
        case 5:
          xcord= -322;
          break;
        default:
          console.log("default");
      }


      //let xcord = x * -80+10;
      let ycord = y * -86
      //console.log("x är: ", x,":",xcord," y är:",y,":",ycord);
      document.getElementById("weatherIcon").style.left = xcord+"px";
      document.getElementById("weatherIcon").style.top = ycord+"px";
      document.getElementById("weatherTemperature").innerText = this.temperature + "°C";
      document.getElementById("weatherWindSpeed").innerText = this.windSpeed + "m/s";

    }
  }

  /* En stor bild av alla moln. Man flyttar rutan över vad som skall visas
  right -325,-245, -165,-85 ,-5
  top   0,-55,110,165,220
  höjd 1200    200höjd
  bred 1250    250bred
  */

}
//----------------------- END ------------------------------------------------//
