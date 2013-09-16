/*
 *  Drag and drop an (external) image to the canvas
 *  Save the result to an image
 *  by Robert Nyman http://robertnyman.com 
 */

(function () {
  var imgSrc = null,
    canvas = document.getElementById("my-canvas"),
    context = canvas.getContext("2d"),
    img = document.createElement("img"),
    mouseDown = false,
    brushColor = "rgb(0, 0, 0)",
    hasText = true,
    $("#imgSrc").on("dragstart", function(evt){
      imgSrc = this;
    }),
    clearCanvas = function () {
      if (hasText) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        hasText = false;
      }
    };
    
  // Adding instructions
  context.fillText("Drop an image onto the canvas", 240, 200);
  context.fillText("Click a spot to set as brush color", 240, 220);
  
  // Image for loading  
  img.addEventListener("load", function () {
    clearCanvas();
    context.drawImage(img, 0, 0);
  }, false);
  
  // Detect mousedown
  canvas.addEventListener("mousedown", function (evt) {
    clearCanvas();
    mouseDown = true;
    context.beginPath();
  }, false);
  
  // Detect mouseup
  canvas.addEventListener("mouseup", function (evt) {
    mouseDown = false;
    var colors = context.getImageData(evt.layerX, evt.layerY, 1, 1).data;
    brushColor = "rgb(" + colors[0] + ", " + colors[1] + ", " + colors[2] + ")";
  }, false);
  
  // Draw, if mouse button is pressed
  canvas.addEventListener("mousemove", function (evt) {
    if (mouseDown) {
      context.strokeStyle = brushColor;               
      context.lineWidth = 20;
      context.lineJoin = "round";
      context.lineTo(evt.layerX+1, evt.layerY+1);
      context.stroke();
    }
  }, false);

  // To enable drag and drop
  canvas.addEventListener("dragover", function (evt) {
    evt.preventDefault();
  }, false);

  // Handle dropped image file - only Firefox and Google Chrome
  canvas.addEventListener("drop", function (evt) {
    
    evt.preventDefault();
  });
  
  // Save image
  var saveImage = document.createElement("button");
  saveImage.innerHTML = "Save canvas";
  saveImage.addEventListener("click", function (evt) {
    window.open(canvas.toDataURL("image/png"));
    evt.preventDefault();
  }, false);
  document.getElementById("myCoursoredImg").appendChild(saveImage);
})();


/*
 *  Reposition an image inside a Cnavas
 *
 *
 */
(function () {
  function drawImage(imageObj) { 
    var stage = new Kinetic.Stage({
      container: "my-canvas",
      width: 578,
      height: 200
    });
    var layer = new Kinetic.Layer();

    // darth vader
    var darthVaderImg = new Kinetic.Image({
      image: imageObj,
      x: stage.getWidth() / 2 - 200 / 2,
      y: stage.getHeight() / 2 - 137 / 2,
      width: 16,
      height: 24,
      draggable: true
    });

    // add cursor styling
    darthVaderImg.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    darthVaderImg.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });

    layer.add(darthVaderImg);
    stage.add(layer);
  }


  var imageObj = new Image();

  imageObj.onload = function() {
    drawImage(this);
  };

  imageObj.src = 'resources/cursorImg/hand1.png';
})();



