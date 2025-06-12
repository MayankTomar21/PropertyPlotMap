// script.js

let map;
let markers = [];
let allProperties = []; // To store all properties for filtering

async function initMap() {
    // Center the map on Pimpri-Chinchwad
    const pcmcCoords = { lat: 18.6300, lng: 73.8000 };

    map = new google.maps.Map(document.getElementById("map"), {
        center: pcmcCoords,
        zoom: 12, // Adjust zoom level as needed
    });

    // Load property data
    await loadProperties();

    // Setup filter event listener
    document.getElementById('propertyType').addEventListener('change', filterProperties);
}

async function loadProperties() {
    try {
        const response = await fetch('properties.json');
        allProperties = await response.json();
        renderMarkers(allProperties); // Initial rendering
    } catch (error) {
        console.error("Error loading property data:", error);
        alert("Failed to load property data. Please check console for details.");
    }
}

function renderMarkers(propertiesToRender) {
    // Clear existing markers
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];

    // Add new markers
    propertiesToRender.forEach(property => {
        const marker = new google.maps.Marker({
            position: { lat: property.lat, lng: property.lng },
            map: map,
            title: property.address
        });

        // Create info window content
        const contentString = `
            <div class="info-window-content">
                <h3>${property.address}</h3>
                <p><strong>Price:</strong> ${property.price}</p>
                <p><strong>Area:</strong> ${property.area}</p>
                <p><strong>Type:</strong> ${property.type}</p>
                ${property.bedrooms ? `<p><strong>Bedrooms:</strong> ${property.bedrooms}</p>` : ''}
                <p>${property.description}</p>
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: contentString,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });
}

function filterProperties() {
    const selectedType = document.getElementById('propertyType').value;

    let filtered = [];
    if (selectedType === 'All') {
        filtered = allProperties;
    } else {
        filtered = allProperties.filter(property => property.type === selectedType);
    }
    renderMarkers(filtered);
}
