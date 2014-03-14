/* global d3*/

// set base radius of circles, and width and height of svg
var radius = 15;
var width = 750;
var height = 600;

//Cx and Cy objects for Total Linear 
var cxPosTotal = {};
var cyPosTotal = {};
// variable for holding the sorted circles
var sortedCircles;
// Cx and Cy objects for Wine Linear
var cxPosWine = {};
var cyPosWine = {};
// Cx and Cy objects for Beer Linear
var cxPosBeer = {};
var cyPosBeer = {};
// Cx and Cy objects for Spirits Linear
var cxPosSpirits = {};
var cyPosSpirits = {};

var infoBoxLeft = function(){
  return ((window.innerWidth/2 - width/2)/window.innerWidth)*100+'%';
};
var instructionsLeft = function(){
  return ((window.innerWidth/2 - width/2)/window.innerWidth)*100+'%';
};
var legendLeft = function(){
  return ((window.innerWidth/2 + width/2)/window.innerWidth)*100-15+'%';
};

// infoBox position
d3.select('#infoBox').style({
  'left': infoBoxLeft()
});

// instructions width
d3.select('#instructions').style({
  'left': instructionsLeft()
});

// Legend width
d3.select('#legend').style({
  'left': legendLeft()
});

// resize div on window resize
var resize = function(element, func){
  d3.select(element).style({
    'left': func()
  });

};

// functions on window resize
window.onresize = function(){
  resize('#infoBox', infoBoxLeft);
  resize('#instructions', instructionsLeft);
  resize('#legend', legendLeft);
};


// create positions function
var createPositions = function(cx, cy, sortedCirc){
  cx[0] = 300;
  cy[0] = 20;
  for (var i = 1; i < sortedCirc[0].length; i++){
    var lastPosition = cx[i-1];
    cx[i] = lastPosition + 35;
    cy[i] = cy[i-1];
    if (cx[i] > (width-300) && cy[i] < 190) {
      cx[i] = 300;
      cy[i] = cy[i-1] + 35;
    } else if (cx[i] > width-300 && cy[i] === 195) {
      cx[i] = 100;
      cy[i] = cy[i-1] + 35;
    } else if (cx[i] > (width-100)) {
      cx[i] = 100;
      cy[i] = cy[i-1] + 35;
    }
  }
};

// sort by category and assign id
var sortAndAssignId = function(collection, category) {
  collection.sort(function(a,b){
    return b[category] === a[category] ? 0 : b[category] - a[category];
  });

  var k = 0;
  collection.each(function(d, i){
    d.id = k;
    k++;
  });
  return collection;
};


// function to dynamically sort the circles in the svg
var sortData = function(cxPos, cyPos, category) {
  d3.select('#instructions').text('');
  sortedTotalCircles = sortAndAssignId(sortedCircles, category);
  createPositions(cxPos, cyPos, sortedTotalCircles);
  d3.selectAll('circle')
  .transition()
  .duration(1500)
  .attr({
    r : function(d){
      var r = radius * (d[category]/8.16);
      return r < 3 ? 3 : r;
    },
    cy: function(d){ return cyPos[d.id];},
    cx: function(d){ return cxPos[d.id];}
  });
};



// create SVG and give it a height and width
d3.select('body').selectAll('svg').data([1])
  .enter().append('svg').style({
  'height': height,
  'width': width
});

var circleColor = function(d) {
  var l = d.Total/18.22;
  if (d.Continent === 'Europe') {
    return 'hsl(200,90%,50%)';
  } else if(d.Continent ==='Asia') {
    return 'hsl(50,81%,50%)';
  } else if (d.Continent === 'North America') {
    return 'hsl(20,81%,50%)';
  } else if (d.Continent === 'South America') {
    return 'hsl(150,81%,50%)';
  } else if (d.Continent === 'Australia') {
    return 'hsl(70,81%,50%)';
  } else if (d.Continent === 'Africa') {
    return 'hsl(250,81%,50%)';
  }
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
    .duration(500)
    .attr({
      r: function(d){return radius;},
      cx: function(d){
        var x = width/2;
        return x;
      },
      cy: function(d){
        return height/2;
      },
      fill: function(d){return circleColor(d);},
      stroke: 'white'
    });
    // call drag on data-circles
    d3.selectAll('circle').call(drag);
    d3.select('#instructions').text('Click on the circles to drag out countries');
    //Grab the circles collection
    sortedCircles = d3.selectAll('circle');




  circles.on('mouseover', function(d){
      var Country = d.Country;
      var Total = d.Total;
      var Wine = d.Wine;
      var Beer = d.Beer;
      var Spirits = d.Spirits;
      var Other = d.Other;
      var Continent = d.Continent;

      d3.select('#Country').text('Country: '+Country);
      //d3.select('#Continent').text('Continent: '+Continent);
      d3.select('#Total').text('Total Consumption: ' +Total+ ' Liters');
      d3.select('#Wine').text('Wine Consumption: ' +Wine+ ' Liters');
      d3.select('#Beer').text('Beer Consumption: ' +Beer+ ' Liters');
      d3.select('#Spirits').text('Spirits Consumption: ' +Spirits+ ' Liters');
      d3.select('#Other').text('Other Consumption: ' +Other+ ' Liters');
      d3.select('#infobox').style({'display':'inline-block'});
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

// scatter the data-circles on click

d3.select('#scatterData')
  .on('click', function(){
    d3.select('#instructions').text('');
    d3.selectAll('circle')
    .transition()
    .duration(1500)
    .attr({
      cx: function(d){
        var cx = Math.random() * width;
        if ((cx + radius) > width) {
          cx = cx - (radius*2);
        } else if ((cx + radius) < 0){
          cx = cx + (radius*2);
        }
        return cx;
        },
      cy: function(){
        return Math.random() * height;
        }
    });
  });


// organize data-circles on click
d3.select('#groupData')
  .on('click', function(){
    d3.select('#instructions').text('Click on the circles to drag out countries');
    d3.selectAll('circle')
    .transition()
    .duration(1500)
    .attr({
      r: function(d){return radius;},
      cx: function(d){
        var x = width/2;
        return x;
      },
      cy: function(d){
        return height/2;
      },
      fill: function(d){return circleColor(d);},
      stroke: 'white'
    });
  });



// lineup the data-circles on click
d3.select('#totalData')
  .on('click', function(){
    d3.select('#instructions').text('');
    sortedTotalCircles = sortAndAssignId(sortedCircles, 'Total');
    createPositions(cxPosTotal, cyPosTotal, sortedTotalCircles);
    d3.selectAll('circle')
    .transition()
    .duration(1500)
    .attr({
      r : function(d){
        var r = radius * (d.Total/18.22);
        return r < 3 ? 3 : r;
      },
      cy: function(d){ return cyPosTotal[d.id];},
      cx: function(d){ return cxPosTotal[d.id];}
    });
  });

d3.select('#wineData')
  .on('click', function(){
    sortData(cxPosWine, cyPosWine, 'Wine');
  });

d3.select('#beerData')
  .on('click', function(){
    sortData(cxPosBeer, cyPosBeer, 'Beer');
  });

d3.select('#spiritsData')
  .on('click', function(){
    sortData(cxPosSpirits, cyPosSpirits, 'Spirits');
  });





