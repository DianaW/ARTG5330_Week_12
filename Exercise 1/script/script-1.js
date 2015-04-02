//Experiment with physical parameters
//And different ways of drawing nodes and links

var margin = {t:100,l:100,b:100,r:100},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

//Step 1: create a force layout and set its parameters
//Refer to https://github.com/mbostock/d3/wiki/Force-Layout#force
var force = d3.layout.force()
    .size([width,height])
    .friction(0.9) //velocity decay
    .gravity(0.1) //
    .charge(-100) //negative value => repulsion
    .linkDistance(10) //weak geometric constraint
    .linkStrength(0)
    ;

//Load in data
queue()
    .defer(d3.json, 'data/force.json')
    .await(function(err, data){
       console.log(data.nodes);
       console.log(data.links);

       draw(data);
    });

function draw(data){
    force
        .nodes(data.nodes)
        .links(data.links)
        .on('start',function(){ console.log('-----------start------------');})
        .on('tick', onTick)
        .on('end', function(){ console.log('------------end-------------'); })
        ;

    var circles = svg.selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('g')
        .attr('class','node')
        .call(force.drag);

    circles
        .append('svg:image')
        .attr('xlink:href','assets/woman.svg')
        .attr('width',19)
        .attr('height',50)
        .attr('x',-8.5)
        .attr('y',-25);
    circles
        .insert('circle','image')
        .attr('r',22);

    force.start();

    function onTick(e){
        console.log(e.alpha);
        circles
            .attr('transform', function(d){
                //"translate("+d.x+","+d.y+")";
                //translate(d.x,d.y)
                return 'translate('+ d.x+','+ d.y+')';
            });

    }
}
