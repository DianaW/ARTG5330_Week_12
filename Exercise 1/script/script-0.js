//The most simple force layout example

var margin = {t:100,l:100,b:100,r:100},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

//Step 1. creating a force layout
var force = d3.layout.force()
    .size([width,height]);

//create two variables for nodes and links
var nodesArray, linksArray;

//create two global variables to hold the selection of the circles and lines
var circles, lines;

//Step 2. load in data
queue()
    .defer(d3.json, 'data/force.json')
    .await(function(err, data){
       nodesArray = data.nodes;
       linksArray = data.links;

        //Step 2: putting nodes and links arrays into force layout
        force
            .nodes(nodesArray)
            .links(linksArray)
            .on('tick', onTick)
            .start(); //step 5 start the force layout

        draw()

    });

function draw(){
    circles = svg.selectAll('.node')
        .data(nodesArray)
        .enter()
        .append('circle')
        .attr('class','node')
        .attr('r',5)
        .call(force.drag); //enables drag behavior
    lines = svg.selectAll('.link')
        .data(linksArray)
        .enter()
        .insert('line', '.node')
        .attr('class','link');
}

function onTick(){
    circles
        .attr('cx', function(d){ return d.x; })
        .attr('cy', function(d){ return d.y; });

    lines
        .attr('x1', function(d){ return d.source.x; })
        .attr('y1', function(d){ return d.source.y; })
        .attr('x2', function(d){ return d.target.x; })
        .attr('y2', function(d){ return d.target.y; });

}