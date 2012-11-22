var xlinkNS = "http://www.w3.org/1999/xlink";
var svgNS = "http://www.w3.org/2000/svg";

function SetAttr(element, attributes)
{
  for(var name in attributes)
  {
    element.setAttribute(name, attributes[name]);
  }
}

function SetAttrNS2(element, namespace, attributes)
{
  for(var name in attributes)
  {
    element.setAttributeNS(namespace, name, attributes[name]);
  }
}

function AddTagNS(parent, namespace, name, attributes)
{
  var tag = document.createElementNS(namespace, name);
  parent.appendChild(tag);
  SetAttr(tag, attributes);
  return tag;
}

function CreateShadowFilter(paper)
{
  var defs = AddTagNS(paper, svgNS, "defs");
  var filter = AddTagNS(defs, svgNS, "filter", {id:"shadow", width:"200%", height:"200%"});
  AddTagNS(filter, svgNS, "feOffset", {in:"SourceAlpha", result:"offOut", dx:"8", dy:"8" });
  AddTagNS(filter, svgNS, "feGaussianBlur", {in:"offOut", result:"blurOut", stdDeviation:"8"});
  AddTagNS(filter, svgNS, "feBlend", {in:"SourceGraphic", in2:"blurOut", mode:"normal" });
}

function CreateToolbar(root, width, height, color)
{
  var stroke = 1;
  var toolbar = AddTagNS(root, svgNS, "g", {id:"diagram.toolbar"});
  
  var border = AddTagNS(toolbar, svgNS, "rect", {id:"diagram.toolbar.border", "x": stroke, "y": stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": color, "stroke": "black", "stroke-width": 1 });
  SetAttr(border, {"filter":"url(#shadow)"});
  
  var icons = {
    "rect1": "M3.083,7.333v16.334h24.833V7.333H3.083z M19.333,20.668H6.083V10.332h18.25V20.668z",
    "rect2": "Inkscape_icons_draw_rectangle.svg",
    "line1": "M21.786,12.876l7.556-4.363l-7.556-4.363v2.598H2.813v3.5h18.973V12.876zM10.368,18.124l-7.556,4.362l7.556,4.362V24.25h18.974v-3.501H10.368V18.124z",
    "line2": "Inkscape_icons_connector_orthogonal.svg",
    "crop1": "crop.svg",
    "crop2": "crop2.svg",
    "select":"M24.303,21.707V8.275l4.48-4.421l-2.021-2.048l-4.126,4.07H8.761V2.083H5.882v3.793H1.8v2.877h4.083v15.832h15.542v4.609h2.878v-4.609H29.2v-2.878H24.303zM19.72,8.753L8.761,19.565V8.753H19.72zM10.688,21.706l10.735-10.591l0.001,10.592L10.688,21.706z",
  };

  var columns = 2;
  var col = 0, offsetX = 10, stepX = 40;
  var row = 0, offsetY = 5, stepY = 40;
  var selectedIcon = "line2";
  for(icon in icons)
  {
    if (icon == selectedIcon)
    {
      var back = AddTagNS(toolbar, svgNS, "rect", 
      {x: (offsetX + col * stepX - 4), y: (offsetY + row * stepY - 2), height:36, width:40, rx:8, 
      fill: "#ccc", "stroke-width": 1, "stroke": "#333", "stroke-opacity":0.5 });
    }
    
    var iconBody = icons[icon];
    if (iconBody[0] == "M")
    {
      var path = AddTagNS(toolbar, svgNS, "path", {transform:"scale(1) translate(" + (offsetX + col * stepX) + "," + (offsetY + row * stepY) + ")", d: iconBody});
      SetAttr(path, {"stroke-width": 1, "fill-opacity": 1});
      SetAttr(path, { "stroke" : "#333"});
      SetAttr(path, { "fill": "#aaa"});
    }
    else
    {
      var image = AddTagNS(toolbar, svgNS, "image", 
      {x: (offsetX + col * stepX), y: (offsetY + row * stepY), height:32, width:32});
      SetAttrNS2(image, xlinkNS, {"xlink:href" : "icons/" + iconBody});
    }
    
    ++col;
    if (col == columns)
    {
      col = 0;
      ++row;
    }
  }
}

function CreateSvg(root, width, height, stroke)
{
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  var gridStep = 20;
  var toolbarWidth = 100;
  var paperOffset = 110;
  
  var svg = AddTagNS(root, svgNS, "svg", {id:"diagram", "version":"1.1" , "width": paperOffset + width + 50, "height": height + 50});
  SetAttr(svg, {"xmlns:xlink": xlinkNS, "xmlns": svgNS});

  CreateShadowFilter(svg);
  CreateToolbar(svg, toolbarWidth, height, paperColor);
  
  var paper = AddTagNS(svg, svgNS, "g", {id:"diagram.paper"});
  
  var border = AddTagNS(paper, svgNS, "rect", {id:"diagram.paper.border", "x": paperOffset + stroke, "y": stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": paperColor, "stroke": paperBorderColor, "stroke-width": stroke });
  SetAttr(border, {"filter":"url(#shadow)"}); 
  
  var grid = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.grid"});
  for(var x = gridStep + stroke ; x < width ; x += gridStep)
  {
    AddTagNS(grid, svgNS, "line", {x1:paperOffset + x, y1: stroke, x2:paperOffset + x, y2: height - stroke,
      "stroke":paperBorderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + gridStep});
  }

}

function Init(root)
{
  CreateSvg(root, 800, 600, 1);
}