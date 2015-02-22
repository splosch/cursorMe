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

 /* globals jQuery, Kinetic */

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
          width: 600,
          height: 400,
          container: canvas.attr("id") || "container",
        };
        this.options = $.extend({}, canvasParams, options);

        this.setupCanvas();
      },

      setBackgroundImage: function (imgUrl) {
        var imageObj = new Image();

        imageObj.onload = function(img) {
          var backgroundImage = new Kinetic.Image({
              image: img,
              width: img.width,
              height: img.height
            });

          this.layer_background.clear();
          this.layer_background.add(backgroundImage);

          this.updateStage({ width: img.width, height: img.height});
        }.bind(this, imageObj);

        imageObj.src = imgUrl;
      },

      setPointerImage: function (imgUrl) {
        var imageObj = new Image();

        imageObj.onload = function(img) {
          var pointerImage = new Kinetic.Image({
              image: img,
              x: this.stage.getWidth() / 2,
              y: this.stage.getHeight() / 2,
              width: img.width,
              height: img.height,
              draggable: true
            });

          // cursor styling
          pointerImage.on("mouseover", function () {
            document.body.style.cursor = "pointer";
          });
          pointerImage.on("mouseout", function () {
            document.body.style.cursor = "default";
          });

          this.layer_cursor.clear();
          this.layer_cursor.add(pointerImage);

          this.updateStage();
        }.bind(this, imageObj);

        imageObj.src = imgUrl;
      },

      saveAsImage: function () {
        // present the rendered image with cursor
        this.stage.toImage({callback:
          function(img){
            $("#myCoursoredImg").append($(img));
          }
        });
      },

      /* redraw the stage and all layers
       * after changes in the layers occurred
       * @options, optional, object containing stage option changes { width : 123, height : 456}
       */
      updateStage: function (options) {
        if (options) {
          if (options.width) {this.stage.setWidth(options.width);}
          if (options.height) {this.stage.setHeight(options.height);}
        }

        this.stage.clear();
        this.stage.add(this.layer_background);
        this.stage.add(this.layer_cursor);

        //finally draw onto canvas
        this.stage.draw();
      },

      addEventHandlers: function () {

      },

      setupCanvas: function () {
        this.stage = new Kinetic.Stage({
          container: this.options.container,
          width: this.options.width,
          height: this.options.height
        });

        //prepare stage layers
        this.layer_background = new Kinetic.Layer();
        this.layer_cursor     = new Kinetic.Layer();

        this.stage.draw();
      },

      setupDragnDrop: function () {
        var stageContainer = this.stage.getContainer();

        $(stageContainer).on("dragover", function (event) {
          event.preventDefault();
        });
      }
    };

    if(canvas) {
      cMe.init(canvas);
    }

    // the API
    return {
      setBackground:  cMe.setBackgroundImage.bind(cMe),
      setPointer:     cMe.setPointerImage.bind(cMe),
      save:           cMe.saveAsImage.bind(cMe)
    };
  };
})(jQuery, Kinetic);
