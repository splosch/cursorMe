describe("CursorMe", function() {
  var cursorMe,
      $stage = $("#my_stage");

  beforeEach(function() {
    //stage = $.cursorMe($stage, {});
  });

  it("should add cursorMe to the jQuery namespace", function() {
    expect(typeof $.cursorMe).toEqual("function");
  });

});
