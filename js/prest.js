window.addEventListener("load", function (){
	let totalLength = 0;
	let longestDistance = 0;


	function createPrest(dataForRace){
		let prestList = document.getElementsByClassName("containerPrestation")
		let newDiv = document.createElement("div");
		let newDivBtn = document.createElement("div");
		let newPlace = document.createElement("span");
		let newLength = document.createElement("span");
		let newTime = document.createElement("span");
		let newName = document.createElement("span");
		let newDate = document.createElement("span");
		let newSwitchBox = document.createElement("div");
		let newSwitch = document.createElement("div");
		let newSwitchCircle = document.createElement("div");
		let newTextarea = document.createElement('textarea');
		let newRating = document.createElement('span');
		let btnRemovePrest = document.createElement('button');
		let btnSetStars = document.createElement('button');
		let spanTotalLength = document.getElementById("spanTotalLength");
		let spanLongestDist = document.getElementById("spanLongestDist");
		let thisDistance = dataForRace.length;
		newName.className="nameOfTrack";
		newTextarea.type="textarea";
		newDiv.className="prest";
		newPlace.className="place";
		newRating.className="rating";
		btnRemovePrest.innerText="x";
		btnSetStars.innerText="Rating";
		btnRemovePrest.idOfRound= dataForRace.roundid;
		btnRemovePrest.className="btnRemove";
		btnSetStars.className="btnStars";
		newDivBtn.className="divBtnPrest";
		newDivBtn.idOfRound = dataForRace.roundid;
		newDiv.idOfRound = dataForRace.roundid;
		newDivBtn.appendChild(btnRemovePrest);
		newDivBtn.appendChild(btnSetStars);


		if(dataForRace.comment!==undefined){
			newTextarea.value= dataForRace.comment;
		}
		newTextarea.className="prestInput";
		//newTextarea.readOnly = "false";


		/*
		totalLength += thisDistance;
		currentUser.totalLength = totalLength; //sparar totalsträcka till user objecktet
	  	currentUser.longestRun = longestDistance; //sparar totalsträcka till user objecktet

		spanTotalLength.innerText = `Total längd: ${totalLength}km`;
		spanLongestDist.innerText = `Längst sträcka: ${longestDistance}km`;

		if(longestDistance < thisDistance){
			longestDistance = thisDistance;
			spanLongestDist.innerText = `Längst sträcka: ${longestDistance}km`;
			currentUser.longestRun = thisDistance;
		}
		*/

		getRunInfo(); //används för att uppdatera profil


		btnRemovePrest.addEventListener('click', function(event){  // tar bort vald prestation
			let key = event.target.idOfRound;
			 db.ref(`/rundor/${key}`).remove();
		});


		btnSetStars.addEventListener('click', function(event){  //justera rating på vald prestation
			let containerStars = document.getElementsByClassName('containerStars')[0];
			let stars = document.getElementsByClassName('stars');
			let grandpa = event.target.parentNode.parentNode;
			grandpa = grandpa.getElementsByClassName('rating')[1];
			let amount = countStarsOfSpan(grandpa.children) //räknar ut rating
			fillStars(amount-1,stars);											// innan justering av rating sätts den till samma klickad prestation.
			currentUser.trackid = event.target.parentNode.idOfRound;
			containerStars.style.display="flex"
		});


		let dt= new Date(dataForRace.date)
		dt = dt.getFullYear()+"-" + (dt.getMonth()+1)+"-"+ dt.getDate();
		let stars = countStars(dataForRace.rating);

		newPlace.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${dataForRace.place}`
		newLength.innerHTML = `&#128095 ${dataForRace.length}km`;
		newTime.innerHTML = `<i class="fas fa-stopwatch"></i> ${convertToTime(dataForRace.time)}`; //convertToTime ligger i cardsMap
		newDate.innerHTML = `<i class="far fa-calendar"></i> ${dt}`;
		newSwitchBox.classList.add("switchBox");
		newSwitch.classList.add("switch");
		newSwitchCircle.classList.add("switchCircle");
		newSwitchBox.innerText = "Dela: ";
		newName.innerHTML = dataForRace.name;
		newRating.appendChild(stars);

		prestList[0].appendChild(newDiv);
		newDiv.appendChild(newLength);
		newDiv.appendChild(newTime);
		newDiv.appendChild(newDate);
		newDiv.appendChild(newRating);
		newDiv.appendChild(newPlace);
		newDiv.appendChild(newName);
		newDiv.appendChild(newTextarea);
		newDiv.appendChild(newSwitchBox);
		newDiv.appendChild(newDivBtn);

		newSwitchBox.appendChild(newSwitch);
		newSwitch.appendChild(newSwitchCircle);


		if(dataForRace.share == true)newSwitch.classList.add("active");


		newSwitchBox.addEventListener("click", function(){
			let inputTextCheck = newDiv.getElementsByClassName('prestInput')[0];
			if(inputTextCheck.value !==""){
				newSwitch.classList.toggle("active");

			}else{
				let str = inputTextCheck.value
				inputTextCheck.placeholder="Fyll i uppgifter";
				inputTextCheck.classList.add("fail")
				setTimeout(function () {
					inputTextCheck.placeholder= str;
					inputTextCheck.classList.remove("fail");
				}, 1500);
			}


			if(newSwitch.classList[1] == "active"){
				db.ref("rundor/" + dataForRace.raceId).update({
					share: true,
					comment: inputTextCheck.value
				})
			}
			else{
				db.ref("rundor/" + dataForRace.raceId).update({share: false})
			}
		})


	}

	let getTracksFromUser=()=>{
		db.ref("rundor/").on("child_added", function(snapshot, prevChildKey){
			let data = snapshot.val();
			let route = snapshot.key;
			let trackId = data.trackid;

			if(data.user == currentUser.uid){

				let dataForRace = {
					place : runningTracks[trackId].place, //runningTracks kommer från cardsMap
					length : runningTracks[trackId].length,
					name: runningTracks[trackId].name,
					time : data.time,
					date : data.date,
					raceId : route,
					share : data.share,
					comment : data.comment,
					rating: data.rating,
					roundid: data.roundid
				}
				createPrest(dataForRace); // skapar kort för varje runda
			}
		})

		db.ref('rundor/').on("child_removed", function(snapshot, prevChildKey){
			let data = snapshot.val();
			let containerPrest = document.getElementsByClassName('containerPrestation')[0];
			let allPrest = document.getElementsByClassName('prest');

			for(let i=0;i<allPrest.length;i++){
				if(allPrest[i].idOfRound == data.roundid){
					containerPrest.removeChild(allPrest[i]);
				}
			}
			//updateLength(data.roundid); // uppdaterar sträcka för användare
		})

		db.ref('rundor/').on("child_changed", function(snapshot, prevChildKey){
			let data = snapshot.val();
			let allPrest = document.getElementsByClassName('prest');

			for(let i=0;i<allPrest.length;i++){
				if(allPrest[i].idOfRound == data.roundid){
					updatePrest(allPrest[i],data);
				}
			}

		})

	}

	getTracksFromUser();
}) // End of window load




