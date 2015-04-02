//Shows how we can manually start and stop force layout
//How do we dynamically add new nodes to the layout?

var margin = {t:100,l:100,b:100,r:100},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var background = svg.append('rect')
    .attr('width',width)
    .attr('height',height);

var force = d3.layout.force()
    .size([width,height])
    .friction(0.9) //velocity decay
    .gravity(0.05) //
    .charge(-200) //negative value => repulsion
    .linkDistance(200) //weak geometric constraint
    .linkStrength(0.1)
    ;

//create some global variables to hold nodes array and links array
var nodesArray, linksArray;
var peopleNodes;

//capture user input events
svg.on('click',addNewNode);

queue()
    .defer(d3.json, 'data/force.json')
    .await(function(err, data){

        nodesArray = data.nodes;
        linksArray = data.links;

        force
            .nodes(nodesArray)
            .links(linksArray)
            .on('tick', onTick)
            .start();

        draw();

        $('.control #start').on('click',function(e){
            e.preventDefault();
            console.log('Start');
            force.start();
        });
        $('.control #stop').on('click', function(e){
            e.preventDefault();
            console.log('Stop');
            force.stop();
        });

    });

function draw(){

    peopleNodes = svg.selectAll('.node')
        .data(nodesArray, function(d){return d.value;});

    peopleNodes
        .enter()
        .append('g')
        .attr('class','node people')
        .call(force.drag)
        .each(function(d){
            var value = Math.floor(d.value),
                imageUrl;

            if(value%2 == 0){
                imageUrl = 'assets/man.svg';
            }else{
                imageUrl = 'assets/woman.svg';
            }
            d3.select(this)
                .append('circle')
                .attr('r',22)
                .style('fill','#fff');
            d3.select(this)
                .append('svg:image')
                .attr('height',40)
                .attr('width',16)
                .attr('x',-8)
                .attr('y',-20)
                .attr('xlink:href',imageUrl);
        });
}

function onTick(){
    peopleNodes
        .attr('transform', function(d){
            return 'translate('+ d.x + ',' + d.y + ')';
        })
    ;
}

function addNewNode(){
    //first step is to push a new element into the nodes array
    nodesArray.push({
        value: Math.random()*100
    })

    //second step
    force.start();

    //third step is to redraw
    draw();
}
