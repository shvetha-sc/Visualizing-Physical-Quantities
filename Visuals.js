var customWidth = 800
var customHeight = 1000
var fillCircle = d3.scale.category20c();
var strokeCircle = d3.scale.category20b();
var circleRadius = 20;
var svg;

function createCanvas(){
	
	var header = d3.select("body")
					.append("h2")
					.text("Physical Quantities and their Relations");
					
	var restButton = d3.select("body")
						.append("button")
						.text("Reset Diagram")
						.on("click", function() { 
							svg.selectAll("*").remove();
							populateEntitiesAndAnimation();
						});		

	svg = d3.select("body")
				.append("svg")
				.attr({width:customWidth,height:customHeight})

}

function populateEntitiesAndAnimation(){
		
	  var nodeList = [
        {name:"Mass", symbol:"m", group:1}, 
        {name:"Time", symbol:"t", group:1}, 
        {name:"Length", symbol:"d", group:1},
        {name:"Force", symbol:"F", group:3, formula:"F=m.a"}, 
        {name:"Velocity", symbol:"v",group:2, formula:"v=d/t"}, 
        {name:"Acceleration", symbol:"a", group:2, formula:"a=v/d"},
        {name:"Work", symbol:"W", group:3, formula:"W=F.d"}, 
        {name:"Momentum", symbol:"p", group:2, formula:"p=m.v"}, 
        {name:"Impulse", symbol:"I",  group:2, formula:"I=F.t"},
        {name:"Energy (k)", symbol:"E",group:3, formula:"Ek=0.5m.v.v"}, 
        {name:"Power", symbol:"P", group:3, formula:"P=W/t"}, 
        {name:"Pressure", symbol:"p", group:3, formula:"p=F/A"},
        {name:"Area", symbol:"A", group:4, formula:"A=d*d"}, 
        {name:"Volume", symbol:"V", group: 4, formula:"V=A*d"}, 
        {name:"Frequency", symbol:"f", group:4, formula:"f=1/t"}
    ];

	 var links = [
        {"source":1,"target":4,"value":1}, 
		{"source":2,"target":4,"value":1}, 
        {"source":2,"target":5,"value":1}, 
		{"source":4,"target":5,"value":1}, 
        {"source":0,"target":3,"value":1}, 
		{"source":5,"target":3,"value":1}, 
        {"source":4,"target":7,"value":1}, 
		{"source":3,"target":7,"value":1}, 
        {"source":2,"target":6,"value":1}, 
		{"source":3,"target":6,"value":1}, 
        {"source":0,"target":9,"value":1}, 
		{"source":4,"target":9,"value":1}, 
        {"source":2,"target":12,"value":1}, 
        {"source":2,"target":13,"value":1}, 
		{"source":12,"target":13,"value":1}, 
        {"source":12,"target":11,"value":1}, 
		{"source":3,"target":11,"value":1},
        {"source":1,"target":10,"value":1}, 
		{"source":6,"target":10,"value":1}, 
        {"source":3,"target":8,"value":1}, 
		{"source":1,"target":8,"value":1}, 
        {"source":1,"target":14,"value":1}
    ];
	
	var force = d3.layout.force()
			.size([customWidth,customHeight])
			.gravity(0.09)
			.charge(-2000)
			.nodes(nodeList)
			.links(links)
			.start()
			.on("tick",move);
		
	//Define Custom Dragging	
	var customDrag = d3.behavior.drag()
			.on("dragstart", function(d, i) { force.stop(); })
			.on("drag", function (d, i) {
				d.px += d3.event.dx;
				d.py += d3.event.dy;
				d.x += d3.event.dx;
				d.y += d3.event.dy; 
				move(); 
			})
			.on("dragend", function (d, i) {
				d.fixed = true;
				move();
				force.resume();
			});
	
	
	var node = svg.selectAll(".node")
				.data(nodeList)
				.enter()
				.append("g")
				.attr("class","node")
				.call(customDrag);
	
	var link = svg.selectAll(".link")
				.data(links)
				.enter()
				.append("line")
				.attr("class", "link");	
				
	var circle = node.append("svg:circle")
				.attr("r",circleRadius)
				.style({fill:function(d) { return fillCircle(d.group);},
						stroke: function(d) {return strokeCircle(d.group);}});
	
	//Create Paths
	svg.append("svg:defs").selectAll("marker")
				.data([1,2,3])
				.enter()
				.append("svg:marker")
				.attr("id", String)
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 22)
				.attr("refY", -1.5)
				.attr("markerWidth", 6)
				.attr("markerHeight", 6)
				.attr("fill-color","#cccccc")
				.attr("orient", "auto")
				.append("svg:path")
				.attr("d", "M0,-5L10,0L0,5");
	
	
	var path = svg.append("svg:g")
				.selectAll("path")
				.data(links)
				.enter()
				.append("svg:path")
				.attr("class", function(d) { return "link " + d.value; })
				.attr('marker-start', function(d,i){ return 'url(#' + d.name + ')' })
				.attr("marker-end", function(d) { return "url(#" + d.value + ")"; });;
	
	
	d3.selectAll("body")
		.on("click", function() {
			nodeList.forEach(function(o , i) {
				o.x += 1;
				o.y += 1;
			});
			force.resume();
		})
	
	
	var text = svg.append("svg:g")
				.selectAll("g")
				.data(nodeList)
				.enter()
				.append("svg:g");

	text.append("svg:text")
		  .attr("dx", 12)
		  .attr("dy", ".35em")
		  .attr("class", "shadow")	
		  .text(function(d) { return d.name;}
	  );


	text.append("svg:text")
		  .attr("dx", 12)
		  .attr("dy", ".35em")
		  .text(function(d) { return d.name;}
	  );

	text.append("svg:text")
		  .attr("dx", -4)
		  .attr("dy", 2)
		  .attr("fill", "black")
		  .attr("font-weight","bold")
		  .text(function(d) { return d["symbol"];}
	  );
	
	function move(){		
		 path.attr("d", function(d) {
			var dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = 0;
				return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
		});
		
		link.attr("x1", function(d) { return d.source.x; })
			  .attr("y1", function(d) { return d.source.y; })
			  .attr("x2", function(d) { return d.target.x; })
			  .attr("y2", function(d) { return d.target.y; });
		
		circle.attr("transform",function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		
		text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
}


createCanvas();
populateEntitiesAndAnimation();
