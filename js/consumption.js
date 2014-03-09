/* global d3, r */

var r = 10;
var width = 750;
var height = 500;

d3.select('body').selectAll('svg').data([1])
  .enter().append('svg').style({
  'height': '500px',
  'width': '750px'
});

var circleColor = function(d) {
  var l = d.Total/18.22;
  return 'hsl('+(100 - (100* l))+',81%,50%)';
};


d3.csv("js/AlcoholConsumptionByCountry.csv", function(csv){

  csv.sort();
  d3.select('svg').selectAll('circle').data(csv)
    .enter().append('circle')
    .attr({
      r: 0,
      cx: function(){ return Math.random() * width;},
      cy: function(){ return Math.random() * height;},
      fill: 'white'
    })
    .transition()
    .duration(4000)
    .attr({
      r: function(d){return d.Total* 1.5;},
      cx: function(d){
        var x = (d.Total/18.22 * width)*.90;
        return x;
      },
      cy: function(d){
        return height-(d.Total*d.Total) - 5;
      },
      fill: function(d){return circleColor(d);},
      stroke: 'black'
    });
    d3.selectAll('circle').call(drag);

});



var dragMove = function(){
  var rad = this.getAttribute('r');
  var x = function(x){
    x = x > width - rad ? width - rad : x;
    x = x < rad ? rad : x;
    return x;
  };
  var y = function(y){
    y = y > height - rad ? height - rad : y;
    y = y < rad ? rad : y;
    return y;
  };
  d3.select(this).attr('cx', x(d3.event.x))
  .attr('cy', y(d3.event.y));
};

var drag = d3.behavior.drag()
  .on('drag', dragMove);

d3.select('#organizeData')
  .on('click', function(){
    d3.selectAll('circle')
    .transition()
    .duration(1000)
    .attr({
      r: function(d){return d.Total* 1.5;},
      cx: function(d){
        var x = (d.Total/18.22 * width)*.90;
        return x;
      },
      cy: function(d){
        return height-(d.Total*d.Total) - 5;
      },
      fill: function(d){return circleColor(d);},
      stroke: 'black'
    });
  });

  d3.select('#scatterData')
    .on('click', function(){
      d3.selectAll('circle')
      .transition()
      .duration(1000)
      .attr({
        cx: function(){ return Math.random() * width;},
        cy: function(){ return Math.random() * height;}
      });
    });
