
$(document).ready(function(){
	
	d3.json("players.json", function(json) {
	 	$.each(json, function(key, value) {
	        $('#teams').append(
	            $("<option></option>").text(key)
	        );
    	}); 
	}); 
});
var idList = {}; 
function openPlayers(){
	var team = $('#teams option:selected').text(); 
	d3.json("players.json", function(json) {
	 	$.each(json[team], function(data) {
	 		var player = json[team][data].name; 
	 		idList[player] = json[team][data].id; 
	 		console.log(player); 
	 		$('#players').append(
	            $("<option></option>").text(player)
	        );
    	}); 
	}); 
};
var id = 0; 
var currentPlayer; 
function selectPlayerId(){
	var player = $('#players option:selected').text();
	id = idList[player]; 
	console.log(id);

	url = "http://fantasy.premierleague.com/web/api/elements/" + id + "/"

	jQuery.ajax({
	     type: "GET",
	     url: url,
	     dataType: "json",
		success: function (data) {
	         currentPlayer = data; 
	         $('#player-name').text(player).toggle();
	         $('#next-fixture').text("Next fixture: " + currentPlayer.next_fixture).toggle(); 
	         $('#ppg').text("Points per game: " + currentPlayer.points_per_game).toggle();
	         $('#cost').text("Cost: " + currentPlayer.now_cost).toggle();

	         //lineChart();
	         //createPieChart(); 
	         initLineChart(); 
	         initDonutChart();
	         initNegativeDonutChart(); 
	     },
	     error: function (XMLHttpRequest, textStatus, errorThrown) {
	         alert("error");
	     }
	 });
}; 

function processForLine(){
	var data = new Array(); 
	data.push({'x': '0', 'y': '0'}); 
	var i = 1; 
	for (entry in currentPlayer.fixture_history.all) {
		data.push({'x': i, 'y': currentPlayer.fixture_history.all[entry][19]}); 
		i = i + 1;
	}
	return data;  
}; 

function initLineChart(){

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format(",.0f"))
    .tickValues([1, 2, 3, 5, 8, 13, 21]);


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left"); 

var line = d3.svg.line()
	.interpolate("cardinal")
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data = processForLine(); 




  x.domain(d3.extent(data, function(d) { return d.x; }));
  y.domain(d3.extent(data, function(d) { return d.y; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Points");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

   svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text("Points per week");


}
// Use the score multipliers to get actual scores 
function processActualScores(type){
	var goal = 0; 
	var assist = 0; 
	var clean = 0;
	var saves = 0; 
	var peno = 0; 
	var bonus = 0; 

	var yellow = 0; 
	var red = 0; 
	var og = 0; 
	var penomiss = 0; 
	var conceded = 0; 

	if(currentPlayer.type_name === "Goalkeeper"){
		goal = parseInt(currentPlayer.goals_scored)  *  6; 
		clean = parseInt(currentPlayer.clean_sheets) * 4; 
		saves = parseInt(currentPlayer.saves) / 3; 
		peno = parseInt(currentPlayer.penalties_saved) * 5; 
		conceded = parseInt(currentPlayer.goals_conceded) / 2; 
	}
	if(currentPlayer.type_name === "Defender"){
		goal = parseInt(currentPlayer.goals_scored)  *  6; 
		clean = parseInt(currentPlayer.clean_sheets) * 4; 
		conceded = parseInt(currentPlayer.goals_conceded) / 2; 
	}
	if(currentPlayer.type_name === "Midfielder"){
		goal = parseInt(currentPlayer.goals_scored)  *  5; 
		clean = parseInt(currentPlayer.clean_sheets) * 1; 

	}
	if(currentPlayer.type_name === "Forward"){
		goal = parseInt(currentPlayer.goals_scored)  *  4; 

	}
	bonus = parseInt(currentPlayer.bonus); 
	assist = parseInt(currentPlayer.assists) * 3; 

	yellow = parseInt(currentPlayer.yellow_cards) * 1; 
	red = parseInt(currentPlayer.red_cards) * 3; 
	og = parseInt(currentPlayer.own_goals) * 2; 
	penomiss = parseInt(currentPlayer.penalties_missed) * 2; 


	var data = new Array(); 
	var dataNegative = new Array(); 

	data.push({"type": "Goals", "score": goal}); 
	data.push({"type": "Assists", "score": assist}); 
	data.push({"type": "Clean Sheets", "score": clean}); 
	data.push({"type": "Penalties Saved", "score": peno}); 
	data.push({"type": "Saves", "score": saves}); 
	data.push({"type": "Bonus", "score": bonus}); 

	dataNegative.push({"type":  "Yellow Cards" , "score": yellow }); 
	dataNegative.push({"type":  "Red Cards" , "score":  red}); 
	dataNegative.push({"type": "Own Goals"  , "score": og }); 
	dataNegative.push({"type": "Goals Conceded" , "score": conceded }); 
	dataNegative.push({"type": "Penaltied Missed" , "score":  penomiss}); 

	if(type === "positive"){
		return data; 
	}

	return dataNegative; 

}
function initDonutChart(){
	var width = 800,
    height = 400,
    radius = Math.min(width, height) / 2;
    var margin = {top: 50, right: 20, bottom: 30, left: 50}; 

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.score; });
d3.select("body").append("html")
.text("Positive Points Breakdown"); 
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  data = processActualScores("positive"); 

  data.forEach(function(d) {
    d.score = +d.score;
  });

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.type); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { 
      	if(d.data.score > 0){
			return d.data.type;  
		}else{
			return ""; 
		}});

}; 
function initNegativeDonutChart(){
	var width = 800,
    height = 400,
    radius = Math.min(width, height) / 2;
    var margin = {top: 50, right: 20, bottom: 30, left: 50}; 

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.score; });
d3.select("body").append("html")
.text("Negative Points Breakdown"); 
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  data = processActualScores("neg"); 

  data.forEach(function(d) {
    d.score = +d.score;
  });

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.type); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { 
      	if(d.data.score != 0){
			return d.data.type;  
		}else{
			return ""; 
		}});

}; 

