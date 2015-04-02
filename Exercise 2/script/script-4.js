//This example shows how nodes and links can be represented differently

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
    .gravity(0.2) //
    .charge(-100) //negative value => repulsion
    .linkDistance(200) //weak geometric constraint
    .linkStrength(0)
    ;

//Variable to hold data
var data;

//Variables to hold selection
var peopleNodes;

queue()
    .defer(d3.json, 'data/force.json')
    .await(function(err, d){

       data = d;

        data.nodes.forEach(function(n){
            var gender = Math.floor(n.value)%2==0?"m":"f";
            n.gender = gender;
        });

        force
            .nodes(data.nodes)
            .links(data.links)
            .on('tick', onTick)
            .start();

        draw(data);

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

        background
            .on('click', onBackgroundClick);
    });

function draw(data){
    //this function is now just for drawing

    //Join data to DOM with a key function
    peopleNodes = svg.selectAll('.node')
        .data(data.nodes, function(d){return d.value; });

    //Enter set
    peopleNodes
        .enter()
        .append('g')
        .attr('class','node people')
        .call(force.drag)
        .each(function(d){
            if(d.gender == "m"){
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
        })

}

function onTick(){
    peopleNodes
        .attr('transform', function(d){
            return 'translate('+ d.x + ',' + d.y + ')';
        })
    ;
}

function onBackgroundClick(){
    //we want to add a new node wherever we click on the background
    var v = Math.random()*100;

    data.nodes.push({
        value:v,
        gender:v%2==0?"m":"f"
    });

    force.start();

    draw(data);
}
