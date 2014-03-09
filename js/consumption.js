/* global d3, r */

var r = 10;
var width = 750;
var height = 500;
var infoBoxWidth = ((window.innerWidth/2 - width/2)/window.innerWidth)*100 +'%';

d3.select('#infoBox').style({
  'left': infoBoxWidth
});

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
  var circles = d3.select('svg').selectAll('circle').data(csv)


    circles.enter().append('circle').attr({
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

    circles.on('mouseover', function(d){
      var circ = d;
      var Country = d.Country;
      var Total = d.Total;
      var Wine = d.Wine;
      var Beer = d.Beer;

      d3.select('#Country').text('Country: '+Country);
      d3.select('#Total').text('Total Consumption: ' +Total);
      d3.select('#Wine').text('Wine Consumption: ' +Wine);
      d3.select('#Beer').text('Beer Consumption: ' +Beer);
    });

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

var lineupY = function(d){
  return d.Total * (height/40);
};

var lineupX = function(d){
  return d.Total * (width/40);
};

d3.select('#lineupData')
  .on('click', function(){
    d3.selectAll('circle')
    .transition()
    .duration(1000)
    .attr({
      cy: function(d){ return lineupY(d);},
      cx: function(d){ return lineupX(d);}
    });
  });



