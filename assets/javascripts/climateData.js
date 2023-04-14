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

const getClimateData = () => {
  if (climateData !== undefined) return climateData;
};
