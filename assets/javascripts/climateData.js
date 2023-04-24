/**
 *
 * This file contains the code to retrieve the climate data from the JSON file
 * Filters it down to the appropriate data, and allows it to be used throughout the site.
 *
 * @author Tom Shaw
 *
 */

$(document).ready(() => {
  setClimateData();
});

// initialise the climateData variable
let climateData;

// Set the climateData to the filtered tweet data
const setClimateData = () => {
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
  });
};

// getter method. if the climateData is not undefined, return it
const getClimateData = () => {
  if (climateData !== undefined) return climateData;
};
