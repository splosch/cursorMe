 /* globals $, Dropzone */

$(function( Dropzone ) {
  "use strict";

  var app = {
    page: "#page",
    container: "#container",
    cursorMeDropzone: {},
    fallbackPointerImg: "assets/images/icons/hand1.png",

    init: function () {
      var pointerImg  = $("input[type='radio'][name='cursortype']:checked + label").find("img").attr("src") || this.fallbackPointerImg,
          dropzoneOptions = {};

      this.page = $(this.page);

      this.cursorMeCanvas   = $.cursorMe($(this.container));

      dropzoneOptions = {
        previewsContainer : false,
        url               : "/#"
      }

      this.cursorMeDropzone = new Dropzone(this.container, dropzoneOptions);

      this.setPointer(pointerImg);

      this.addEventHandlers();
    },

    addEventHandlers: function () {
      this.page.on("submit", "form#submit_image_url", this.submitImageUrl.bind(this));
      this.page.on("click touchend keyup", "#save_the_image",  this.cursorMeCanvas.save);
      this.page.on("change", "input[type='radio'][name='cursortype']", function(event){
        var newPointerImg  = $(event.target).siblings("label").find("img").attr("src");

        this.setPointer(newPointerImg);
      }.bind(this));

      // Dropzone events
      this.cursorMeDropzone.on("imagefullsize", function(file, image) {
        this.cursorMeCanvas.setBackground(image);
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

      backImg.crossOrigin = "/crossdomain.xml";//crossdomain xml file, this is facebook example
      backImg.src = url;

      $(backImg).imgLoad(function(){
        this.cursorMeCanvas.setBackground(backImg);
      }.bind(this));
    },

    setPointer: function ( pointerImg ) {
      this.cursorMeCanvas.setPointer(pointerImg || this.fallbackPointerImg);
    },
  };

  app.init();

}( Dropzone ));
