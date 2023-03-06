function initMap() {
  let map;
  let mapOptions = {
    center: new google.maps.LatLng(54.977775, -1.604488),
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    overviewMapControl: false,
    rotateControl: false,
    scaleControl: false,
    panControl: true,
  };

  map = new google.maps.Map($("#map")[0], mapOptions);

  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(54.977775, -1.604488),
    title: "Here I am...",
  });

  google.maps.event.addListener(marker, "click", function () {
    alert("Get off my marker!");
  });
}

$(document).ready(function () {
  initMap();
});
