 /* globals $, Dropzone, ga */

$(function( Dropzone ) {
  "use strict";

  window._gaq = window._gaq || [];

  var app = {
    SEL_PAGE        : "#page",
    SEL_CONTAINER   : "#container",
    SEL_POINTER     : "input[type='radio'][name='cursortype']",
    SEL_POINTER_IMG : "input[type='radio'][name='cursortype']:checked + label img",
    EVT_CLICK       : "click touchend keyup",
    SEL_TOGGLE_GA   : "input[type='radio'][name='track']",

    action_el : {
                  save:  "#save_the_image",
                  reset: "#reset_background",
                  upload: "#upload_image"
                },

    cursorMeDropzone: {},
    fallbackPointerImg: "assets/images/icons/hand1.png",

    init: function () {
      var dropzoneOptions = {
        previewsContainer : false,
        url               : "/#",
        clickable         : [this.SEL_CONTAINER, this.action_el.upload]
      };

      this.page = $(this.SEL_PAGE);
      this.cursorMeCanvas   = $.cursorMe($(this.SEL_CONTAINER));
      this.cursorMeDropzone = new Dropzone(this.SEL_CONTAINER, dropzoneOptions);

      this.updatePointer();
      this.addEventHandlers();
    },

    addEventHandlers: function () {

      // set background image if dropzone detects that a image was added to the canvas
      this.cursorMeDropzone.on("imagefullsize", function(file, image) {
        this.cursorMeCanvas.setBackground(image);
      }.bind(this));

      // handle changing the current cursor
      this.page.on("change", this.SEL_POINTER, this.updatePointer.bind(this));

      // create a image from the canvas
      this.page.on(this.EVT_CLICK, this.action_el.save, this.cursorMeCanvas.save);

      // remove current image from the stage
      this.page.on(this.EVT_CLICK, this.action_el.reset, function(){
        this.cursorMeCanvas.setBackground();
        this.updatePointer();
      }.bind(this));

      this.page.on(this.EVT_CLICK, "[data-track-interaction]", this.trackInteraction.bind(this));

      $("#toggle_ga_tracking").on("change", this.SEL_TOGGLE_GA, function(event){
        this.toggleGoogleAnalyticsTracking($(event.currentTarget).is("[value=1]"));
      }.bind(this));

    },

    // interact with cursorMe - stage
    setBackgroundUrl: function ( url ) {
      var backImg = new Image();

      backImg.crossOrigin = "/crossdomain.xml"; //crossdomain xml file, this is facebook example
      backImg.src = url;

      $(backImg).imgLoad(function(){
        this.cursorMeCanvas.setBackground(backImg);
      }.bind(this));
    },

    updatePointer: function () {
      var pointerImg  = $(this.SEL_POINTER_IMG).attr("src");

      this.cursorMeCanvas.setPointer(pointerImg || this.fallbackPointerImg);
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
