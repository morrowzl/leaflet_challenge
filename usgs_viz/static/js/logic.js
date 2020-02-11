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

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  
  function processFeature(feature, obj) {    
    obj.bindPopup("<h3>" + 
    feature.properties.place + 
    "</h3><hr><p>" + 
    new Date(feature.properties.time) + 
    "</p>");
  }

  var earthquakeFeatures = L.geoJSON(earthquakeData, {
    onEachFeature: processFeature
  });

  mapTheQuakes(earthquakeFeatures);
}

function mapTheQuakes(earthquakeFeatures) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    minZoom:3,
    maxZoom: 15,
    id: "mapbox.streets",
    accessToken: please
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
    "Street Map": streetmap,
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
    layers: [streetmap, earthquakeFeatures]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);  
}