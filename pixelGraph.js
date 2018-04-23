(function(){
	var pixelGraph = function(){
		//The variables we're working with
		var onScreenCanvas, offScreenBuffer, offScreenOriginal;
		var visibleCtx, bufferCtx, originalCtx;
		var onScreenContainer;
		var pixelScale = 1;
		var graphData = {};

		var style = {
			backgroundColor: "#ffffff",
			dataLineColor: ["#ff0000", "#00ff00", "#0000ff"],
			dataLineSize: 1,
			dataDotColor: ["#ff0000", "#00ff00", "#0000ff"],
			dataDotSize: 4,
			graphAxisLineColor: "#aaaaaa",
			graphHelperLineColor: "#cccccc",
			graphPaintIterations: 100,
			labelColor: "#000",
			labelOffset: 0.85,
			labelFontSize: 5,
			pad: 10,
			yRangeStartsOnZero: false
		}

		this.setup = function(container, scale, data, customStyle = {}){
			//Keep track of ourselves
			var self = this;

			//Save variables
			self.onScreenContainer = container;
			self.pixelScale = scale
			self.graphData = data;
			self.style = Object.assign(style, customStyle);
			
			//Create canvases and contexts
			self.onScreenCanvas = document.createElement('canvas');
			self.visibleCtx = self.onScreenCanvas.getContext("2d");
			self.offScreenBuffer = document.createElement('canvas');
			self.bufferCtx = self.offScreenBuffer.getContext("2d");
			self.offScreenOriginal = document.createElement('canvas');
			self.originalCtx = self.offScreenOriginal.getContext("2d");

			//Attach the visible canvas to the container
			self.onScreenContainer.appendChild(self.onScreenCanvas);

			//Make sure everything has the correct size. And keeps the correct size
			self.resizeCanvases();
			window.addEventListener('resize', function(){self.resizeCanvases();}, true);
		}

		this.resizeCanvases = function(){
			//Keep track of ourselves
			var self = this;

			//Set onscreen canvas to fill container. 1px is 1px
			self.onScreenCanvas.width = self.onScreenContainer.clientWidth;
			self.onScreenCanvas.height = self.onScreenContainer.clientHeight;

			//Set the offscreen buffer to be exactly the same as the onscreen canvas. We're just going to copy the content between the buffer and the visible canvas
			self.offScreenBuffer.width = self.onScreenCanvas.width;
			self.offScreenBuffer.height = self.onScreenCanvas.height;

			//Set the offscreen scaled original to the pixelScale fraction of the visible canvas.
			self.offScreenOriginal.width = Math.round(self.offScreenBuffer.width/self.pixelScale);
			self.offScreenOriginal.height = Math.round(self.offScreenBuffer.height/self.pixelScale);

			window.requestAnimationFrame(self.paintGraph.bind(self));
		}	

		this.paintGraph = function(){
			//Keep track of ourselves
			var self = this;

			//First: draw on downscaled canvas
			self.paintOriginal();

			//Second: scale original to offscreen buffer
			self.scaleToBuffer();

			//Last: copy buffer to visible canvas
			self.copyBufferToVisible();
		}

		this.paintOriginal = function(){
			//Keep track of ourselves
			var self = this;

			//Keep track of stuff
			var ctx = self.originalCtx;
			var width = self.offScreenOriginal.width;
			var height = self.offScreenOriginal.height;

			var padX = Math.round(width * (self.style.pad/100));
			var padY = Math.round(height * (self.style.pad/100));

			var labelSize = Math.round(height * (self.style.labelFontSize/100) );

			var yValueRange = (height-(padY*2));	//Topvalue will be one padding down
			var xValueRange = (width-padX);

			var xStepSize = 0;

			var data = self.graphData;
			var max = 0;
			var min;
			var maxDataPoints=0;

			//opacity is 1
			ctx.globalAlpha = 1;

			//Set max-values (And fuzzy them)
			for(var i = 0; i<data.length; i++){
				for(var j = 0; j<data[i].length; j++){
					if(data[i][j][0] > max) max = data[i][j][0];
					if(min == null) min = data[i][j][0];
					else if(data[i][j][0] < min) min = data[i][j][0];
				}
				if(data[i].length>maxDataPoints) maxDataPoints = data[i].length;
			}
			//If we're supposed to start Y axis on zero, ignore min-value
			if(self.style.yRangeStartsOnZero)	min = 0;
			else{	//Otherwise we're not starting from bottom
				yValueRange -= padY;
			}

			max = (Math.ceil(max / 10) * 10) //Round max-value to nearest ten
			min = (Math.floor(min / 10) * 10) //Round min-value to nearest ten

			//Find xStepSize
			xStepSize = Math.round(xValueRange / maxDataPoints);

			//Fill background
			ctx.fillStyle = self.style.backgroundColor;	//backgroundColor
			ctx.fillRect(0,0,width,height);				//Big rectangle covering everything

			//Helperlines
			ctx.fillStyle = self.style.graphHelperLineColor;
			
			//The main helper lines
			ctx.fillRect(padX-2, padY, 2+ xValueRange, 1);	//Max-value line
			ctx.fillRect(padX-2, padY+Math.round(yValueRange/2), 2+ xValueRange, 1);	//Midvalue line
			ctx.fillRect(padX-2, yValueRange+padY, 2+ xValueRange, 1);	//Range-min line

			//Midpoint lines between main lines
			ctx.strokeStyle = self.style.graphHelperLineColor;	//To make lines
			ctx.lineWidth = 1;
			ctx.setLineDash([5, 10]); //Set dash for strokes

			//Top half
			ctx.beginPath();
			ctx.moveTo(padX, padY+Math.floor(yValueRange/4)+.5);
			ctx.lineTo(width, padY+Math.floor(yValueRange/4)+.5);
			ctx.stroke();

			//Bottom half
			ctx.beginPath();
			ctx.moveTo(padX, padY+Math.floor((yValueRange/4)*3)+.5);
			ctx.lineTo(width, padY+Math.floor((yValueRange/4)*3)+.5);
			ctx.stroke();


			ctx.fillRect(padX, height-padY, xValueRange, 1);	//Bottom line
			ctx.setLineDash([]);								//Reset dashes		

			//Create valueLabels
			ctx.fillStyle = self.style.labelColor;
			ctx.font = labelSize+"px sans-serif";
			ctx.textAlign="right";
			ctx.fillText(max, (padX*self.style.labelOffset), padY+(Math.round(labelSize*0.4)), padY);
			ctx.fillText(Math.round((max-min)/2)+min, (padX*self.style.labelOffset), padY+Math.round(yValueRange/2)+(Math.round(labelSize*0.4)), padY);
			ctx.fillText(min, (padX*self.style.labelOffset), padY+yValueRange+(Math.round(labelSize*0.4)), padY);
			/**/

			//Create baseLines
			ctx.fillStyle = self.style.graphAxisLineColor;		//graphAxisLineColor
			ctx.fillRect(padX, 0, 1, (height-padY));			//Vertical line from top to origo
			ctx.fillRect(padX, (height-padY), (width-padX), 1); //Horizontal line from origo to right

			//Paint the points and lines
			
			ctx.lineWidth = self.style.dataLineSize;

			//We're painting the line a hundred times to make it crisp
			for(var graphNumber = 0; graphNumber<data.length; graphNumber++){
				
				//Setup separate graph options
				var currentLineData = data[graphNumber];
				ctx.fillStyle = self.style.dataDotColor[graphNumber];
				ctx.strokeStyle = self.style.dataLineColor[graphNumber];

				for(var iterations = 0; iterations<self.style.graphPaintIterations; iterations++){
					var lineStarted = false;
					var xPosition = padX+Math.round(xStepSize/2);
					ctx.beginPath();
					for(i = 0; i<currentLineData.length; i++){
						//Find the data point position and move x-value for next time
						var dataPointPosition = {x: xPosition, y: padY+yValueRange - (Math.round(((currentLineData[i][0]-min) / (max-min))*yValueRange))}
						xPosition += xStepSize;
						//Draw the line
						if(!lineStarted){
							ctx.moveTo(dataPointPosition.x, dataPointPosition.y);
						}
						else{
							ctx.lineTo(dataPointPosition.x, dataPointPosition.y);
						}
						lineStarted = true; //Remember that this is done

						//Draw the point
						ctx.fillRect(dataPointPosition.x-Math.ceil(self.style.dataDotSize / 2), dataPointPosition.y-Math.ceil(self.style.dataDotSize / 2), Math.ceil(self.style.dataDotSize / 2)*2, Math.ceil(self.style.dataDotSize / 2) * 2);
					}
					ctx.stroke();
					lineStarted = false;
				}
				//Next we add the point Labels
				var xPosition = padX+Math.round(xStepSize/2);
				ctx.fillStyle = self.style.graphAxisLineColor;
				for(i = 0; i<currentLineData.length; i++){
					ctx.fillRect(xPosition, height-padY, 1, 3);
					xPosition += xStepSize;
				}
			}
		}

		this.scaleToBuffer = function(){
			//Keep track of ourselves
			var self = this;
			//Set variables
			var ctx = self.bufferCtx;
			var width = self.offScreenOriginal.width;
			var height = self.offScreenOriginal.height;
			var pixelScale = self.pixelScale;
			var imageData = self.originalCtx.getImageData(0,0,self.offScreenOriginal.width, self.offScreenOriginal.height);

			var newImageData = ctx.createImageData(width*pixelScale, height*pixelScale);

			//Create scaled pixels on the offscren buffer for all pixels on the original
			for (var i = 0; i < (imageData.data.length/4); i++ ){
				var j = (i*4);
				for(var pixelIterator = 0; pixelIterator<pixelScale; pixelIterator++){
					var pointer = (j*pixelScale); //First multiply position with pixelScale
						pointer += ((Math.floor(i/width)) * (width * (4 * pixelScale)) *(pixelScale-1) );	//Then add pixelscale for each row
						pointer += pixelIterator*4;	//And then work with where we are in X-axis
						
					for(var innerIterator = 0; innerIterator<pixelScale; innerIterator++){
						var innerPointer = pointer+innerIterator*width*4*pixelScale 		//And then we work with the Y-axis

						newImageData.data[innerPointer] = imageData.data[j];				//RED
						newImageData.data[innerPointer+1] = imageData.data[j+1];			//GREEN
						newImageData.data[innerPointer+2] = imageData.data[j+2];			//BLUE
						newImageData.data[innerPointer+3] = 255;							//ALPHA
					}
				}

			}
			ctx.putImageData(newImageData,0,0);
		}

		this.copyBufferToVisible = function(){
			//Keep track of ourselves
			var self = this;

			//Just copy the finished content from the offscreen buffer and put it over whatever is visible
			self.visibleCtx.drawImage(self.offScreenBuffer, 0, 0);
		}
	};
	//Save a reference of the object in the global scope
	window.pixelGraph = new pixelGraph();
})();