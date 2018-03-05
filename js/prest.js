window.addEventListener("load", function (){
	let totalLength = 0;
	let longestDistance = 0;

	function createPrest(dataForRace){
		let prestList = document.getElementsByClassName("containerPrestation")
		let newDiv = document.createElement("div");
		let newPlace = document.createElement("span");
		let newLength = document.createElement("span");
		let newTime = document.createElement("span");
		let newName = document.createElement("span");
		let newDate = document.createElement("span");
		let newSwitchBox = document.createElement("div");
		let newSwitch = document.createElement("div");
		let newSwitchCircle = document.createElement("div");
		//let image = document.createElement("img");
		let spanTotalLength = document.getElementById("spanTotalLength");
		let spanLongestDist = document.getElementById("spanLongestDist");
		let thisDistance = dataForRace.length;
		newName.className="nameOfTrack";


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




		newPlace.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${dataForRace.place}`
		newLength.innerHTML = `&#128095 ${dataForRace.length}km`;
		newTime.innerHTML = `<i class="fas fa-stopwatch"></i> ${dataForRace.time}`;
		newDate.innerHTML = `<i class="far fa-calendar"></i> ${dataForRace.date}`;
		//image.src = "#";
		newSwitchBox.classList.add("switchBox");
		newSwitch.classList.add("switch");
		newSwitchCircle.classList.add("switchCircle");
		newSwitchBox.innerText = "Dela: ";
		newName.innerHTML = dataForRace.name;

		prestList[0].appendChild(newDiv);
		newDiv.appendChild(newPlace);
		newDiv.appendChild(newLength);
		newDiv.appendChild(newTime);
		newDiv.appendChild(newDate);
		newDiv.appendChild(newName);
		//newDiv.appendChild(image);
		newDiv.appendChild(newSwitchBox);
		newSwitchBox.appendChild(newSwitch);
		newSwitch.appendChild(newSwitchCircle);


		if(dataForRace.share == true)newSwitch.classList.add("active");


		newSwitchBox.addEventListener("click", function(){
			newSwitch.classList.toggle("active");

			if(newSwitch.classList[1] == "active"){
				db.ref("rundor/" + dataForRace.raceId).update({share: true})
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
					share : data.share
				}
				createPrest(dataForRace);
			}
		})

	}

	getTracksFromUser();
})
