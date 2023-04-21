<?php

require_once __DIR__ . '/vendor/autoload.php';

session_start();

// Set up the Google client.
$client = new Google\Client();
$client->setAuthConfig("client_secret.json");
$client->addScope("https://www.googleapis.com/auth/userinfo.email");

if(isset($_SESSION['access_token']) && $_SESSION['access_token']) {
  $client->setAccessToken($_SESSION["access_token"]);

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
      <p id="about">Blah blah blah</p>
      <br />
      <form action='index.php' method='post'>
        <input id="logout" type='submit' name='logout' value='Logout' />
      </form>
    </main>
  HTML;

  echo $html;
} else {
  $redirect_uri = "http://" . $_SERVER["HTTP_HOST"] . "/auth/oauth2callback.php";
  header("Location: " . filter_var($redirect_uri, FILTER_SANITIZE_URL));
  exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['logout'])) {
  $client->revokeToken($_SESSION["access_token"]);

  session_destroy();

  $redirect = "http://" . $_SERVER["HTTP_HOST"] . "/index.html";
  header("Location: " . filter_var($redirect, FILTER_SANITIZE_URL));
  exit();
}
?>