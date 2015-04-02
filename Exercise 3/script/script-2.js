//Define a tree layout

var margin = {t:100,l:100,b:100,r:100},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var force = d3.layout.force()
    .size([width,height])
    .friction(0.3) //velocity decay
    .gravity(0.05) //
    .charge(-200) //negative value => repulsion
    .linkDistance(200) //weak geometric constraint
    .linkStrength(0.1)
    ;

//Tree layout
var tree = d3.layout.tree()
    .size([width,height])
    .children(function(d){
        return d.values;
    })
    .value(function(d){
        return d.pop;
    });


queue()
    .defer(d3.csv, 'data/world.csv', parse)
    .await(function(err, data){

        //create hierarchy out of data
        var continents = d3.nest()
            .key(function(d){ return d.continent; })
            .entries(data);

        var world = {
            key:"world",
            values:continents
        };

        draw(world);

    });

function draw(root){
    var nodesArray = tree(root);
    var linksArray = tree.links(nodesArray);

    console.log(nodesArray);
    console.log(linksArray);

    var nodes = svg.selectAll('.node')
        .data(nodesArray, function(d){return d.key; });
    nodes.enter()
        .append('g')
        .attr('class','node')
        .append('circle')
        .attr('r',6);
    nodes
        .attr('transform',function(d){
            return 'translate('+ d.x+','+ d.y+')';
        });

    var links = svg.selectAll('.link')
        .data(linksArray, function(d){return d.target.key;});
    links.enter()
        .insert('line','.node')
        .attr('class','link');
    links
        .attr('x1',function(d){return d.source.x;})
        .attr('y1',function(d){return d.source.y;})
        .attr('x2',function(d){return d.target.x;})
        .attr('y2',function(d){return d.target.y;});



}

function parse(d){
    if(!d.UNc_latitude || !d.UNc_longitude || !d.population){
        return;
    }

    return {
        key: d.ISO3166A3,
        name: d.ISOen_name,
        lngLat:[+d.UNc_longitude, +d.UNc_latitude],
        continent: d.continent,
        pop: +d.population>0?+d.population:0
    }
}


