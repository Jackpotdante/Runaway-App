

/**** GOOGLE MAPS API ***/
var locations = [
  ['Bondi Beach', -33.890542, 151.274856, 4],
  ['Coogee Beach', -33.923036, 151.259052, 5],
  ['Cronulla Beach', -34.028249, 151.157507, 3],
  ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
  ['Skatås', 57.703899, 12.03589, 1]
  <!--[NAMN , LAT , LONG , NUMMER]-->
];
console.log(locations[4][0]);

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
        document.getElementsByClassName("overmap")[0].style.display = "flex";
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

  toggleButton.addEventListener('click' ,function(event){
    document.getElementsByClassName("overmap")[0].style.display = "none";
  })

})
