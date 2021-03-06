var config = {
  ZOOM:         3,
  MINZOOM:      3,
  MAXZOOM:      17,
  LAT:          15,
  LNG:          27,
  ISO:          'ALL',
  MONTHNAMES:         ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  MONTHNAMES_SHORT:   ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  QUARTERNAMES:       ["JAN - MAR", "APR - JUN", "JUL - SEP", "OCT - DEC"],
  BASE_MAP_STYLE:     [ { "featureType": "water"  }, { "featureType": "transit", "stylers": [ { "saturation": -100 } ] }, { "featureType": "road", "stylers": [ { "saturation": -100 } ] }, { "featureType": "poi", "stylers": [ { "saturation": -100 } ] }, { "featureType": "landscape", "stylers": [ { "saturation": -100 } ] }, { "featureType": "administrative", "stylers": [ { "saturation": -100 } ] } ]
};

config.GRAPHS = {
  total_loss: {
    title: "Countries with greatest tree cover loss <sup>(2001-2012)</sup>",
    subtitle: "Global tree cover loss per year with annualized tree cover gain"
  },
  percent_loss: {
    title: "Countries with greatest percent tree cover loss <sup>(2001-2012)</sup><br />relative to 2000 tree cover extent",
    subtitle: "Percent global tree cover loss per year with annualized percent tree cover gain"
  },
  total_extent: {
    title: "Countries with greatest tree cover extent <sup>(2001-2012)</sup>",
    subtitle: "Global tree cover extent per year with global tree cover loss"
  },
  ratio: {
    title: "Countries with highest ratio of tree cover loss<br />to gain <sup>(2001-2012)</sup>",
    subtitle: "Tree cover loss relative to tree cover gain by country <sup>(2001-2012)</sup>"
  },
  domains: {
    title: "Climate domains ranked in order of<br />greatest tree cover loss",
    subtitle: "Tree cover loss per year by climate domain"
  }
}

config.GRAPHCOLORS = {
  tropical:     "#9BC000",
  subtropical:  "#FFFF73",
  boreal:       "#FFB973",
  temperate:    "#73DCFF"
}

function draw(topology, c, iso, options) {
  // c is index for country
  var country = topojson.feature(topology, topology.objects[c]);

  var width = 300,
      height = 300,
      el = "#"+iso;

  if(!options) {
    width = 150;
    height = 150;
    el = el+" a";
  }

  var svg = d3.select(el).append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  var projection = d3.geo.mercator().scale(1).translate([0, 0]);
  var path = d3.geo.path().projection(projection);

  var b = path.bounds(country),
      s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
    .scale(s)
    .translate(t);

  svg.append("svg:path")
    .data([country])
    .attr("d", path);

  if(options && options.alerts) {
    var forest = [];

    for(var i = 1; i < Object.keys(topology.objects).length; i++) {
      forest.push(topojson.feature(topology, topology.objects[i]).geometry);
    }

    svg.append("svg:g")
      .selectAll("circle")
      .data(forest)
      .enter()
      .append("svg:circle")
      .attr("class", "alert")
      .attr('cx', function(d){
        var coordinates = projection([d.coordinates[0], d.coordinates[1]])
        return coordinates[0]
      })
      .attr('cy', function(d){
        var coordinates = projection([d.coordinates[0], d.coordinates[1]])
        return coordinates[1]
      })
      .attr('r', 2)
      .style("fill", "#AAC600");
  }
}
