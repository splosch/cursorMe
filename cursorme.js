function drawImage(imageObj) { 
  var stage = new Kinetic.Stage({
    container: "container",
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
  imageObj.src = 'cursorImg/hand1.png';
}