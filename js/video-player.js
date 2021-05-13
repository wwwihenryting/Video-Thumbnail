(function () {
	'use strict';

	// Does the browser actually support the video element?
	var supportsVideo = !!document.createElement('video').canPlayType;

	if (supportsVideo) {

		//THUMBNAIL
		var thumbnail = document.createElement('span');
		thumbnail.innerText = 'ADS';
		thumbnail.className = 'ad-thumb';
		thumbnail.id = 'ad-thumb';
		var thumbMark = document.createElement('span');
		thumbMark.id = 'thumb_mark';

		var thumbMinTime = 4;
		var thumbMaxTime = 60;
		var thumbShow = false;

		// Obtain handles to main elements
		var videoContainer = document.getElementById('videoContainer');
		var video = document.getElementById('video');
		var videoControls = document.getElementById('video-controls');
		var progressContainer = document.getElementById('progressContainer');

		//MAX 3 MINUTES
		var video_duration = video.duration;
		if(video_duration > 180){
			video_duration = 180;
		}

		// Hide the default controls
		video.controls = false;

		// Display the user defined video controls
		videoControls.setAttribute('data-state', 'visible');

		// Obtain handles to buttons and other elements
		var playpause = document.getElementById('playpause');
		var mute = document.getElementById('mute');
		var progress = document.getElementById('progress');
		var progressBar = document.getElementById('progress-bar');
		var fullscreen = document.getElementById('fs');
		var timerText = document.getElementById('timer');

		// If the browser doesn't support the progress element, set its state for some different styling
		var supportsProgress = (document.createElement('progress').max !== undefined);
		if (!supportsProgress) progress.setAttribute('data-state', 'fake');

		// Check if the browser supports the Fullscreen API
		var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
		// If the browser doesn't support the Fulscreen API then hide the fullscreen button
		if (!fullScreenEnabled) {
			fullscreen.style.display = 'none';
		}


		//POSITIONING THUMBARK
		var updateThumbMark = function(){
			var thumbMark_position = Math.floor((thumbMinTime / video_duration) * progress.offsetWidth);
			thumbMark.style.left = thumbMark_position+'px';
			progressContainer.appendChild(thumbMark);
		}
		updateThumbMark();

		var toggleThumbnail = function(){
			if(document.getElementById('ad-thumb') !== null){
				document.getElementById('ad-thumb').remove();
				thumbShow = false;
			}else{
				videoContainer.appendChild(thumbnail);
				thumbShow = true;
			}
		}


		// Change the volume
		var alterVolume = function(dir) {
			checkVolume(dir);
		}

		// Set the video container's fullscreen state
		var setFullscreenData = function(state) {
			videoContainer.setAttribute('data-fullscreen', !!state);
			// Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
			fullscreen.setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
		}

		// Checks if the document is currently in fullscreen mode
		var isFullScreen = function() {
			return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
		}

		// Fullscreen
		var handleFullscreen = function() {
			// If fullscreen mode is active...	
			if (isFullScreen()) {
					// ...exit fullscreen mode
					// (Note: this can only be called on document)
					if (document.exitFullscreen) document.exitFullscreen();
					else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
					else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
					else if (document.msExitFullscreen) document.msExitFullscreen();
					setFullscreenData(false);
				}
				else {
					// ...otherwise enter fullscreen mode
					// (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
					if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
					else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
					else if (videoContainer.webkitRequestFullScreen) {
						// Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
						// ensures that our custom controls are visible:
						// figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
						// figure[data-fullscreen=true] .controls { z-index:2147483647; }
						video.webkitRequestFullScreen();
					}
					else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
					setFullscreenData(true);
				}
			}

		// Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
		if (document.addEventListener) {
			// Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
			video.addEventListener('loadedmetadata', function() {

				progress.setAttribute('max', video_duration);
			});

			// Changes the button state of certain button's so the correct visuals can be displayed with CSS
			var changeButtonState = function(type) {
				// Play/Pause button
				if (type == 'playpause') {
					if (video.paused || video.ended) {
						playpause.setAttribute('data-state', 'play');
					}
					else {
						playpause.setAttribute('data-state', 'pause');
					}
				}
				// Mute button
				else if (type == 'mute') {
					mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
				}
			}

			// Add event listeners for video specific events
			video.addEventListener('play', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('pause', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('volumechange', function() {
				checkVolume();
			}, false);

			// Add events for all buttons			
			playpause.addEventListener('click', function(e) {
				if (video.paused || video.ended) video.play();
				else video.pause();
			});			


			mute.addEventListener('click', function(e) {
				video.muted = !video.muted;
				changeButtonState('mute');
			});
			fs.addEventListener('click', function(e) {
				handleFullscreen();
			});

			// As the video is playing, update the progress bar
			var videoCurrentTime, videoMaxTime;
			video.addEventListener('timeupdate', function() {
				// For mobile browsers, ensure that the progress element's max attribute is set
				if (!progress.getAttribute('max')) progress.setAttribute('max', video_duration);
				progress.value = video.currentTime;
				progressBar.style.width = Math.floor((video.currentTime / video_duration) * 100) + '%';

				//MAXIMUM 3 MINUTES
				if(video.currentTime >= video_duration){
					video.pause();
					changeButtonState('playpause');
				}

				//THUMBNAIL SHOWING FUNCTION
				videoCurrentTime = formatNumber(Math.floor(video.currentTime/60))+':'+formatNumber(Math.floor(video.currentTime%60));
				videoMaxTime = formatNumber(Math.floor(video_duration/60))+':'+formatNumber(video_duration%60);
				timerText.innerText = videoCurrentTime + ' / ' + videoMaxTime;
				if(Math.floor(video.currentTime) >= thumbMinTime && Math.floor(video.currentTime) <= thumbMaxTime){
					if(!thumbShow){
						toggleThumbnail();
					}
				}else{
					if(thumbShow){
						toggleThumbnail()
						thumbShow = false;
					}
				}
			});

			var formatNumber = function(number){
				console.log(number);
				return number.toLocaleString('en-US', {
				    minimumIntegerDigits: 2,
				    useGrouping: false
				  });
			}


			// React to the user clicking within the progress bar
			progress.addEventListener('click', function(e) {
				// var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth; // Also need to take the parent into account here as .controls now has position:relative
				var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft + this.offsetParent.offsetParent.offsetLeft + this.offsetParent.offsetParent.offsetParent.offsetLeft)) / this.offsetWidth;
				video.currentTime = pos * video_duration;

			});

			// Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
			document.addEventListener('fullscreenchange', function(e) {
				setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
				updateThumbMark();
			});
			document.addEventListener('webkitfullscreenchange', function() {
				setFullscreenData(!!document.webkitIsFullScreen);
				updateThumbMark();
			});
			document.addEventListener('mozfullscreenchange', function() {
				setFullscreenData(!!document.mozFullScreen);
				updateThumbMark();
			});
			document.addEventListener('msfullscreenchange', function() {
				setFullscreenData(!!document.msFullscreenElement);
				updateThumbMark();
			});
		}
	 }

 })();