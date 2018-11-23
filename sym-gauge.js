(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "gauge",
		visObjectType: symbolVis,
		
		// single Value type chart
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		getDefaultConfig: function(){ 
			return { 
				// Data Shape single value
				DataShape: "Value",
				Height: 150,
				Width: 150 
			} 
		}
	}
		
	function getConfig(){ //config for AmChart constructor
		return{  // Gauge chart config from AmChart live editor			
				"type": "gauge",
				"theme": "dark",
				"arrows": [
					{
						"id": "GaugeArrow-1",
						"value" : 100
					}
				],
				"axes": [
					{
						"axisThickness": 1,
						"bottomText": "UOM",
						"bottomTextYOffset": -20,
						"endValue": 220,
						"id": "GaugeAxis-1",
						"valueInterval": 10,
						"bands": [
							{
								"color": "#00CC00",
								"endValue": 90,
								"id": "GaugeBand-1",
								"startValue": 0
							},
							{
								"color": "#ffac29",
								"endValue": 130,
								"id": "GaugeBand-2",
								"startValue": 90
							},
							{
								"color": "#ea3838",
								"endValue": 220,
								"id": "GaugeBand-3",
								"innerRadius": "95%",
								"startValue": 130
							}
						]
					}
				],
				"allLabels": [],
				"balloon": {},
				"titles": [
					{
						"id": "Title-1",
						"size": 15,
						"text": "Descriptor"
					}
				]					
		}		
	}

	symbolVis.prototype.init = function(scope, elem) { 
	
		// Data update handler
		this.onDataUpdate = dataUpdate;	
		
		// Link object to DOM div id "container"
		var container = elem.find("#gauge-container")[0];
		container.id = "gaugeChart_" + scope.symbol.Name;
		
		// creates handle to AM chart
		var chart = AmCharts.makeChart(container.id,getConfig());
		
		// Update labels of chart on sporadic update
		function updateLabel(data){
			label = data.Rows.map(function(item){
				return item.Label;
				console.log("updateLabes: " + labels);
			});		
		}
		
		// Data update function for onDataUpdate
		function dataUpdate(data){
			// if there is no data do not execute further this function
			if(!data) return;
			
			// sporadic updates
			if(data.Label){
				scope.Units = data.Units;				
				chart.axes[0].bottomText = data.Units;
				chart.titles[0].text = data.Label;
			}			
			// update on every refresh - 5s
		    chart.arrows[0].value = data.Value;
			scope.Value = data.Value;
			scope.Time = data.Time;
			
			// handle errors?
			scope.ErrorCode = data.ErrorCode;
			
			// log data to console
			console.log(data);
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
