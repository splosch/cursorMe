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
 *  @createImage(canvas)
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
          width: canvas.width() || 1200,
          height: canvas.height() || 800,
          container: canvas.attr("id") || "container",
        };
        this.options = $.extend({}, canvasParams, options);

        this.setupCanvas();
      },

      // remove all BAckgroundImage and clear the stage
      resetBackgroundImage: function () {
        this.layer_background.removeChildren();
        this.layer_background.clear();
        this.layer_background.remove();
        this.stage.draw();
        this.updateStage({ width: this.options.width, height: this.options.height});
      },

      /*
       * Returns true if 'thing' is an image object
       * False if anything else
       */
      isImageObject: function (thing) {
        var isImage = (Image.prototype.isPrototypeOf(thing) || typeof thing === "object");

        return isImage;
      },

      /* setBackgroundImage
       * sets the main image on the stage or clears the current stage-background image if no image is given
       *
       * @param image     - optional  - Image() Object that has been loaded already
       * @param callback  - optional  - callback to be executed once the BackgroundImage has been set
       */
      setBackgroundImage: function (image, callback) {
        // no image provided - reset background anyways
        // empty setBackgroundImage() call is used to clear the stage
        if (!this.isImageObject(image) || !image.currentSrc) {
          return this.resetBackgroundImage(callback);
        }

        var backgroundImage = new Kinetic.Image({
            image : image,
            width : image.width,
            height: image.height
        });

        this.layer_background.clear();
        this.layer_background.add(backgroundImage);

        this.updateStage({ width: image.width, height: image.height});

        if(callback && typeof callback === "function") {
          callback();
        }
      },

      setPointerImage: function (image) {
        if (!this.isImageObject(image) || !image.currentSrc){
          return false;
        }

        var pointerImage = new Kinetic.Image({
            image     : image,
            x         : this.stage.getWidth() / 2,
            y         : this.stage.getHeight() / 2,
            width     : image.width,
            height    : image.height,
            draggable : true
          });

        // cursor styling
        pointerImage.on("mouseover", function () {
          document.body.style.cursor = "pointer";
        });
        pointerImage.on("mouseout", function () {
          document.body.style.cursor = "default";
        });

        this.layer_cursor.clear();
        this.layer_cursor.removeChildren();
        this.layer_cursor.add(pointerImage);

        this.options.pointerImage = image;
        this.stage.add(this.layer_cursor);
        this.stage.draw();
      },

      // the callback argument will be handed back with the image as argument
      // and no context specified
      createImage: function (callback) {
        this.stage.toImage({ callback : function(img){
          if (callback) {
            callback.call(null, img);
          }
        }});
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
        this.setPointerImage(this.options.pointerImage);

        // center content
        this.stage.content.style.marginLeft = (- Math.floor(options.width / 2)) + "px";
        this.stage.content.style.marginTop =  (- Math.floor(options.height / 2)) + "px";
        this.stage.content.style.position = "absolute";
        this.stage.content.style.left = "50%";
        this.stage.content.style.top = "50%";
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
      getImage:       cMe.createImage.bind(cMe)
    };
  };
})(jQuery, Kinetic);
