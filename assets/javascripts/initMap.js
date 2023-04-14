function initMap() {
  $(document).ready(function () {
    let map;
    let data = getClimateData();

    const matrixService = new google.maps.DistanceMatrixService();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const myLatLng = { lat: 54.97828736453621, lng: -1.6182544814153705 };
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

    map = new google.maps.Map($("#map")[0], mapOptions);
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-renderer"));

    const bounds = new google.maps.LatLngBounds();

    // uses climateData from ./feed.js to create markers on the map
    for (let i = 0; i < data.length; i++) {
      const tweetData = data[i];

      if (!tweetData.user.location) {
        tweetData.user.location = "Unknown";
      }

      let tweetInfoWindow =
        `<div>` +
        `<span>${tweetData.user.screen_name}</span>` +
        `<br>` +
        `<span>${tweetData.user.name}</span>` +
        `<br>` +
        `<p>${tweetData.text}</p>` +
        `<br>` +
        `<span>${tweetData.user.location}</span>` +
        `</div>`;

      let infoWindow = new google.maps.InfoWindow({
        content: tweetInfoWindow,
        ariaLabel: "Tweet Info",
        disableAutoPan: true,
      });

      $.getJSON(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${tweetData.user.location}&key=AIzaSyB-LttAINsVamd6LyIzQbFYxn-9GmPfKZY`,
        function (data) {
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

              $.getJSON(
                "http://api.geonames.org/findNearByWeatherJSON?lat=" +
                  lat +
                  "&lng=" +
                  lng +
                  "&username=tomshaw",
                function (data) {
                  var weatherData = $("#weather-data");

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

            google.maps.event.addListener(marker, "click", function (event) {
              const origin = event.latLng;
              const destination = "NE1 8ST, UK";
              if (origin == null) {
                alert("Please select a marker first");
                return;
              }

              const matrixRequest = {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
              };

              const directionsRequest = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
              };

              matrixService
                .getDistanceMatrix(matrixRequest)
                .then((response) => {
                  $("#output").text(response.rows[0].elements[0].distance.text);
                });

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

    $("#clear-directions").click(function () {
      directionsRenderer.setDirections({ routes: [] });
    });

    $("#reset-position").click(function () {
      // Reset the center and zoom level of the map
      map.setCenter(myLatLng);
      map.setZoom(12);
      // Refit the map to the LatLngBounds object
      map.fitBounds(bounds);
    });
  });
}
