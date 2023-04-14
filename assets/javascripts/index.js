/**
 *
 * JQuery code associated with the index page.
 *
 * @author Tom Shaw
 *
 */
$(document).ready(function () {
  // Toggle the left side panel
  $("#left-toggle-panel").click(function () {
    $("#left-side-panel").toggleClass("open");
    $("#left-toggle-panel").toggleClass("open");
    $("#left-toggle-panel").html(
      $("#left-toggle-panel").hasClass("open") ? "&lt;" : "&gt;"
    );
  });

  // Toggle the right side panel
  $("#right-toggle-panel").click(function () {
    $("#right-side-panel").toggleClass("open");
    $("#right-toggle-panel").toggleClass("open");
    $("#right-toggle-panel").html(
      $("#right-toggle-panel").hasClass("open") ? "&gt;" : "&lt;"
    );
  });

  /* By default, set the weather info to Living PLanet HQ's location */
  // Set the default location
  const myLatLng = { lat: 54.97828736453621, lng: -1.6182544814153705 };

  // Fetch from the GeoNames API and add the weather data to the page
  $.getJSON(
    "http://api.geonames.org/findNearByWeatherJSON?lat=" +
      myLatLng.lat +
      "&lng=" +
      myLatLng.lng +
      "&username=tomshaw",
    function (data) {
      var weatherData = $("#weather-data");

      // Clear any existing weather data
      weatherData.empty();

      // Add the weather data for the default location
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
