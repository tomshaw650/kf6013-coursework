<?php
/**
 * 
 * OAuth flow for the Living Planet website.
 * Clicking on the 'OAuth' link shows this page, which is at /auth/index.php
 * If the user is not authorised, they are redirected to the callback page, which presents the Google account login.
 * If the log in is successful, the user is redirected back to the index.php page, which is this current page!
 * Log out button will revoke the token and destroy the current session
 * 
 * Adapted from workshop code.
 * 
 * @author Tom Shaw, Kay Rogage
 * 
 */

// Include the Google API PHP Client Library
require_once __DIR__ . '/vendor/autoload.php';

// Start a session to persist credentials
session_start();

// Set up the Google client
$client = new Google\Client();
$client->setAuthConfig("client_secret.json");
$client->addScope("https://www.googleapis.com/auth/userinfo.email");

// Redirect to OAuth flow or initialize a token
if(isset($_SESSION['access_token']) && $_SESSION['access_token']) {
  $client->setAccessToken($_SESSION["access_token"]);

  // page HEREDOC to set up the page html properly, including head
  $html = <<<HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Living Planet | OAuth</title>
      <link rel="icon" type="image/x-icon" href="../assets/images/favicon.ico" />

      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <link rel="stylesheet" href="../assets/styles/main.css" />
      <link rel="stylesheet" href="../assets/styles/navbar.css" />
    </head>
    <header>
      <a id="header-link" href="/">
        <h1>Living Planet</h1>
      </a>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/feed.html">Feed</a>
          </li>
          <li>
            <a href="/auth/index.php">OAuth</a>
          </li>
          <li>
            <a href="/about.html">About</a>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <h2>About OAuth</h2>
      <p id="about">The OAuth process for this website is created in PHP using Google OAuth.</p>
      <p id="about">Firstly, the Google OAuth is set up in the Google Developer Console, enabling the callback URL, base URL and any test accounts.</p>
      <p id="about">The page link on this website first goes to auth/index.php. If the user is not authorised, they are redirected to the callback page, which presents the Google account login.</p>
      <p id="about">If the log in is successful, the user is redirected back to the index.php page, which is this current page!</p>
      <p id="about">A log out button is displayed below. Click this to log out of the Google account and destroy the session.</p>
      <p id="about">There is no way to get to this current page without authorisation.</p>
      <br />
      <form action='index.php' method='post'>
        <input id="logout" type='submit' name='logout' value='Logout' />
      </form>
    </main>
  HTML;

  echo $html;
} else {
  // Redirect to OAuth flow
  $redirect_uri = "http://" . $_SERVER["HTTP_HOST"] . "/auth/oauth2callback.php";
  header("Location: " . filter_var($redirect_uri, FILTER_SANITIZE_URL));
  exit();
}

// Log out upon clicking the button.
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['logout'])) {
  $client->revokeToken($_SESSION["access_token"]);

  session_destroy();

  $redirect = "http://" . $_SERVER["HTTP_HOST"] . "/index.html";
  header("Location: " . filter_var($redirect, FILTER_SANITIZE_URL));
  exit();
}
?>