"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // Show stars if a user is logged in
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? deleteBtnHTML(): ""}
        ${showStar ? starHTML(story, currentUser): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
          <small class="story-hostname">(${hostName})</small></br>
          <small class="story-author">by ${story.author}</small></br>
          <small class="story-user">posted by ${story.username}</small>
      </li>
      <hr style="border-color:white;opacity:0.3;">
    `);
}

/******************************************************************************
 * Determines the HTML needed for a delete button or star button to be added
 */

/** Delete button HTML */
function deleteBtnHTML() {
  return `
    <span class="delete">
      <i class="fas fa-trash-alt"></i>
    </span>`;
}

/** Star button HTML */
function starHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle the submission of a story from the user */
async function submitStory(evt) {
  evt.preventDefault();
  const author = $("#submit-story-author").val();
  const title = $("#submit-story-title").val();
  const url = $("#submit-story-url").val();
  let newStory = await storyList.addStory(currentUser, {title, author, url});
  
  // Re-generate stories list with the new story
  putStoriesOnPage();
  $submitForm.hide();

  // Clear inputs after submitting
  $("#submit-form").trigger("reset");
}

$submitForm.on("submit", submitStory);

/****************************************************************************************
** Handles showing the favorites list and starring/unstarring a story
*/

/** Show user's favorites on page  */
function putFavoritesOnPage() {
  $favoritesList.empty();
  console.log(currentUser.favorites);
  if (currentUser.favorites.length === 0) {
    // console.log("no favorites");
    $favoritesList.append("<h5>No favorites added!</h5>");
  }
  else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritesList.append($story);
    }
  }
  $favoritesList.show();
}

/** Star/unstar a story */

async function toggleStoryFavorite(evt) {
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  
  // Is not a favorite yet (regular star -> solid star)
  if ($tgt.hasClass("far")) {
    await currentUser.favoriteStory(story);
    $tgt.closest("i").toggleClass("far fas");
  }
  // Is currently a favorite (solid star -> regular star)
  else {
    await currentUser.unfavoriteStory(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", toggleStoryFavorite);

/****************************************************************************************
* Handles showing the user's own stories list and deleting a story
*/

function putMyStoriesOnPage() {
  $ownStories.empty();
  console.log(currentUser.ownStories);
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  }
  else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

/** Handle when user wants to delete a story */
async function deleteStory(evt) {
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  
  await storyList.removeStory(currentUser, storyId); // Call the removeStory method on the storyList
  
  putMyStoriesOnPage(); // Re-generate storyList
}

$ownStories.on("click", ".delete", deleteStory);