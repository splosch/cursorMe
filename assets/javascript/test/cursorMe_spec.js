/*
 * uses the image "Cursor" by Jeff Warren (https://www.flickr.com/photos/jeffreywarren/2970122251)
 * licenced under (CC BY-SA 2.0) --- https://creativecommons.org/licenses/by-sa/2.0
 */

/*
 * Makes use of jasmine custom matchers (Tutorial: http://jasmine.github.io/2.3/custom_matcher.html)
 * - imagediff.js is added as a matcher
 */

var myStage,
    STAGE_SEL = "#my-canvas",
    $stage = $('<canvas id="my-canvas" width="600" height="400">I am canvas</canvas>');

describe("Basic cursorMe instantiation", function() {
  beforeEach(function() {
    $("body").append($stage);
  });

  afterEach(function() {
    $(STAGE_SEL).remove();
  });

  it("should create an instance of cursorMe", function() {
    var myStage = $.cursorMe($(STAGE_SEL), {});
    expect(typeof myStage).toEqual("object");
  });
});

describe("CursorMe Plugin", function() {
  beforeEach(function() {
    jasmine.addMatchers(imagediff);

    $("body").append($stage);
    myStage = $.cursorMe($(STAGE_SEL), {});
  });

  afterEach(function() {
    $(STAGE_SEL).remove();
  });

  it('on calling setBackground adds the given background image', function () {
    var newBackgroundImage = new Image();

    // stub handleCreatedImage() to verify output of the plugin
    var old_handleCreatedImage = myStage.handleCreatedImage;

    myStage.handleCreatedImage = function(cursoredImg) {
      expect(newBackgroundImage).toImageDiffEqual(cursoredImg);
    };

    // provide a loaded image
    $(newBackgroundImage).imgLoad(function(img){
      myStage.setBackground(img);
      // TODO fix fail dur to async operation timeout
      myStage.getImage(myStage.handleCreatedImage);
    }.bind(myStage));

    newBackgroundImage.src = 'images/cursor_150x150.jpg';
  });
});




























