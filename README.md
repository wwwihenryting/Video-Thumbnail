# Video-Thumbnail
Video Thumbnail
William Henry Ting
wwwi.henryting@gmail.com

My design is showing the video with play,pause,fullscreen button. A thumbnail that has "ADS" text in it will appear with the set time(at 4s of video) marked with a red line in the seekbar and will disappear at set time (at 60s of video). The video player will only play the video for a maximum of 3 minute.

Instruction for setup
<ol>
  <li>Clone the git in your own environment</li>
  <li>Upload/put video in src folder with file named as "test.mp4" or "test.ogg" </li>
  <li>Open the "index.html" file</li>
  <li>Play the video</li>
  <li>
    When Thumbnail appear can be setup in js/video-player.js
    <ul>
      <li>var thumbMinTime = 4; //SECONDS WHERE THUMBNAIL and RED INDICATOR in seekbar APPEAR</li>
      <li>var thumbMaxTime = 60; //SECONDS WHERE THUMBNAIL WILL DISAPPER</li>
  </li>
<ol>
