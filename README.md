# pixelGraph
A js library to generate low res graphs on canvas and then scale them up while keeping the pixelated look


![An example of a pixelGraph](https://raw.githubusercontent.com/adderost/pixelGraph/master/example.png "An example of a pixelGraph")

## How to use
Include pixelGraph.js in your website and call pixelGraph.setup().
### Syntax
```javascript
pixelGraph.setup(container, pixelScale, data [, customStyle]);	
```
#### Parameters
##### container (Element)
The element where the graph should be displayed

##### pixelScale (number)
How much should the pixels be scaled up. A value of 2 means every pixel is 2x2 pixels big

##### data (Array)
An Array containing dataseries (Arrays) containing values (Arrays)

##### customStyle (Object) _Optional_
An object with key/value-pairs to change the default behaviour of the graphs look and feel. (See style section for options)

### customStyle available options

##### backgroundColor
###### _String ("#ffffff")_
Background color of the graph


##### dataLineColor
###### _Array (["#ff0000", "#00ff00", "#0000ff"])_
Color of the linegraph. Different colors for different series


##### dataLineSize
###### _Number (1)_
How wide is the line. In original pixels


##### dataDotColor
###### _Array (["#ff0000", "#00ff00", "#0000ff"])_
The color of the datapoint dots in the graph. Different colors for different series


##### dataDotSize
###### _Number (4)_
Size of the datapoint dots. In original pixels


##### graphAxisLineColor
###### _String ("#aaaaaa")_
Color of the axis lines in the graph


##### graphHelperLineColor
###### _String ("#cccccc")_
Color of the helper lines in the graph


##### graphPaintIterations
###### _Number (100)_
How many iterations should the lines be drawn, higher values means more crisp result


##### labelColor
###### _String ("#000")_
Color of the value labels on the Y-axis. Set to same as background to hide labels

				
##### labelOffset
###### _Number (0.85)_
How close to the Y-axis is the value label. 1 is touching, 0 is offscreen to the left


##### labelFontSize
###### _Number  (5)_
Font size of the value labels. In original pixels


##### pad
###### _Number (10)_
Percentage of width/height the graph should be padded on the X/Y-axes


##### RangeStartsOnZero
###### _Boolean (false)_
Should the graph Y-axis start on zero or be truncated down to the lowest data value?

