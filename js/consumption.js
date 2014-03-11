/* global d3*/


var width = 750;
var height = 500;
var infoBoxWidth = function(){
  return ((window.innerWidth/2 - width/2)/window.innerWidth)*100 +'%';
};
var totalsArray = [];
var cxValObj = {};
var cyValObj = {};

// infoBox position
d3.select('#infoBox').style({
  'left': infoBoxWidth()
});

// infoBox position on resize
var resize = function(){
  d3.select('#infoBox').style({
    'left': infoBoxWidth()
  });

};

window.onresize = resize;


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
  var circles = d3.select('svg').selectAll('circle').data(csv);

    csv.sort(function(a,b){
      return b.Total - a.Total;
    });
    circles.enter().append('circle').attr({
      r: 0,
      cx: function(){ return Math.random() * width;},
      cy: function(){ return Math.random() * height;},
      fill: 'white'
    })
    .transition()
    .duration(1000)
    .attr({
      value: function(d){ return d.Country;},
      r: function(d){return d.Total* 2;},
      cx: function(d){
        var x = (d.Total/18.22 * width)* 0.90;
        return x;
      },
      cy: function(d){
        return height-(d.Total*d.Total) - 5;
      },
      fill: function(d){return circleColor(d);},
      stroke: 'black'
    });
    // call drag on data-circles
    d3.selectAll('circle').call(drag);

    d3.selectAll('circle').each(function(d,i){
      totalsArray.push(d.Total);
    });

    totalsArray.sort(function(a,b){
      return b - a;
    });

  cxValObj[totalsArray[0]] = totalsArray[0]*2+20;
  cyValObj[totalsArray[0]] = height/3;

  for (var i = 1; i < totalsArray.length; i++){
    var lastCX = cxValObj[+totalsArray[i-1]];
    if (lastCX > 650) {
      cyValObj[totalsArray[i]] = cyValObj[totalsArray[i-1]] + 100;
      cxValObj[totalsArray[i]] = totalsArray[i]*2+ 20;
    } else {
      cyValObj[+totalsArray[i]] = cyValObj[+totalsArray[i-1]];
      cxValObj[+totalsArray[i]] = cxValObj[+totalsArray[i-1]] + (+totalsArray[i-1]*2) +(+totalsArray[i]*2);
    }
  };

  console.log(cxValObj);

  circles.on('mouseover', function(d){
      var Country = d.Country;
      var Total = d.Total;
      var Wine = d.Wine;
      var Beer = d.Beer;
      var Spirits = d.Spirits;
      var Other = d.Other;

      d3.select('#Country').text('Country: '+Country);
      d3.select('#Total').text('Total Consumption: ' +Total+ ' Litres');
      d3.select('#Wine').text('Wine Consumption: ' +Wine+ ' Litres');
      d3.select('#Beer').text('Beer Consumption: ' +Beer+ ' Litres');
      d3.select('#Spirits').text('Spirits Consumption: ' +Spirits+ ' Litres');
      d3.select('#Other').text('Other Consumption: ' +Other+ ' Litres');
    });

});

// set up drag

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

// organize data-circles on click
d3.select('#organizeData')
  .on('click', function(){
    d3.selectAll('circle')
    .transition()
    .duration(1000)
    .attr({
      r: function(d){return d.Total* 2;},
      cx: function(d){
        var x = (d.Total/18.22 * width)* 0.90;
        return x;
      },
      cy: function(d){
        return height-(d.Total*d.Total) - 5;
      },
      fill: function(d){return circleColor(d);},
      stroke: 'black'
    });
  });

// scatter the data-circles on click

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
  return cyValObj[d.Total];
};

var cxArray = [];

var lineupX = function(d){
  return cxValObj[d.Total];
};



// lineup the data-circles on click
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



