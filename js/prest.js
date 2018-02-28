window.addEventListener("load", function (){
	let db = firebase.database();
	let currentUser = "test";
	let totalLength = 0;
	let longestDistance = 0;

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
		let thisDistance = Number(length.replace(/[^0-9]/g,''));
		

		console.log(longestDistance);

		totalLength += thisDistance;
		spanTotalLength.innerText = `Total längd: ${totalLength}km`;
		spanLongestDist.innerText = `Längst sträcka: ${longestDistance}km`;

		if(longestDistance < thisDistance){
			longestDistance = thisDistance;
			spanLongestDist.innerText = `Längst sträcka: ${longestDistance}km`;
		}


		console.log(totalLength);

		newPlace.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${place}`
		newLength.innerHTML = `&#128095 ${length}`;
		newTime.innerHTML = `<i class="fas fa-stopwatch"></i> ${time}`;
		newDate.innerHTML = `<i class="far fa-calendar"></i> ${date}`;
		image.src = "#";
		newSwitchBox.classList.add("switchBox");
		newSwitch.classList.add("switch");
		newSwitchCircle.classList.add("switchCircle");


		prestList[0].appendChild(newDiv);
		newDiv.appendChild(newPlace);
		newDiv.appendChild(newLength);
		newDiv.appendChild(newTime);
		newDiv.appendChild(newDate);
		newDiv.appendChild(image);
		newDiv.appendChild(newSwitchBox);
		newSwitchBox.appendChild(newSwitch);
		newSwitch.appendChild(newSwitchCircle);
		console.log(length);

		if(share == true)newSwitch.classList.add("active");
		

		newSwitchBox.addEventListener("click", function(){
			newSwitch.classList.toggle("active");
			console.log(newSwitch.classList);
			if(newSwitch.classList[1] == "active"){
				db.ref("rundor/" + routeId).update({share: true})
				console.log(routeId);
			}
			else{
				db.ref("rundor/" + routeId).update({share: false})
				console.log(routeId);
			}
		})


	}

	db.ref("rundor/").on("child_added", function(snapshot, prevChildKey){
		let data = snapshot.val();
		let route = snapshot.key;

		if(data.user == currentUser){
			createPrest(data.place, data.length, data.time, data.date, route, data.share);
		}
	})

		
})