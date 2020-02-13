/*
A script to retrieve GeoJSON data from the USGS earthquakes endpoint;
Pass returned data to function for making objects;
Create an object for each feature in the GeoJSON data;
Create a GeoJSON layer that contains each of the features;
Pass output GeoJSON layer to function for creating a map on the page;
Define layers;
Define baseMaps;
Define overlayMaps object to hold the overlay layer;
Create map which loads using layers and baseMaps;
Create layer control;
Pass baseMaps and overlayMaps;
Add layer control to map;
*/

/*
Markers should reflect the magnitude of the earthquake in their size and color.
access quake's magnitude at:
feature.properties.mag (decimal)
markerRadius(quake's magnitude)
markerColor(quake's magnitude) 
look at leaflet documentation for specifying feature marker style, size and color
Earthquakes with higher magnitudes should appear larger and darker in color.
Create a legend that will provide context for your map data.
*/

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var overFive = "#ff0000";
var overFour = "#fc4f30";
var overThree = "#ff9742";
var overTwo = "#ffc75e";
var overOne = "#fafc82";
var zeroToOne = "#e2ff9e";
var colorRanges = [zeroToOne, overOne, overTwo, overThree, overFour, overFive];
var rangeLabels = ["0 - 1", "> 1", "> 2", "> 3", "> 4", "> 5"];

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  
  function processFeature(feature, obj) {    
    obj.bindPopup("<h3>Magnitude: " + 
    feature.properties.mag + 
    "</h3><h5>Location: " + 
    feature.properties.place + 
    "</h5><h5>Time: " + 
    new Date(feature.properties.time) + 
    "</h5>" 
    );
  }

  function magStyles(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.65,
      // fillColor: "#e7d000",
      fillColor: magColor(feature.properties.mag),
      color: "#000000",
      // color: magColor(feature.properties.mag),
      // radius: feature.properties.mag * 4,
      radius: magRadius(feature.properties.mag),
      stroke: true,
      weight: 1     
    };
  }

  function magRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    } else {
      // return Math.pow(Math.E, (magnitude));
      // return magnitude * 2.75;
      return magnitude + (5 * magnitude);
    }
  }

  // var overFive = "#ff0000";
  // var overFour = "#fc4f30";
  // var overThree = "#ff9742";
  // var overTwo = "#ffc75e";
  // var overOne = "#fafc82";
  // var zeroToOne = "#e2ff9e";
  // var colorRanges = [zeroToOne, overOne, overTwo, overThree, overFour, overFive];

  function magColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return overFive;
    case magnitude > 4:
      return overFour;
    case magnitude > 3:
      return overThree;
    case magnitude > 2:
      return overTwo;
    case magnitude > 1:
      return overOne;
    default:
      return zeroToOne;
    }    
  }

  var earthquakeFeatures = L.geoJson(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: magStyles,
    onEachFeature: processFeature
  });

  mapTheQuakes(earthquakeFeatures);
}

function mapTheQuakes(earthquakeFeatures) {

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    minZoom:3,
    maxZoom: 15,
    id: "mapbox.light",
    accessToken: yourKey
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    minZoom:3,
    maxZoom: 15,
    id: "mapbox.dark",
    accessToken: please
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakeFeatures
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      39.99, -95.30
    ],
    zoom: 4.5,
    layers: [lightmap, earthquakeFeatures]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var swatches = [];
    var labels = [];

    var legendInfo = "<h2>Magnitude</h2>" +
      "<div class=\"labels\">" +
        // "<div class=\"zeroToOne\">0 - 1</div>" + 
        // "<div class=\"overOne\">m > 1</div>" + 
        // "<div class=\"overTwo\">m > 2</div>" + 
        // "<div class=\"overThree\">m > 3</div>" + 
        // "<div class=\"overFour\">m > 4</div>" + 
        // "<div class=\"overFive\">m > 5</div>" + 
      "</div>";
    div.innerHTML = legendInfo;
    colorRanges.forEach(function(range, index) {
      swatches.push("<li style=\"background-color: " + colorRanges[index] + "\"></li>");
    });
    rangeLabels.forEach(function(range, index) {
      labels.push("<li>" + rangeLabels[index] + "</li>");
    });
    div.innerHTML += "<table><tbody><tr><td><ul>" + swatches.join("") + "</ul></td><td><ul>" + labels.join("") + "</ul></td></tr></tbody></table>";
    return div;
  };
  legend.addTo(myMap);     
}