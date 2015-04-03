 /* globals $, Dropzone */

$(function( Dropzone ) {
  "use strict";

  var app = {
    SEL_PAGE        : "#page",
    SEL_CONTAINER   : "#container",
    SEL_POINTER     : "input[type='radio'][name='cursortype']",
    SEL_POINTER_IMG : "input[type='radio'][name='cursortype']:checked + label img",
    EVT_CLICK       : "click touchend keyup",

    action_el : {
                  save:  "#save_the_image",
                  reset: "#reset_background",
                  upload: "#upload_image",
                  submit: "#submit_image_url"
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
      // handle load image from external url
      this.page.on("submit", this.action_el.submit, this.submitImageUrl.bind(this));

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
    },

    submitImageUrl: function ( event ) {
      var imageUrl = $(event.target).find("input[type='url']").val() ;

      if (imageUrl) {
        this.setBackgroundUrl(imageUrl);
      }

      event.preventDefault();
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
  };

  app.init();

}( Dropzone ));
