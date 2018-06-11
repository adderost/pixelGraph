# pixelGraph
A js library to generate low res graphs on canvas and then scale them up while keeping the pixelated look


![An example of a pixelGraph](https://raw.githubusercontent.com/adderost/pixelGraph/master/example.png "An example of a pixelGraph")

## How to use
Include pixelGraph.js in your website and call pixelGraph().
### Syntax
```javascript
pixelGraph(container, pixelScale, data [, customStyle]);	
```

| Parameter   | Type      | Description |
| --------    | -----     | -----   |
| container   | Element   | The element where the graph should be displayed |
| pixelScale  | Number    | How much should the pixels be scaled up. A value of 2 means every pixel is 2x2 pixels big |
| data        | Array     | An Array containing dataseries (Arrays) containing values (Arrays or Numbers) |
| customStyle | Object    | An object with key/value-pairs to change the default of the graphs look and feel. (See style section for options) |

### customStyle available options

| Option           | Type (Default)     | Description                   |
| -------------    | -------------      | -----                         |
| backgroundColor  | String ("#ffffff") | Background color of the graph |
| dataLineColor    | Array (["#ff0000", "#00ff00", "#0000ff"]) | Color of the linegraph. Different colors for different series |
| dataLineSize     | Number (1)         | How wide is the line. In original pixels |
| dataDotColor     | Array (["#ff0000", "#00ff00", "#0000ff"]) | The color of the datapoint dots in the graph. Different colors for different series |
| dataDotSize      | Number (4)         | Size of the datapoint dots. In original pixels |
| graphAxisLineColor |String ("#aaaaaa")| Color of the axis lines in the graph |
| graphHelperLineColor | String ("#cccccc") | Color of the helper lines in the graph |
| graphPaintIterations | Number (100) | How many iterations should the lines be drawn, higher values means more crisp result |
| labelRounding | Number (10) | When labeling the Y-axis, what multiple should the min and max values be rounded to? |
| labelColor | String ("#000") | Color of the value labels on the Y-axis. Set to same as background to hide labels |
| labelOffset | Number (0.85) | How close to the Y-axis is the value label. 1 is touching, 0 is offscreen to the left |
| labelFontSize | Number  (5) | Font size of the value labels. In original pixels |
| pad | Number (10) | Percentage of width/height the graph should be padded on the X/Y-axes |
| RangeStartsOnZero | Boolean (false) | Should the graph Y-axis start on zero or be truncated down to the lowest data value? |

