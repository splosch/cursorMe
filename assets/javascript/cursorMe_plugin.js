/*
 *  cursormeStage
 *  Stage with Background Image (Screenshot)
 *  and on e second Layer have a draggable Cursor-Image
 *  be able to save the final Canvas
 *
 *  #attributes
 *  - element   @jQueryObject   element to be bound to
 *  - stage     @kineticStage   kineticStage instance
 *    - background_layer
 *    - foreground_layer
 *    - @updateStage(data)
 *
 *  #public_methods
 *  @drawBackgroundImage(imgData)
 *  @changePointer(imgData)
 *  @saveAsImage(canvas)
 *
 *  #evt_listeners
 *  @pointer.isDraggable()
 *
 *  #dependencies
 *  @require jquery.js
 *  @require kinetic.js   // canvas api  //! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com
 *            by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License
 */

(function ($, Kinetic) {
  "use strict";

  $.cursorMe = function (canvas, options) {
    var cMe = {
      options: $.extend({ "no_options_yet": true }, options),

      /*  initialize cursorMe with a provided canvas jQuery Object
       *
       */
      init: function (canvas) {
        var canvasParams = {
          width: $(canvas).width(),
          height: $(canvas).height(),
          id: $(canvas).attr("id") || "cursorMeCanvas",
        };
        this.options = $.extend({}, canvasParams, options);

        this.setupCanvas();
        this.setBackgroundImage();
        this.setPointerImage();
      },
      setBackgroundImage: function (imgData) {
        // change the background image
        var backgroundImage = new Kinetic.Image();

        backgroundImage.setImage(new Image(imgData));

        this.layer_background.clear();
        this.layer_background.add(backgroundImage);

        //finally draw onto canvas
        this.layer_background.draw();
      },
      setPointerImage: function (imgData) {
        // change the pointer
        var cursorImg = new Kinetic.Image({
          image: imgData,
          x: this.stage.getWidth() / 2,
          y: this.stage.getHeight() / 2,
          width: this.imgData.width,
          height: this.imgData.height,
          draggable: true
        });

        // cursor styling
        cursorImg.on("mouseover", function () {
          document.body.style.cursor = "pointer";
        });
        cursorImg.on("mouseout", function () {
          document.body.style.cursor = "default";
        });

        this.layer_cursor.clear();
        this.layer_cursor.add(cursorImg);

        //finally draw onto canvas
        this.stage.add(this.layer_cursor.draw());
      },
      saveAsImage: function () {
        // present the rendered image with cursor
        return true;
      },
      updateStage: function () {
        // rerender the stage after changes
        return true;
      },
      addEventHandlers: function () {

      },
      setupCanvas: function () {
        this.stage = new Kinetic.Stage({
          container: this.settings.id,
          width: this.settings.width,
          height: this.settings.height
        });

        //prepare stage layers
        this.layer_background = new Kinetic.Layer();
        this.layer_cursor     = new Kinetic.Layer();
      },

      setupDragnDrop: function () {
        var stageContainer = this.stage.getContainer();

        $(stageContainer).on("dragover", function (event) {
          event.preventDefault();
        });
      }
    };

    // the API
    return {
      setBackground:  cMe.setBackgroundImage,
      setPointer:     cMe.setPointerImage,
      save:           cMe.saveAsImage
    };
  };
})(jQuery, Kinetic);
