"use strict";

/** TO-DO: ADD STYLING FOR ENTIRE PAGE
 * 
 */

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  if (!$submitForm.hasClass("hidden")) {
    $submitForm.addClass("hidden");
  }
}

$body.on("click", "#nav-all", navAllStories);

/** Show form to submit a new story */
function navSubmitClick(evt) {
  hidePageComponents();
  $submitForm.show();
  putStoriesOnPage();
}

$navSubmit.on("click", navSubmitClick);

/** Show list of favorites */
function navFavoritesClick(evt) {
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavoritesClick);

/** Show list of the user's own stories */
function navMyStories(evt) {
  hidePageComponents();
  putMyStoriesOnPage();
}

$navMyStories.on("click", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
