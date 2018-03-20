window.addEventListener("load", function (){
	let totalLength = 0;
	let longestDistance = 0;


	function createPrest(dataForRace){
		let prestList = document.getElementsByClassName("containerPrestation")

		/**CONTAINER **/
		let newDiv = document.createElement("div");
		let headPrest = document.createElement("div");
		let infoPrest = document.createElement("div");
		let textPrest = document.createElement("div");
		let sharePrest = document.createElement("div");

		/** CONTENT OF CONTAINER **/
		let newRating = document.createElement('div');
		let newPlace = document.createElement("p");
		let btnRemovePrest = document.createElement('button');

		let newLength = document.createElement("p");
		let newTime = document.createElement("p");
		let newDate = document.createElement("p");

		let newTextarea = document.createElement('textarea');
		let newShare = document.createElement("p");

		/*
		let newDivBtn = document.createElement("div");




		let newSwitchBox = document.createElement("div");
		let newSwitch = document.createElement("div");
		let newSwitchCircle = document.createElement("div");

		let newRating = document.createElement('span');

		let btnSetStars = document.createElement('button');*/
		let spanTotalLength = document.getElementById("spanTotalLength");
		let spanLongestDist = document.getElementById("spanLongestDist");

		let thisDistance = dataForRace.length;

		//newTextarea.type="textarea";
		/** CONTAINER CLASSNAMES **/
		newDiv.className="prest";
		headPrest.className = "headPrest";
		infoPrest.className = "infoPrest";
		textPrest.className = "textPrest";
		sharePrest.className = "sharePrest";

		/** CONTENT CLASSNAMES **/
		newPlace.className="place";
		newRating.className="wrapper-rating";
		newTime.className = "timePrest";
		newDate.className = "datePrest";
		newLength.className = "lengthPrest";
		newShare.className = "shareTextPrest";
		newTextarea.className="prestInput";
		newTextarea.placeholder = "Enter a comment to be able to share"

		btnRemovePrest.innerText="X";

		btnRemovePrest.className="btnRemove";

		btnRemovePrest.idOfRound= dataForRace.roundid;
		//btnSetStars.innerText="Rating";

		let dt= new Date(dataForRace.date)
		dt = dt.getFullYear()+"-" + (dt.getMonth()+1)+"-"+ dt.getDate();
		let stars = countStars(dataForRace.rating);

		newPlace.innerHTML = `${dataForRace.place}`
		newLength.innerHTML = `<i class="fas fa-flag-checkered" style="font-size: 17px; color: black; margin-right: 5px;"></i> ${dataForRace.length}km`;
		newTime.innerHTML = `<i class="fas fa-stopwatch" style="font-size: 17px; color: black; margin-right: 5px;"></i> ${convertToTime(dataForRace.time)}`; //convertToTime ligger i cardsMap
		newShare.innerHTML = `<i class="fas fa-share-alt" style="font-size: 17px; color: white; margin-right: 5px;"></i>` + "Share";
		newDate.innerHTML = `<i class="far fa-calendar" style="font-size: 17px; color: black; margin-right: 5px;"></i> ${dt}`;


		newRating.appendChild(stars);

		prestList[0].appendChild(newDiv);
		newDiv.appendChild(headPrest);
		newDiv.appendChild(infoPrest);
		newDiv.appendChild(textPrest);
		newDiv.appendChild(sharePrest);
		headPrest.appendChild(newRating);
		headPrest.appendChild(newPlace);
		headPrest.appendChild(btnRemovePrest);
		infoPrest.appendChild(newTime);
		infoPrest.appendChild(newLength);
		infoPrest.appendChild(newDate);
		textPrest.appendChild(newTextarea);
		sharePrest.appendChild(newShare);


		//btnSetStars.className="btnStars";
		//newDivBtn.className="divBtnPrest";
		headPrest.idOfRound = dataForRace.roundid;
		newDiv.idOfRound = dataForRace.roundid;
		newRating.idOfRound = dataForRace.roundid;
		//newDivBtn.appendChild(btnRemovePrest);
		//newDivBtn.appendChild(btnSetStars);


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

		newRating.addEventListener('click',(function(){
			let divOfStar = newRating;
			return function(event){
				//console.log(divOfStar);
				//console.log(span);
				let containerStars = document.getElementsByClassName('containerStars')[0];
				let stars = document.getElementsByClassName('stars');
				//let grandpa = event.target;

				let grandpa = divOfStar.getElementsByClassName('rating')[0];

				let amount = countStarsOfSpan(grandpa.children);//räknar ut rating

				fillStars(amount-1,stars);										// innan justering av rating sätts den till samma klickad prestation. Kommer från timer.js

				currentUser.trackid = divOfStar.idOfRound;

				containerStars.style.display="flex"
			}
		})() );

		/*
		newRating.addEventListener('click', function(event){  //justera rating på vald prestation
			let containerStars = document.getElementsByClassName('containerStars')[0];
			let stars = document.getElementsByClassName('stars');
			let grandpa = event.target;

			grandpa = grandpa.getElementsByClassName('rating')[0];

			let amount = countStarsOfSpan(grandpa.children);//räknar ut rating

			fillStars(amount-1,stars);										// innan justering av rating sätts den till samma klickad prestation.

			currentUser.trackid = event.target.parentNode.idOfRound;

			containerStars.style.display="flex"
		});
		*/



		/*newDiv.appendChild(newLength);
		newDiv.appendChild(newTime);
		newDiv.appendChild(newDate);
		newDiv.appendChild(newRating);
		newDiv.appendChild(newPlace);

		newDiv.appendChild(newTextarea);
		newDiv.appendChild(newSwitchBox);
		newDiv.appendChild(newDivBtn);

		newSwitchBox.appendChild(newSwitch);
		newSwitch.appendChild(newSwitchCircle);*/
		if(dataForRace.share == true){
			sharePrest.style.backgroundColor = "#8ce833";
			newShare.innerHTML = `<i class="fas fa-check" style="font-size: 17px; color: white; margin-right: 5px;"></i>` + "Shared";
		}else{
			sharePrest.style.backgroundColor = "#00ceff";
			newShare.innerHTML = `<i class="fas fa-share-alt" style="font-size: 17px; color: white; margin-right: 5px;"></i>` + "Share";
		}

		/*if(dataForRace.share == true)newSwitch.classList.add("active");*/


		sharePrest.addEventListener("click", function(){
			let inputTextCheck = newDiv.getElementsByClassName('prestInput')[0];
			if(inputTextCheck.value !=="" && dataForRace.share == false){

				sharePrest.style.backgroundColor = "#8ce833";
				newShare.innerHTML = `<i class="fas fa-check" style="font-size: 17px; color: white; margin-right: 5px;"></i>` + "Shared";
				db.ref("rundor/" + dataForRace.raceId).update({
					share: true,
					comment: inputTextCheck.value
				})

			}else if(dataForRace.share == true){
				sharePrest.style.backgroundColor = "#00ceff";
				newShare.innerHTML = `<i class="fas fa-share-alt" style="font-size: 17px; color: white; margin-right: 5px;"></i>` + "Share";
				db.ref("rundor/" + dataForRace.raceId).update({share: false});
			}else{
				let str = inputTextCheck.value
				inputTextCheck.style.border = "1px solid red";
				db.ref("rundor/" + dataForRace.raceId).update({share: false})
				setTimeout(function () {

					inputTextCheck.classList.remove("fail");
					inputTextCheck.style.border = "none";
				}, 1500);

			}
		})


			/*sharePrest.addEventListener("click", function(){
				if(dataForRace.share == true){
					sharePrest.style.backgroundColor = "#00ceff";
					newShare.innerHTML = `<i class="fas fa-share-alt" style="font-size: 17px; color: white; margin-right: 5px;"></i>` + "Share";
					db.ref("rundor/" + dataForRace.raceId).update({share: false});
				}else{
					sharePrest.style.backgroundColor = "#8ce833";
					newShare.innerHTML = `<i class="fas fa-check" style="font-size: 17px; color: white; margin-right: 5px;"></i>` + "Shared";
				}
			});*/


	}

	let getTracksFromUser=()=>{
		db.ref("rundor/").on("child_added", function(snapshot, prevChildKey){
			let data = snapshot.val();
			let route = snapshot.key;
			let trackId = data.trackid;

			if(data.user == currentUser.uid){
				let length=0;
				if(trackId=="default"){
					length = data.length;
				}else{
					length = runningTracks[trackId].length;
				}

				let dataForRace = {
					place : runningTracks[trackId].place, //runningTracks kommer från cardsMap
					length : length,
					//name: runningTracks[trackId].name,
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



			for(let i=0;i < allPrest.length;i++){
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
	let stars = document.getElementsByClassName('className');
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
	found.getElementsByClassName('wrapper-rating')[0].innerHTML = ""
	found.getElementsByClassName('wrapper-rating')[0].appendChild(stars);
}
//--------------------------  END --------------------------------------------//




//--------------- Räknar ut längst sträcka samt totalsträcka ----------------->>
let updateLength =(except)=>{
	let longestRun = 0;
	let totalLength = 0;
	for(item in allResults){

		if(allResults[item].user == currentUser.uid && allResults[item].roundid!=except){
			let trackid = allResults[item].trackid;
			let track =  runningTracks[trackid]

			let length=0;
			if(trackid=="default"){
				length = Number(allResults[item].length);
			}else{
				length = Number(track.length);
			}

			if(longestRun<length){
				longestRun=length
			}
			totalLength+=length;
		}

	}
	longestRun =longestRun.toFixed(1);
	totalLength = totalLength.toFixed(1);
	document.getElementById("spanTotalLength").innerText="Total Längd: " +totalLength + "km";
	document.getElementById("spanLongestDist").innerText="Längst sträcka: "+longestRun + "km";


	currentUser.longestRun = longestRun;
	currentUser.totalLength = totalLength;
	// uppdatear databse med längst straäck och total distans
}

//------------------  END ----------------------------------------------------//
