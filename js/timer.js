

window.addEventListener('load',function(event){
  //let btnClock = document.getElementById('btnClock');
  let btnStartClock = document.getElementById('btnStartClock');
  let btnClockPause = document.getElementById('btnClockPause');
  let btnClockStop = document.getElementById('btnClockStop');
  let btnSaveToDb = document.getElementById('btnSaveToDb');
  let btnShowStars = document.getElementById('btnShowStars');
  let infoSelectedTrack = document.getElementsByClassName('infoTrack')[0];
  let timeElapsedSecound = document.getElementsByClassName('timeElapsedSecound')[0].innerText="00";
  let timeElapsedMinutes = document.getElementsByClassName('timeElapsedMinutes')[0].innerText="00 :";
  let timeElapsedHours = document.getElementsByClassName('timeElapsedHours')[0].innerText="00 :";
  let stars = document.getElementsByClassName('stars');
  let containerStars= document.getElementsByClassName('containerStars')[0];
  let inputOwnLength = document.getElementById("ownLength");
  let wrapperOwnLength = document.getElementsByClassName('wrapper-ownLength')[0];
  let btnCancel = document.getElementById('btnCancel');

  btnClockStop.addEventListener('click',function(event){ // Stoppa klockan
    btnClockStop.style.display = "none";
    btnShowStars.style.display = "none";
    btnClockPause.style.display = "none";
    btnStartClock.innerHTML = `<i class="fas fa-play" style="font-size: 13px; margin-right: 5px"></i>` + "Start";
    timer.stopTimer();
    timer.resetTimer();
  })

  btnClockPause.addEventListener('click',function(event){ // Pausa klockan
    btnShowStars.style.display = "inline-block";
    btnClockStop.style.display = "inline-block";
    btnStartClock.style.display = "inline-block";
    btnStartClock.innerHTML = `<i class="fas fa-play" style="font-size: 13px; margin-right: 5px"></i>` + "Continue";
    btnClockPause.style.display = "none";
    timer.pauseTimer();
  })

  btnSaveToDb.addEventListener('click',function(){ // spara runda/rating till databas.
    let containerPrestation = document.getElementsByClassName('containerPrestation')[0];
    let containerTimer = document.getElementsByClassName('containerTimer')[0];
    let update = false;

    if (containerTimer.style.display=="flex"){          // händer om timersida är aktiv

      if(currentUser.hasOwnProperty("trackid")){        // kontroll om vi valt bana.
        showMsgToUser("Saved");
        saveRoundToDbTimer();                           // sparar resultat kopplat till en bana
        update=true;
      }else{
          if(inputOwnLength.value>0){
            showMsgToUser("Saved");
            saveRoundToDbTimerWithoutTrack(Number(inputOwnLength.value)); // sparar resultat kopplat till egen vald längd.
            update=true;
          }else{
            showMsgToUser("Please enter a valid number","red");

          }
      }

      if(update){
        btnClockStop.style.display = "none";
        btnShowStars.style.display = "none";
        containerStars.style.display="none";
        btnStartClock.style.display = "inline-block";
        btnStartClock.innerHTML = `<i class="fas fa-play" style="font-size: 13px; margin-right: 5px"></i>` + "Start";
        timer.resetTimer();
        containerPrestation.style.display="flex";
        containerTimer.style.display="none";
      }


    }else{                                            // händer om prestationsida är aktiv
      saveRoundStarsToDb(currentUser.stars)
      showMsgToUser("Saved");
      containerStars.style.display="none";
      wrapperOwnLength.style.display="none";
      inputOwnLength.value="";
    }
  })

  btnCancel.addEventListener('click', function(event){  // cansel Rating av banan
    containerStars.style.display="none";
  })

  btnShowStars.addEventListener('click',function(){  // Rating av banan
        containerStars.style.display="flex";
      (!currentUser.hasOwnProperty("trackid")) ? wrapperOwnLength.style.display="block":wrapperOwnLength.style.display="none";
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



  infoSelectedTrack.innerText = "No track selected";
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




//------------------------- Sparar runda till db vid vald bana  -------------->>
let saveRoundToDbTimer =()=>{
  let newPostKey = db.ref("rundor/").push().key;
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
  delete currentUser.trackid;
  document.getElementsByClassName("infoTrack")[0].innerText ="No track selected";
}

//------------------------ END -----------------------------------------------//

//------------------------- Sparar runda till db vid egen vald längd  -------->>
let saveRoundToDbTimerWithoutTrack =(length)=>{
  let newPostKey = db.ref("rundor").push().key;
  let track = {
    share: false,
    date: new Date().getTime(),
    time: currentUser.timeOfRun,
    trackid: "default",
    length: length,
    user: currentUser.uid,
    rating: currentUser.stars,
    roundid: newPostKey
  }
  db.ref(`/rundor/${newPostKey}`).set(track)
}

//------------------------ END -----------------------------------------------//




//-----------------------  Spara Rating till databas ------------------------->>
let saveRoundStarsToDb=(nb)=>{
  db.ref(`/rundor/${currentUser.idForStarUpdate}/rating`).set(nb)
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

        document.getElementsByClassName('timeElapsedHours')[0].innerText = elapsedTimeHours+":";
        if(elapsedTimeSecounds < 10){
          document.getElementsByClassName('timeElapsedSecound')[0].innerText = "0"+String(elapsedTimeSecounds);
          document.getElementsByClassName('timeElapsedMinutes')[0].innerText = "0"+String(elapsedTimeMinutes) + " :";
          document.getElementsByClassName('timeElapsedHours')[0].innerText = "0"+String(elapsedTimeHours) + " :";
        }else if(elapsedTimeMinutes < 10){ // MAKES THE CLOCK ALWAYS BE 6 FIGURES
          document.getElementsByClassName('timeElapsedMinutes')[0].innerText = "0"+String(elapsedTimeMinutes) + " :";
          document.getElementsByClassName('timeElapsedHours')[0].innerText = "0"+String(elapsedTimeHours) + " :";
          document.getElementsByClassName('timeElapsedSecound')[0].innerText = elapsedTimeSecounds;
        }else{
          document.getElementsByClassName('timeElapsedHours')[0].innerText = "0"+String(elapsedTimeHours) + " :";
          document.getElementsByClassName('timeElapsedSecound')[0].innerText = elapsedTimeSecounds;
          document.getElementsByClassName('timeElapsedMinutes')[0].innerText = elapsedTimeMinutes+" :";
        }

        //document.getElementsByClassName('timeElapsedMinutes')[0].innerText = elapsedTimeMinutes+":";
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
    document.getElementsByClassName('timeElapsedHours')[0].innerText = "00" +" :";
    document.getElementsByClassName('timeElapsedMinutes')[0].innerText = "00 :";
    document.getElementsByClassName('timeElapsedSecound')[0].innerText= "00";
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
      let xcord= 4;
      switch(x){
        case 1:
          xcord=4;
          break;
        case 2:
          xcord=-57;
          break;
        case 3:
          xcord= -121;
          break;
        case 4:
          xcord= -185;
          break;
        case 5:
          xcord= -246;
          break;
        default:
          console.log("default");
      }


      //let xcord = x * -80+10;
      let ycord = y * -65 + 4
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



// ------------------------ Msg to user -------------------------------------->>

let showMsgToUser=(str,color)=>{
  let msgToUser = document.getElementsByClassName('msgToUser')[0]

  if(color=="red"){
    msgToUser.style.backgroundColor ="red";
  }else{
    msgToUser.style.backgroundColor ="#8ce833";
  }

  let sec = 2000;
  msgToUser.innerHTML = `<i class="fas fa-info-circle"></i> ${str}`
  msgToUser.style.display="inline-block";
  clearInterval(time)
  var time = setInterval(function(){
    msgToUser.innerText="";
    msgToUser.style.display="none";
    clearInterval(time)
  },sec)
}


// ------------------------- END ---------------------------------------------//
