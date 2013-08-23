/*
 *  Drag and drop an (external) image to the canvas
 *  Save the result to an image
 *  by Robert Nyman http://robertnyman.com 
 */


/*
 *  Stage with Background Image (Screenshot)
 *  and on e second Layer have a draggable Cursor-Image 
 *  be able to save the final Canvas
 *
 *  @require jquery.js
 *  @require kinetic.js   // canvas api  //! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License 
 */
;(function ($, K) {

  $.cursorMe = function(el, options) {
    var cursorMe = this;

/* privat */
    var
      // grab the selected Element & apply options 
      init = function() {
        cursorMe.settings = $.extend({}, defaults, options);
        cursorMe.el = el;  
        setupCanvas(cursorMe);
      },

      // prepare canvas
      setupCanvas = function(cMe) {
        cMe.stage = new Kinetic.Stage({
          container: cMe.attr('id'),
          width: cMe.settings['width'],
          height: cMe.settings['height']
        });
        cMe.layer_background = new Kinetic.Layer();
        cMe.layer_cursor     = new Kinetic.Layer();
      },

      hasCursor = function(cMe) {
        return typeof cMe.cursor === "object";
      },

      resolveCursorSrc = function(cursor) {

      },

      /* cursor need to be of format*/
      createCursor = function(cMe, cursor) {
        cMe.cursor.img = new Kinetic.Image({
          image: cMe.cursor.src,
          x: stage.getWidth() / 2,
          y: stage.getHeight() / 2,
          width: cMe.cursor.width,
          height: cMe.cursor.height,
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
      };

/* public */

    cMe.addCursor = function (imgUrl) {
      // get cursor img url
      // if cursor img is present replace old with new
      // derive drop coordinates and place img accoringly
    }

    cMe.removeCursor = function () {
      // remove current cursor if present
    }

    init();
  }

})(jQuery, Kinetic);
