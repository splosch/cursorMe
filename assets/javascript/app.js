 /* globals jQuery */

(function( $ ) {
  "use strict";

  var pointerImg  = $("input[type='radio'][name='cursortype']:checked + label").find("img").attr("src") || "assets/images/icons/hand1.png",
      $container  = $("#container"),
      $myCursorMe = $.cursorMe($container);

  // check provided URL
  // if correct load images automagically
  // once loaded replace the current background image
  $("#bkg_img_url").parents("form").on("submit", function(event){
    setBackgroundUrl($(this).find("input[type='url']").val());

    event.preventDefault();
  });

  function updateUploadStatus(status) {
    var known_status = ["success", "fail", "loading"];
    $("#uploadStatus").attr("data-status", known_status[status] || "undefined");
  }

  function setBackgroundUrl(url) {
    var backImg = new Image();

    backImg.crossOrigin = '/crossdomain.xml';//crossdomain xml file, this is facebook example
    backImg.src = url;

    $(backImg).imgLoad(function(){
      $myCursorMe.setBackground(this);
      updateUploadStatus("done");
    });
  }

  // handle setting the cursor
  $myCursorMe.setPointer(pointerImg);
  $("input[type='radio'][name='cursortype']").on("change", function(){
    var newPointerImg  = $(this).siblings("label").find("img").attr("src") || pointerImg;

    $myCursorMe.setPointer(newPointerImg);
  });


  $("#save_the_image").on("click", $myCursorMe.save);

})( jQuery );
