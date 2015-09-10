 /* globals $, Dropzone, ga */

$(function( Dropzone ) {
  "use strict";

  window._gaq = window._gaq || [];

  var app = {},
      SEL_PAGE        = "#page",
      SEL_CONTAINER   = "#container",
      SEL_POINTER     = "input[type='radio'][name='cursortype']",
      SEL_POINTER_IMG = "input[type='radio'][name='cursortype']:checked + label img",
      SEL_IMG_THUMBS  = "ul#coursored_imgs",
      EVT_CLICK       = "click touchend keyup",
      SEL_TOGGLE_GA   = "input[type='radio'][name='track']",
      ACTION_EL       = {
                          save:  "#save_the_image",
                          reset: "#reset_background",
                          upload: "#upload_image"
                        };

  app = {
    dropzone: {},
    fallbackPointerUrl: "assets/images/icons/hand1.png",

    init: function () {
      var dropzoneOptions = {
        previewsContainer : false,
        url               : "/#",
        clickable         : [SEL_CONTAINER, ACTION_EL.upload]
      };

      this.page = $(SEL_PAGE);
      this.canvas   = $.cursorMe($(SEL_CONTAINER));
      this.dropzone = new Dropzone(SEL_CONTAINER, dropzoneOptions);

      this.updatePointer();
      this.addEventHandlers();
    },

    addEventHandlers: function () {
      // set background image if dropzone detects that a image was added to the canvas
      this.dropzone.on("imagefullsize", function(file, image) {
        this.canvas.setBackground(image);
      }.bind(this));

      // handle changing the current cursor
      this.page.on("change", SEL_POINTER, function(event){
        this.updatePointer();
      }.bind(this));

      // ask the cursorMe canvas to return the created image and handle it
      this.page.on(EVT_CLICK, ACTION_EL.save, function(event){
        this.canvas.getImage(this.handleCreatedImage);
      }.bind(this));

      // remove current image from the stage
      this.page.on(EVT_CLICK, ACTION_EL.reset, function(event){
        this.canvas.setBackground();
        this.updatePointer();
      }.bind(this));

      this.page.on(EVT_CLICK, "[data-track-interaction]", function(event){
        this.trackInteraction(event);
      }.bind(this));

      $("#toggle_ga_tracking").on("change", SEL_TOGGLE_GA, function(event){
        this.toggleGoogleAnalyticsTracking($(event.currentTarget).is("[value=1]"));
      }.bind(this));
    },

    /* Takes the currently selected pointer image and hands it over
     * to the cursorMe Stage to update the cursor
     */
    updatePointer: function () {
      var pointerImgUrl  = $(SEL_POINTER_IMG).attr("src") || this.fallbackPointerUrl,
          pointerImg = new Image();

      pointerImg.src = pointerImgUrl;

      $(pointerImg).on("load", this.canvas.setPointer(pointerImg));
    },

    /* Once a new image has been created,
     * handleCreatedImage(image) takes care of presenting the outcome to the user
     * Creation of a thumbnail & allowing to save or delete the created images
     */
    handleCreatedImage: function ( image ) {
      var download_action = $("<a />"),
          delete_action   = $("<a />"),
          newThumbnail    = $("<li>").append($(image).attr({width: "150"}))
                                     .addClass("fadeInDown animated");
      download_action.attr({
        class: "glyphicon glyphicon-save",
        text: "Click to download as PNG Image to your computer",
        download: "cursored_screen.png",
        href: "#save_this_image",
        target: "_blank",
        "data-track-interaction" : '{"category":"image","action":"save","label":"save_to_file"}'
      }).on("click keyup", function(){
        // take the imgs data uri and put it in the links destination href to allow download
        $(this).attr("href", $(this).parent().find("img").attr("src"));
      });

      delete_action.attr({
        class: "glyphicon glyphicon-trash",
        text: "Click to Delete this Image - you got plenty left anyways right?!",
        href: "#remove_this_image",
        "data-track-interaction" : '{"category":"thumb","action":"delete","label":"delete_thumb"}'
      }).on(EVT_CLICK, function(event){
        // remove the image from the savend images
        $(this).parents("li").remove();

        event.preventDefault();
      });

      newThumbnail.append(download_action)
                  .append(delete_action);

      $(SEL_IMG_THUMBS).append(newThumbnail);
    },

    /* interaction tracking interface for google analytics
     * is fired from interaction with `[data-track-interaction]` data-attribute flagged items
     * the attributes value contains data required for genearating a tracking event
     * see https://developers.google.com/analytics/devguides/ for API details
     */
    trackInteraction: function (event) {
      var tracking_options    = { hitType : "event" },
          ordered_trackables  = ["category", "action", "label", "value"],
          ga_option_map       = {
                                  "category"  : "eventCategory",    // Required.
                                  "action"    : "eventAction",      // Required.
                                  "label"     : "eventLabel",
                                  "value"     : "eventValue"
                                },
          is_valid_event,
          data = JSON.parse($(event.target).closest("[data-track-interaction]").attr("data-track-interaction")),
          current_entry;

      /* as long as one `current_entry` is left,
       * use the extracted data, and go through object keys order defined by ordered_trackables
       * if any required data is missing - skip the rest since they depend on each other
       */
      while(current_entry = ordered_trackables.shift()) {
        if(data.hasOwnProperty(current_entry) && data[current_entry]) {
          tracking_options[ga_option_map[current_entry]] = data[current_entry];

          if (current_entry === "action") {
            is_valid_event = true;
          }
        } else {
          break;
        }
      }

      if (is_valid_event && typeof ga === "function") {
        ga("send", tracking_options);
      }

      return is_valid_event;
    },

    toggleGoogleAnalyticsTracking: function ( do_track ) {
      if (do_track) {
        window.my_ga.revert_optout();
      } else {
        window.my_ga.optout();
      }
    }

  };

  app.init();

}( Dropzone));
