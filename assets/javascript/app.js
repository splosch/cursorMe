(function( $ ) {
  "use strict";

  var //backImg     = "assets/images/IMG_7791.JPG",
      backImg     = "assets/javascript/test/images/cursor_150x150.jpg",
      pointerImg  = $("input[type='radio'][name='cursortype']:checked + label").find("img").attr("src") || "assets/images/icons/hand1.png",
      $container  = $("#container"),
      $myCursorMe = $.cursorMe($container);

  $myCursorMe.setBackground(backImg);

  // handle setting the cursor
  $myCursorMe.setPointer(pointerImg);
  $("input[type='radio'][name='cursortype']").on("change", function(event, element){
    var newPointerImg  = $(this).siblings("label").find("img").attr("src") || pointerImg;

    $myCursorMe.setPointer(newPointerImg);
  });



  $("#save_the_image").on("click", $myCursorMe.save);

})( jQuery );
