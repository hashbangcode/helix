<?php

// Put your Helix IP address here.
$helixIp = '192.168.x.x';

// This is a list of Helix API functions that will be proxied to the Helix.
$apiFunctions = [
  '/getStatus',
  '/getFiles',
  '/playFile',
  '/Event',
  '/getTracks',
  '/setVolume',
  '/pickZone',
  '/getGenericSettings',
  '/ssids',
];

if (in_array($_SERVER["PATH_INFO"], $apiFunctions)) {
  // Proxy the API call to the Helix.
  $url = 'http://'. . $helixIp . $_SERVER['REQUEST_URI'];
  $ch = curl_init();
  $user_agent = "Mozilla/4.0";
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
  curl_setopt($ch, CURLOPT_TIMEOUT, 120);
  $contents = curl_exec($ch);
  curl_close($ch);
  print $contents;
}
else {
  // Return the index.html page.
  include 'index.html';
}
