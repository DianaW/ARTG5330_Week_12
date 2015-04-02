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

var force = d3.layout.force()
    .size([width,height])
    .friction(0.9) //velocity decay
    .gravity(0.05) //
    .charge(-200) //negative value => repulsion
    .linkDistance(200) //weak geometric constraint
    .linkStrength(0.1)
    ;

queue()
    .defer(d3.json, 'data/force.json')
    .await(function(err, data){

       draw(data);
    });

function draw(data){
    force
        .nodes(data.nodes)
        .links(data.links)
        .on('tick', onTick);

    var peopleNodes = svg.selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('g')
        .attr('class','node people')
        .call(force.drag);
    var lines = svg.selectAll('.link')
        .data(data.links)
        .enter()
        .insert('line','.node')
        .attr('class','link');

    //Instead of circles, we use a <g> element to represent force layout nodes
    //within each <g>, it's up to us what to append
    peopleNodes
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
        })

    force.start();

    function onTick(){
        console.log('Tick: ' + force.alpha());
        peopleNodes
            .attr('transform', function(d){
                return 'translate('+ d.x + ',' + d.y + ')';
            })
            ;

        lines
            .attr('x1',function(d){ return d.source.x })
            .attr('y1',function(d){ return d.source.y })
            .attr('x2',function(d){ return d.target.x })
            .attr('y2',function(d){ return d.target.y });
    }
}
