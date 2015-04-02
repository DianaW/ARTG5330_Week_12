
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

queue()
    .defer(d3.csv, 'data/world.csv', parse)
    .await(function(err, data){
        //create hierarchy out of data

    });

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


