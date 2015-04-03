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
          width: canvas.width() || 1200,
          height: canvas.height() || 800,
          container: canvas.attr("id") || "container",
        };
        this.options = $.extend({}, canvasParams, options);

        this.setupCanvas();
      },

      // image is prefferably an instance of Image(), loaded or not doesnt matter
      // alternatively image can be an absolute image-url
      setBackgroundImage: function (image) {
        var imageObj;

        // no image provided - reset background anyways
        if (!image) {
          this.layer_background.removeChildren();
          this.layer_background.clear();
          this.layer_background.remove();
          this.stage.draw();
          this.updateStage({ width: this.options.width, height: this.options.height});
          return;
        }

        // allow image to be an Image() instance
        if (Image.prototype.isPrototypeOf(image) || typeof image === "object") {
          imageObj = image;
        } else {
          imageObj = new Image();

          // some more validation?
          //
          if(typeof image === "string") {
            imageObj.src = image;
          }
        }

        $(imageObj).imgLoad(function(img){
          var backgroundImage = new Kinetic.Image({
              image: img,
              width: img.width,
              height: img.height
            });

          this.layer_background.clear();
          this.layer_background.add(backgroundImage);

          this.updateStage({ width: img.width, height: img.height});
        }.bind(this, imageObj));
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
          this.layer_cursor.removeChildren();
          this.layer_cursor.add(pointerImage);

          this.options.pointerImageUrl = imgUrl;
          this.stage.add(this.layer_cursor);
          this.stage.draw();
        }.bind(this, imageObj);

        imageObj.src = imgUrl;
      },

      saveAsImage: function () {
        // present the rendered image with cursor
        this.stage.toImage({callback:
          function(img){
            var download_action = $("<a />").attr({
                  class: "glyphicon glyphicon-save",
                  text: "Click to download as PNG Image to your computer",
                  download: "cursored_screen.png",
                  href: "#save_this_image",
                  target: "_blank",
                  data: { trackInteraction: '{"category":"action","action":"save file"}' }
                }).on("click keyup", function(){
                  // take the imgs data uri and put it in the links destination href to allow download
                  $(this).attr("href", $(this).parent().find("img").attr("src"));
                }),
                delete_action = $("<a />").attr({
                  class: "glyphicon glyphicon-trash",
                  text: "Click to Delete this Image - you got plenty left anyways right?!",
                  href: "#remove_this_image",
                  data: { trackInteraction: '{"category":"action","action":"delete file"}' }
                }).on("click touch keyup", function(event){
                  // remove the image from the savend images
                  $(this).parents("li").remove();

                  event.preventDefault();
                }),
                li = $("<li>")
                      .append($(img))
                      .append(download_action)
                      .append(delete_action);

            li.addClass("fadeInDown animated");

            $("ul#coursored_imgs").append(li);
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

        this.setPointerImage(this.options.pointerImageUrl);

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
      save:           cMe.saveAsImage.bind(cMe)
    };
  };
})(jQuery, Kinetic);
