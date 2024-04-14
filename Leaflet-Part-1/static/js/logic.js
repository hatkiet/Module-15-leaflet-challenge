/************************************************************* 
    Part 1: Create the Earthquake Visualization
    (Note) I've followed the structure of Mod-15/Day2/Act-04
**************************************************************/

// Create the map object with specified center and zoom level. [Refs: Mod-15/Day1/Act-2]
let myMap = L.map("map", {
    center: [38.8206673, -122.8141632],
    zoom: 4, 
});

// Create the base title layers from Openstreetmap. [Refs: Mod-15/Day1/Act-2]
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Query the Geo Data for the earthquake data. [Refs: Mod-15/Day2/Act-04]
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Load the GEOJSON data with D3 and then create markers on map
d3.json(geoData).then(function (data) { // [Refs: Mod-15/Day2/Act-01]

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Call the pointToLayer function
        pointToLayer: function(feature, coordinates){ 
            // Create marker's style, [Refs: Mod-15/Day1/Act-04]
            return L.circleMarker(coordinates, {    
                // Call the markerSize() function to decide the radius of the circle based on magnitude
                radius: markerSize(feature.properties.mag),
                // Call the markerColor() function to decide color depends on the depth
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "black", // edge color
                weight: 0.5,
                fillOpacity: 0.5
            });
        },
        // Popup additional Information for each marker. [Refs: Mod-15/Day2/Act-04]
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.title}</h3><hr>
            <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
            <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(myMap);

    // Set up the legend
    let legend = L.control({position: "bottomright"});

    // Generate legend information. [Refs: Mod-15/Day2/Act-04]
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        div.innerHTML = "<h4>Earthquake Depth [km]</h4>";
        // Define legend labels and colors, respectively
        let labels = ["< 10", "10-30", "30-50", "50-70", "70-90", "90+"];
        let colors = ["lime", "greenyellow", "yellow", "orange", "darkorange", "red"];
        
        // Iterate labels and colors to create the legend items. [Refs: Mod-15/Day2/Act-02 & 04]
        for (let i = 0; i < labels.length; i++){
            div.innerHTML += `<i style=\"background:${colors[i]}"></i>${labels[i]}<br>`;
        }
        return div;
    };
    // Add the legend to the map
    legend.addTo(myMap);
});

// Define a function to determine the marker size based on the earthquake magnitude. [Refs: Mod-15/Day1/Act-09]
function markerSize(magnitude) {
    return magnitude * 3;
}

// Define a function to determine the marker color based on the earthquake depth. [Refs: Mod-15/Day2/Act-01]
function markerColor(depth) {
    if (depth >= 90)return "red";
    else if (depth >= 70) return "darkorange";
    else if (depth >= 50) return "orange";
    else if (depth >= 30) return "yellow";
    else if (depth >= 10) return "greenyellow";
    else return "lime";
}