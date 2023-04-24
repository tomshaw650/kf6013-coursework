<?php
/**
 * 
 * Create the callback URL for Google OAuth, sending the user to a Google login page
 * Create a session and set the config and redirect uri
 * Also add the scope for the user's email address
 * If they are not authenticated, set the location header and auth url.
 * If they are, authenticate the user and set the access token in the session.
 * 
 * This code is adapted from the workshop.
 * 
 * @author Tom Shaw, Kay Rogage 
 * 
 */

require_once __DIR__ . '/vendor/autoload.php';

session_start();

$client = new Google\Client();

$client->setAuthConfig('client_secret.json');
$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/auth/oauth2callback.php');
$client->addScope("https://www.googleapis.com/auth/userinfo.email");

if (!isset($_GET['code'])) {
  $auth_url = $client->createAuthUrl();
  header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
} else {
  $client->authenticate($_GET['code']);
  $_SESSION['access_token'] = $client->getAccessToken();
  $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/auth/index.php';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
  exit();
}
?>