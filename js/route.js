

/**** GOOGLE MAPS API ***/
var locations = [
  ['Mossen', 57.68412409999999, 11.980051199999934, 4],
  ['Slottskogen', 57.6904458, 11.951964399999952, 5],
  ['Tuvevallen', 57.75227049999999, 11.91442029999996, 3],
  ['Länsmansgården', 57.73335959999999, 11.88558480000006, 2],
  ['Skatås', 57.703899, 12.03589, 1]
  <!--[NAMN , LAT , LONG , NUMMER]-->
];


let curLocation;

function initMap(){
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(57.708870, 11.974560),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true

  });



  var marker, i;

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        document.getElementsByClassName("hej")[0].style.display = "flex";
        map.setCenter(marker.getPosition());
        map.setZoom(14);
        curLocation = locations[i][0];
        getTracks(curLocation);
        


      }
    })(marker, i));
  }
}
window.addEventListener('load', function(event){

  let toggleButton = document.getElementsByClassName("hej")[0];
  let overmaps = document.getElementById("overmap");
  let showBtn = document.getElementById("showBtn");


    toggleButton.addEventListener('click' ,function(event){
      if( overmaps.style.display == "none"){
        document.getElementById("showHide").innerHTML = "HIDE TRACKS";
        overmaps.style.display = "flex";
      }else if(overmaps.style.display == "flex"){
        document.getElementById("showHide").innerHTML = "SHOW TRACKS";
        overmaps.style.display = "none";
      }
    })

    if(screen.width>500){
      overmaps.style.display="flex";
    }

/** window **/
})
