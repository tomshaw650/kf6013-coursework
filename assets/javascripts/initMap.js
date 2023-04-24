/**
 *
 * This file contains the logic for Google Maps API and surrounding APIs
 * Including Distance Matrix, Directions, and Geocoding.
 * The map is initialised and the markers are created based on tweet locations
 * The side panels on the index page are used to show the closest weather station to the user
 * and the directions to the Living Planet HQ.
 *
 * @author Tom Shaw
 *
 */

function initMap() {
  $(document).ready(function () {
    // initialise the map variable and required data
    let map;
    let data = getClimateData();

    // initialise the API services
    const matrixService = new google.maps.DistanceMatrixService();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    // create the coordinates for the map to be centred on (Living Planet HQ)
    const myLatLng = { lat: 54.97828736453621, lng: -1.6182544814153705 };

    // create the map options
    let mapOptions = {
      center: new google.maps.LatLng(myLatLng),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      overviewMapControl: false,
      rotateControl: false,
      scaleControl: false,
      panControl: true,
    };

    // create the map anddirections renderer panel
    map = new google.maps.Map($("#map")[0], mapOptions);
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-renderer"));

    // initialise the bounds for the maps
    const bounds = new google.maps.LatLngBounds();

    // uses climateData from ./climateData.js to create markers on the map
    for (let i = 0; i < data.length; i++) {
      const tweetData = data[i];

      // https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/geo
      // see above for information on how to get the location of a tweet
      // below we are creating `location` and setting this based on if coordinates/place/geo are available.
      // we use the user.location as the final data to fall back on, and if this is not available we set it to "Unknown"
      let location = tweetData.user.location;
      if (tweetData.coordinates !== null) {
        location = tweetData["coordinates"]["coordinates"];
      } else if (tweetData.place !== null) {
        location = tweetData.place.full_name;
      } else if (tweetData.geo !== null) {
        location = tweetData.geo.coordinates;
      } else if (!location) {
        location = "Unknown";
      }

      // create the custom info window for the marker
      let tweetInfoWindow =
        `<div>` +
        `<span>${tweetData.user.screen_name}</span>` +
        `<br>` +
        `<span>${tweetData.user.name}</span>` +
        `<br>` +
        `<p>${tweetData.text}</p>` +
        `<br>` +
        `<span>${location}</span>` +
        `</div>`;

      // create the info window
      let infoWindow = new google.maps.InfoWindow({
        content: tweetInfoWindow,
        ariaLabel: "Tweet Info",
        disableAutoPan: true,
      });

      // jquery getJSON request to get the latitude and longitude of the location based on geocoding
      $.getJSON(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyB-LttAINsVamd6LyIzQbFYxn-9GmPfKZY`,
        function (data) {
          // if the status is OK, set the lat and lng of the tweetData object
          if (data.status === "OK") {
            tweetData.lat = data.results[0].geometry.location.lat;
            tweetData.lng = data.results[0].geometry.location.lng;

            // Set the marker icon based on the tweet's hashtags
            let image;
            const hashtags = tweetData.entities.hashtags.map((tag) =>
              tag.text.toLowerCase()
            );
            if (
              hashtags.includes("netzero") &&
              hashtags.includes("climatechange")
            ) {
              image = "assets/images/combined.png";
            } else if (hashtags.includes("netzero")) {
              image = "assets/images/netzero.png";
            } else if (hashtags.includes("climatechange")) {
              image = "assets/images/climatechange.png";
            }

            // Create a new marker for the climate location
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(tweetData.lat, tweetData.lng),
              map: map,
              icon: image,
            });

            // Add an event listener for the markers for hovering
            marker.addListener("mouseover", function () {
              infoWindow.open(map, marker);
            });
            marker.addListener("mouseout", function () {
              infoWindow.close();
            });

            // Extend the bounds object with the marker's position, only if the marker is in the UK
            if (
              tweetData.lat > 49 &&
              tweetData.lat < 61 &&
              tweetData.lng > -8 &&
              tweetData.lng < 2
            ) {
              bounds.extend(marker.position);
            }

            // Add an event listener for the markers to show the weather data
            google.maps.event.addListener(marker, "click", function (event) {
              // Get the latitude and longitude from the click event
              let lat = event.latLng.lat();
              let lng = event.latLng.lng();

              // Get the weather data from the GeoNames API
              $.getJSON(
                "http://api.geonames.org/findNearByWeatherJSON?lat=" +
                  lat +
                  "&lng=" +
                  lng +
                  "&username=tomshaw",
                function (data) {
                  // Get the weather data div
                  var weatherData = $("#weather-data");

                  // Animate the weather data div
                  $("#weather-data").animate();

                  // Clear any existing weather data
                  weatherData.empty();

                  // Add the weather data for the clicked location
                  weatherData.append(
                    "<p>Nearest Station: " +
                      data.weatherObservation.stationName +
                      "</p><p>Temperature: " +
                      data.weatherObservation.temperature +
                      "</p><p>Wind speed: " +
                      data.weatherObservation.windSpeed +
                      "</p><p>Wind direction: " +
                      data.weatherObservation.windDirection +
                      "</p><p>Clouds: " +
                      data.weatherObservation.clouds +
                      "</p>"
                  );
                }
              );
            });

            // Add an event listener for the markers to show the directions
            google.maps.event.addListener(marker, "click", function (event) {
              const origin = event.latLng;
              const destination = "NE1 8ST, UK";

              // alert if no origin is selected
              if (origin == null) {
                alert("Please select a marker first");
                return;
              }

              // set up the matrix request
              const matrixRequest = {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
              };

              // set up the directions request
              const directionsRequest = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
              };

              // use the matrix service to get the distance between the origin and destination
              matrixService
                .getDistanceMatrix(matrixRequest)
                .then((response) => {
                  $("#output").text(response.rows[0].elements[0].distance.text);
                });

              // use the directions service to get the directions between the origin and destination
              directionsService.route(
                directionsRequest,
                function (response, status) {
                  if (status === "OK") {
                    directionsRenderer.setDirections(response);
                  } else {
                    window.alert("Directions request failed due to " + status);
                  }
                }
              );
            });
          } else {
            console.log(
              "Geocode was not successful as the user's location was not found"
            );
          }
        }
      );
    }

    // Fit the map to the LatLngBounds object
    map.fitBounds(bounds);

    // button to reset the directions using setDirections() method
    $("#clear-directions").click(function () {
      directionsRenderer.setDirections({ routes: [] });
    });

    // button to reset the map using setCenter() and setZoom() methods
    $("#reset-position").click(function () {
      // Reset the center and zoom level of the map
      map.setCenter(myLatLng);
      map.setZoom(12);
      // Refit the map to the LatLngBounds object
      map.fitBounds(bounds);
    });
  });
}
