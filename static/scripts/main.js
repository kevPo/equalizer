
var output = document.getElementById('output');
var canvas = document.getElementById('equalizerCanvas');
var canvasContext = canvas.getContext('2d');
var color = 'rgba(88, 197, 67, 0.3)';

var player = document.createElement('audio');
var audio = document.createElement('audio');
var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
var animationFrame = null;
var isPaused = false;

document.body.appendChild(player);
source = audioContext.createMediaElementSource(audio);
source.connect(analyser);

function stopEvent (event) {
  event.preventDefault();
  event.stopPropagation();
}

function windowResize () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.onresize = windowResize;
windowResize();

function reduce (array, size) {
  if (size >= array.length) { return array; }
  var newArray = [];
  var step = parseInt(array.length / size);
  
  for (var i = 0; i < array.length; i += step) {
    var sum = 0;
    for (var j = 0; j < step && (i + j) < array.length; j++) {
      sum += array[i + j];
    }
    newArray.push(parseInt(sum / step));
  }
  
  return newArray;
}

function renderFrame (audio, analyser) {
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);
  frequencyData = reduce(frequencyData, canvas.width / 10);
  
  var columnWidth = canvas.width / frequencyData.length;
  var columnHeight = canvas.height / 255;
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.3)';
  canvasContext.strokeStyle = color;
  canvasContext.lineCap = 'round';
  
  canvasContext.beginPath();
  canvasContext.moveTo(0, canvas.height);
  for (var i = 1; i < frequencyData.length; i++) {
    canvasContext.lineTo(i * columnWidth, canvas.height - 10 - frequencyData[i] * columnHeight);
  }
  canvasContext.lineTo(canvas.width, canvas.height);
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.stroke();
  
  animationFrame = requestAnimationFrame(function () {
    renderFrame(audio, analyser);
  });
}

function playAudio (url, name) {
  audio.autoplay = true;
  player.autoplay = true;
  audio.src = url;
  player.src = url;
  audio.play();
  player.play();
  $('h1').html(name);
  cancelAnimationFrame(animationFrame);
  renderFrame(audio, analyser);
}

function continueAudio() {
  $('#toggleTunes').html('Pause Tunes');
  audio.play();
  player.play();
  isPaused = false;
}

function pauseAudio() {
  $('#toggleTunes').html('Continue Tunes');
  audio.pause();
  player.pause();
  isPaused = true;
}

function dropAudio (event) {
  $('#toggleTunes').fadeIn();
  stopEvent(event);
  var file = event.originalEvent.dataTransfer.files[0];
  var url = URL.createObjectURL(file);
  playAudio(url, file.name);
}

function toggleAudio () {
  if (isPaused)
    continueAudio();
  else
    pauseAudio();
}

setInterval(function() {
  var r = getRandomNumberBetween(0, 256);
  var g = getRandomNumberBetween(0, 256);
  var b = getRandomNumberBetween(0, 256);

  color = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.6)';
}, 3000);

function getRandomNumberBetween(from, to) {
  return Math.floor((Math.random() * to) + from + 1);
}

$(window)
  .on('dragover', stopEvent)
  .on('dragenter', stopEvent)
  .on('drop', dropAudio)
  .keypress(function(e) {
    if (e.keyCode == 0 || e.keyCode == 32) {
      toggleAudio();
    }
  });

$('#toggleTunes').on('click', function() {
  
});