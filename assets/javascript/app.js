(function( $ ) {
  "use strict";

  var backImg     = "assets/images/IMG_7791.JPG",
      pointerImg  = "assets/images/icons/hand1.png",
      $container  = $("#container"),
      $myCursorMe = $.cursorMe($container);

  $myCursorMe.setBackground(backImg);
  $myCursorMe.setPointer(pointerImg);

})( jQuery );