// ------------------ Räknar ut hur många stjärnor som är satta -------------->>
let countStarsOfSpan=(list)=>{
	let stars = document.getElementsByClassName('className')
	let count = 0;
	for(let i=0;i<list.length; i++){
			if(list[i].dataset.prefix=="fas"){
			count++
			}
	}

	currentUser.stars = count; //används vid spara till db.
	return count;
}

// --------------------------- END -------------------------------------------//



//-------------------------- Uppdatera prestation ---------------------------->>

let updatePrest = (found,data)=>{  //uppdaterar endast stjärnor än så länge
	let stars = countStars(data.rating);
	found.getElementsByClassName('rating')[0].innerHTML = ""
	found.getElementsByClassName('rating')[0].appendChild(stars);
}
//--------------------------  END --------------------------------------------//




//--------------- Räknar ut längst sträcka samt totalsträcka ----------------->>
let updateLength =(except)=>{
	let longestRun = 0;
	let totalLength = 0;
	//console.log("nu körs den");
	//console.log(allResults);
	for(item in allResults){

		if(allResults[item].user == currentUser.uid && allResults[item].roundid!=except){
			//console.log(allResults[item]);
			let trackid = allResults[item].trackid;
			let track =  runningTracks[trackid]

			if(longestRun<track.length){
				longestRun=track.length
			}
			totalLength+=track.length;
		}

	}
	document.getElementById("spanTotalLength").innerText="Total Längd: " +totalLength + "km";
	document.getElementById("spanLongestDist").innerText="Längst sträcka: "+longestRun + "km";
	currentUser.longestRun = longestRun;
	currentUser.totalLength = totalLength;
	// uppdatear databse med längst straäck och total distans
}

//------------------  END ----------------------------------------------------//
