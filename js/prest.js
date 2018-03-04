window.addEventListener("load", function (){
	let totalLength = 0;
	let longestDistance = 0;

	let btnLoadTracks = document.getElementById('btnLoadTracks');
	btnLoadTracks.addEventListener('click', function(event){
		getTracksFromUser();
	});

	function createPrest(place, length, time, date, routeId, share){
		let prestList = document.getElementsByClassName("containerPrestation")
		let newDiv = document.createElement("div");
		let newPlace = document.createElement("span");
		let newLength = document.createElement("span");
		let newTime = document.createElement("span");
		let newDate = document.createElement("span");
		let newSwitchBox = document.createElement("div");
		let newSwitch = document.createElement("div");
		let newSwitchCircle = document.createElement("div");
		let image = document.createElement("img");
		let spanTotalLength = document.getElementById("spanTotalLength");
		let spanLongestDist = document.getElementById("spanLongestDist");
		let thisDistance = length;



		totalLength += thisDistance;
		spanTotalLength.innerText = `Total längd: ${totalLength}km`;
		spanLongestDist.innerText = `Längst sträcka: ${longestDistance}km`;

		if(longestDistance < thisDistance){
			longestDistance = thisDistance;
			spanLongestDist.innerText = `Längst sträcka: ${longestDistance}km`;
		}




		newPlace.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${place}`
		newLength.innerHTML = `&#128095 ${length}km`;
		newTime.innerHTML = `<i class="fas fa-stopwatch"></i> ${time}`;
		newDate.innerHTML = `<i class="far fa-calendar"></i> ${date}`;
		image.src = "#";
		newSwitchBox.classList.add("switchBox");
		newSwitch.classList.add("switch");
		newSwitchCircle.classList.add("switchCircle");
		newSwitchBox.innerText = "Dela: ";


		prestList[0].appendChild(newDiv);
		newDiv.appendChild(newPlace);
		newDiv.appendChild(newLength);
		newDiv.appendChild(newTime);
		newDiv.appendChild(newDate);
		newDiv.appendChild(image);
		newDiv.appendChild(newSwitchBox);
		newSwitchBox.appendChild(newSwitch);
		newSwitch.appendChild(newSwitchCircle);


		if(share == true)newSwitch.classList.add("active");


		newSwitchBox.addEventListener("click", function(){
			newSwitch.classList.toggle("active");

			if(newSwitch.classList[1] == "active"){
				db.ref("rundor/" + routeId).update({share: true})
			}
			else{
				db.ref("rundor/" + routeId).update({share: false})
			}
		})


	}

	let getTracksFromUser=()=>{
		db.ref("rundor/").on("child_added", function(snapshot, prevChildKey){
			let data = snapshot.val();
			let route = snapshot.key;

			//ta bort denna när vi fått ordning på inloggad användre.
			createPrest(data.place, data.length, data.time, data.date, route, data.share);

			if(data.user == currentUser){ //används när vi väl fått ordning på inloggad användre
				console.log("inside currne");
				createPrest(data.place, data.length, data.time, data.date, route, data.share);
			}
		})
	}


})
