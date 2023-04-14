/**
 *
 * JQUery code associated with the Feed page.
 *
 * @author Tom Shaw
 *
 */

$(document).ready(function () {
  $.getJSON("./assets/data/kf6013_assignment_data.json", function (data) {
    // filter all the tweets to only include those with the #netzero or #climatechange hashtag
    climateData = data.statuses.filter(function (tweet) {
      const hashtags = tweet.entities.hashtags;
      for (let i = 0; i < hashtags.length; i++) {
        if (
          hashtags[i].text.toLowerCase() === "netzero" ||
          hashtags[i].text.toLowerCase() === "climatechange"
        ) {
          return true; // include the tweet in the climateData
        }
      }
      return false; // exclude the tweet from the climateData
    });

    // iterate over the filtered data array, displaying each tweet in a div
    $.each(climateData, function (index, value) {
      // create required elements for each tweet
      const container = $("<div>");
      const username = $("<span>");
      const location = $("<span>");

      // add styling to the container div
      container.css("display", "flex");
      container.css("flex-direction", "column");
      container.css("border", "1px solid black");
      container.css("padding", "0.5em");
      container.css("margin-bottom", "0.5em");

      // add styling to the username span
      username.css("font-weight", "bold");
      username.css("font-size", "1.2em");

      // add styling to the location span
      location.css("font-style", "italic");
      location.css("font-size", "0.8em");

      // set the username span text to the username
      username.text(value.user.screen_name);

      // set the location span text to the user's location
      location.text(
        value.user.location ? value.user.location : "Location not set"
      );

      // if #tweet-container exists in the DOM, add the tweet to it
      if ($("#tweet-container").length) {
        // set the div text to the tweet's body
        container.append(value.text);

        // add the username span to the start of the div
        container.prepend(username);

        container.append(location);

        // Add the div to the HTML document
        $("#tweet-container").append(container);
      }
    });
  });
});
