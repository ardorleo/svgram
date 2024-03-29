// $Author$
// $Id$

var TestContext;
var TestEvtCounter;

function MapSize(map)
{
  var count = 0;
  for(key in map)
    count++;
  return count;
}

function equal(actual, expected) {
  expect(actual).toBe(expected);
}

function sequal(actual, expected) {
  expect(actual).toBe(String(expected));
}

function notEqual(actual, expected) {
  expect(actual).not.toBe(expected);
}

function ok(actual) {
  expect(actual).toBeTruthy();
}

function testEvent(node, eventType, requred) {
  TestEvtCounter = 0;
  var event = document.createEvent ("MouseEvents");
  event.initMouseEvent(eventType, true, false,
        window,
        1, 0, 0,
        50, 50,
        false, false, false, false, 0, null);
  node.dispatchEvent(event);
  equal(TestEvtCounter, requred);
}

function checkKnot(knot, cx, cy, rsize) {
  equal(knot.tagName, "circle");
  
  sequal(knot.getAttribute("cx"), cx);
  sequal(knot.getAttribute("cy"), cy);
  sequal(knot.getAttribute("r"), rsize / 2);

  sequal(knot.getAttribute("fill"), TestContext.knot_color);
  //sequal(knot.getAttribute("opacity"), TestContext.spec_opacity);
  sequal(knot.getAttribute("stroke"), TestContext.knot_stroke_color);
  sequal(knot.getAttribute("stroke-width"), TestContext.knot_stroke_width);
  
  equal(knot.getAttribute("svgram"), "knot");
}

function checkKnotScriptEvent(knot)
{
  equal(knot.getAttribute("onmousemove"), "KnotMouseMove");
  equal(knot.getAttribute("onmouseup"), "KnotMouseUp");
}

function checkKnotFunctionEvent(knot)
{
  equal(knot.getAttribute("onmousemove"), null);
  equal(knot.getAttribute("onmouseup"), null);
  
  testEvent(knot, "mousemove", 1);
  testEvent(knot, "mouseup", 1);
  testEvent(knot, "contextmenu", 0);
}

function checkRect(node, left, top, width, height) {
  sequal(node.getAttribute("x"), left);
  sequal(node.getAttribute("y"), top);
  sequal(node.getAttribute("width"), width);
  sequal(node.getAttribute("height"), height);
}

function checkCircle(node, cx, cy, radius) {
  sequal(node.getAttribute("cx"), cx);
  sequal(node.getAttribute("cy"), cy);
  sequal(node.getAttribute("r"), radius);
}

function checkLine(node, x, y, x1, y1) {
  sequal(node.getAttribute("x1"), x);
  sequal(node.getAttribute("y1"), y);
  sequal(node.getAttribute("x2"), x1);
  sequal(node.getAttribute("y2"), y1);
}

function checkShape(shape, x, y, width, height, left, top, right, bottom) {
  equal(shape.x, x);
  equal(shape.y, y);
  equal(shape.width, width);
  equal(shape.height, height);
  equal(shape.left, left);
  equal(shape.right, right);
  equal(shape.top, top);
  equal(shape.bottom, bottom);
}

function checkRectPosition(rect, x, y, width, height, left, top, right, bottom) {
  checkShape(rect, x, y, width, height, left, top, right, bottom);
  checkRect(rect.node, left, top, width, height);
  checkRect(rect.spec.firstChild, left, top, width, height);

  var rsize = TestContext.resizer_size;
  var rsize2 = rsize/2;
  checkRect(rect.resizers[0], right - rsize2, bottom - rsize2, rsize, rsize);

  checkCircle(rect.knots[0], left, y, rsize2);
  checkCircle(rect.knots[1], right, y, rsize2);
  checkCircle(rect.knots[2], x, top, rsize2);
  checkCircle(rect.knots[3], x, bottom, rsize2);
}

function checkLinePosition(rect, x, y, x1, y1) {
  var width = x1 - x;
  var height = y1 -y;
  checkShape(rect, x + width/2, y + height/2, width, height, x, y, x1, y1);
  checkLine(rect.node, x, y, x1, y1);
  checkLine(rect.spec.firstChild, x, y, x1, y1);

  var rsize = TestContext.resizer_size;
  var rsize2 = rsize/2;
  checkRect(rect.resizers[0], x - rsize2, y - rsize2, rsize, rsize);
  checkRect(rect.resizers[1], x1 - rsize2, y1 - rsize2, rsize, rsize);
}

function checkTextPosition(shape, x, y) {
  equal(shape.x, x);
  equal(shape.y, y);

  sequal(shape.node.getAttribute("x"), x);
  sequal(shape.node.getAttribute("y"), y);
  
  var width = parseInt(shape.node.getAttribute("width"));
  var height = parseInt(shape.node.getAttribute("height"));
  equal(shape.width, width);
  equal(shape.height, height);
  
  var left = x - width / 2;
  var top = y - height / 2;
  
  equal(shape.left, left);
  equal(shape.top, top);
  equal(shape.right, left + width);
  equal(shape.bottom, top + height);

  checkRect(shape.spec.firstChild, left, top, width, height);
  
  var rsize = TestContext.resizer_size;
  var rsize2 = rsize / 2;
  checkRect(shape.resizers[0], shape.right - rsize2, shape.bottom - rsize2, rsize, rsize);
}

function calcRectResize(coords, dx, dy) {
  coords.width += dx * 2;
  coords.height += dy * 2;
  coords.left = coords.x - coords.width / 2;
  coords.right = coords.left + coords.width;
  coords.top = coords.y - coords.height / 2;
  coords.bottom = coords.top + coords.height;
}

function clearNode(node) {
  while (node.childNodes.length >= 1)
  {
    node.removeChild(node.firstChild);
  }
}

function TestMakeSvg(Common, width, height)
{
  var fixture = document.getElementById("qunit-fixture");
  clearNode(fixture);
  var svg = Common.AddTagNS(fixture, Common.svgNS, "svg", {id:"diagram", "version":"1.1" , "width": width, "height": height, draggable:"false"});
  Common.SetAttr(svg, {"xmlns:xlink": Common.xlinkNS, "xmlns": Common.svgNS});
  return svg;
}

function InitTestShapeContext(ShapeContext, Common, Shape, Rect, Line, Text) {
  TestContext = new ShapeContext;
  
  TestContext.Register(Rect);
  TestContext.Register(Line);
  TestContext.Register(Text);
  
  TestContext.root_shapes = TestMakeSvg(Common, 800, 600);
  TestContext.root_lines = TestContext.root_shapes;
  
  TestEvtCounter = 0;
}

function ClearTestShapeContext() {
  TextContext = null;
}

var ShapeMatchers = {
  toBeString: function(expected) {
    return String(this.actual) == expected;
  },
};

define(["shape_context", "common", "shape", "rect", "line", "text"], 
function(ShapeContext, Common, Shape, Rect, Line, Text) {

describe("shape context", function() {

  beforeEach(function() {
    InitTestShapeContext(ShapeContext, Common, Shape, Rect, Line, Text);
  });
  afterEach(function() {
    ClearTestShapeContext();
  });

  it("should create svg", function() {
    expect(TestContext.root).not.toBeNull();
  });

});

});