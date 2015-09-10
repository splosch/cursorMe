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

describe("CursorMe while setting background and cursor images ", function() {
  var newBackgroundImage     = new Image(),
      newPointerImage        = new Image();

  beforeEach(function(done) {
    newBackgroundImage.src = 'images/cursor_150x150.jpg';
    newPointerImage.src    = 'images/pointer.png';

    // make sure both images are loaded before telling jasmine to go on
    $(newBackgroundImage).on("load", function(){
      $(newPointerImage).on("load", done());
    });

    $("body").append($stage);
    myStage = $.cursorMe($(STAGE_SEL), {});
  });

  afterEach(function() {
    $(STAGE_SEL).remove();
  });

  it('creates the same image with set_background', function (done) {
    myStage.handleCreatedImage = function(cursoredImg) {
      expect(imagediff.equal(newBackgroundImage, cursoredImg)).toBe(true);
      done();
    };

    myStage.setBackground(newBackgroundImage);
    myStage.getImage(myStage.handleCreatedImage);

  });

  it('creates a different image when adding a cursor', function (done) {
    myStage.handleCreatedImage = function(cursoredImg) {
      expect(imagediff.equal(newBackgroundImage, cursoredImg)).not.toBe(true);
      done();
    };

    myStage.setBackground(newBackgroundImage);
    myStage.setPointer(newPointerImage);
    myStage.getImage(myStage.handleCreatedImage);
  });
});




























