/*
 * Collection of helpers and extensions (e.g. to jQuery)
 */

 /* globals jQuery */

(function ($) {
    "use strict";


  // image loaded / complete state jQuery extension
  // credits to @PlantTheIdea --> http://stackoverflow.com/a/25799043/1563225
  $.fn.imgLoad = function(callback) {
    return this.each(function() {
      if(callback){
        if(this.complete || (this.readyState === 4) || (this.readyState === "complete")) {
          callback.apply(this);
        } else {
          $(this).one("load.imgCallback", function(){
            callback.apply(this);
          });
        }
      }
    });
  };

})(jQuery);