var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var EarthquakeMap = L.map("map", {center: [38.75, -112],zoom: 5});
  
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: "pk.eyJ1Ijoia2ltaXQwMzEwIiwiYSI6ImNrZG0zaTVycDE0cjYycG82OW11bnE1M3EifQ.G4Dy5n50nNvR7UKGv4h-zA"
}).addTo(EarthquakeMap);

d3.json(URL, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 0.8,
      fillOpacity: 0.8,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
// getRadius  
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3.5;
  }
// getColor  
  function getColor(magnitude) {
    return magnitude > 5 ? "#f54242":
    magnitude > 4 ? "#f58a42":
    magnitude > 3 ? "#f5d442":
    magnitude > 2 ? "#e9f542":
    magnitude > 1 ? "#aaf542":
                    "#76f24d";
  }
// making circles
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
// popup marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Time: " + new Date(feature.properties.time));
      }
    }).addTo(EarthquakeMap);

// legend
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
  };

  legend.addTo(EarthquakeMap);
});