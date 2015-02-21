/*
 *
 *
 * uses the image "Cursor" by Jeff Warren (https://www.flickr.com/photos/jeffreywarren/2970122251)
 * licenced under (CC BY-SA 2.0) --- https://creativecommons.org/licenses/by-sa/2.0
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

describe("Interacting with cursorMe API", function() {
  beforeEach(function() {
    var newBackgroundImage = new Image(),
        cursoMeResult      = new Image();

    this.addMatchers(imagediff.jasmine);

    $("body").append($stage);
    myStage = $.cursorMe($(STAGE_SEL), {});

    newBackgroundImage.src = 'images/cursor_150x150.jpg';
    myStage.setBackground(newBackgroundImage);
    newBackgroundImage.complete(done);
  });

  afterEach(function() {
    $(STAGE_SEL).remove();
  });

  xit('should convert be the same image', function () {
    expect(newBackgroundImage).toImageDiffEqual(cursoMeResult);
  });
});




























