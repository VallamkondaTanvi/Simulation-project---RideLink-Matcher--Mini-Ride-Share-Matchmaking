// State management
let drivers = [];
let riders = [];
let currentMatches = [];

// Base data pools for random loading
const DRIVER_POOL = [
    { name: 'Alice', lat: 40.7128, lon: -74.0060, capacity: 4 },
    { name: 'Bob', lat: 40.7150, lon: -74.0070, capacity: 3 },
    { name: 'Charlie', lat: 40.7100, lon: -74.0050, capacity: 5 },
    { name: 'Diana', lat: 40.7200, lon: -74.0100, capacity: 4 },
    { name: 'Evan', lat: 40.7050, lon: -74.0020, capacity: 3 },
    { name: 'Fiona', lat: 40.7182, lon: -74.0150, capacity: 4 },
    { name: 'George', lat: 40.7035, lon: -74.0115, capacity: 2 },
    { name: 'Hannah', lat: 40.7270, lon: -74.0005, capacity: 5 },
    { name: 'Ian', lat: 40.6990, lon: -74.0180, capacity: 4 },
    { name: 'Julia', lat: 40.7095, lon: -74.0130, capacity: 3 },
    { name: 'Kyle', lat: 40.7168, lon: -74.0010, capacity: 6 },
    { name: 'Lena', lat: 40.7215, lon: -74.0065, capacity: 4 }
];

const RIDER_POOL = [
    { name: 'John', pickupLat: 40.7128, pickupLon: -74.0060, dropoffLat: 40.7160, dropoffLon: -74.0100, passengers: 1 },
    { name: 'Sarah', pickupLat: 40.7150, pickupLon: -74.0070, dropoffLat: 40.7180, dropoffLon: -74.0120, passengers: 2 },
    { name: 'Mike', pickupLat: 40.7100, pickupLon: -74.0050, dropoffLat: 40.7130, dropoffLon: -74.0080, passengers: 1 },
    { name: 'Emma', pickupLat: 40.7200, pickupLon: -74.0100, dropoffLat: 40.7210, dropoffLon: -74.0090, passengers: 3 },
    { name: 'Lisa', pickupLat: 40.7050, pickupLon: -74.0020, dropoffLat: 40.7070, dropoffLon: -74.0040, passengers: 2 },
    { name: 'David', pickupLat: 40.7120, pickupLon: -74.0065, dropoffLat: 40.7140, dropoffLon: -74.0110, passengers: 1 },
    { name: 'Olivia', pickupLat: 40.7185, pickupLon: -74.0140, dropoffLat: 40.7240, dropoffLon: -74.0055, passengers: 2 },
    { name: 'Noah', pickupLat: 40.7062, pickupLon: -74.0085, dropoffLat: 40.7115, dropoffLon: -74.0150, passengers: 1 },
    { name: 'Ava', pickupLat: 40.7005, pickupLon: -74.0030, dropoffLat: 40.7090, dropoffLon: -74.0065, passengers: 3 },
    { name: 'Liam', pickupLat: 40.7250, pickupLon: -74.0025, dropoffLat: 40.7190, dropoffLon: -74.0125, passengers: 2 },
    { name: 'Mia', pickupLat: 40.7135, pickupLon: -74.0170, dropoffLat: 40.7180, dropoffLon: -74.0185, passengers: 1 },
    { name: 'Ethan', pickupLat: 40.6978, pickupLon: -74.0102, dropoffLat: 40.7045, dropoffLon: -74.0145, passengers: 2 },
    { name: 'Zoe', pickupLat: 40.7290, pickupLon: -74.0080, dropoffLat: 40.7330, dropoffLon: -74.0035, passengers: 1 },
    { name: 'Leo', pickupLat: 40.7030, pickupLon: -74.0008, dropoffLat: 40.7075, dropoffLon: -74.0095, passengers: 4 }
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function samplePool(pool, minCount, maxCount) {
    const count = Math.min(pool.length, getRandomInt(minCount, maxCount));
    const copy = [...pool];
    shuffle(copy);
    return copy.slice(0, count).map((item, idx) => ({ ...item, id: idx + 1 }));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadData();
});

// Tab functionality
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Load randomized data set each time
function loadData() {
    drivers = samplePool(DRIVER_POOL, 6, 10);
    riders = samplePool(RIDER_POOL, 8, 14);
    currentMatches = [];

    updateUI();
}

// Add a new driver
function addDriver() {
    const name = document.getElementById('driverName').value;
    const lat = parseFloat(document.getElementById('driverLat').value);
    const lon = parseFloat(document.getElementById('driverLon').value);
    const capacity = parseInt(document.getElementById('driverCap').value);

    if (!name || isNaN(lat) || isNaN(lon) || !capacity) {
        alert('Please fill in all driver fields');
        return;
    }

    const driver = {
        id: drivers.length + 1,
        name,
        lat,
        lon,
        capacity
    };

    drivers.push(driver);
    clearDriverForm();
    updateUI();
}

// Add a new rider
function addRider() {
    const name = document.getElementById('riderName').value;
    const pickupLat = parseFloat(document.getElementById('pickupLat').value);
    const pickupLon = parseFloat(document.getElementById('pickupLon').value);
    const dropoffLat = parseFloat(document.getElementById('dropoffLat').value);
    const dropoffLon = parseFloat(document.getElementById('dropoffLon').value);
    const passengers = parseInt(document.getElementById('riderPassengers').value);

    if (!name || isNaN(pickupLat) || isNaN(pickupLon) || isNaN(dropoffLat) || isNaN(dropoffLon) || !passengers) {
        alert('Please fill in all rider fields');
        return;
    }

    const rider = {
        id: riders.length + 1,
        name,
        pickupLat,
        pickupLon,
        dropoffLat,
        dropoffLon,
        passengers
    };

    riders.push(rider);
    clearRiderForm();
    updateUI();
}

// Delete a driver
function deleteDriver(id) {
    drivers = drivers.filter(d => d.id !== id);
    updateUI();
}

// Delete a rider
function deleteRider(id) {
    riders = riders.filter(r => r.id !== id);
    updateUI();
}

// Clear form inputs
function clearDriverForm() {
    document.getElementById('driverName').value = '';
    document.getElementById('driverLat').value = '';
    document.getElementById('driverLon').value = '';
    document.getElementById('driverCap').value = '';
}

function clearRiderForm() {
    document.getElementById('riderName').value = '';
    document.getElementById('pickupLat').value = '';
    document.getElementById('pickupLon').value = '';
    document.getElementById('dropoffLat').value = '';
    document.getElementById('dropoffLon').value = '';
    document.getElementById('riderPassengers').value = '';
}

// Perform matching algorithm
function performMatching() {
    if (drivers.length === 0 || riders.length === 0) {
        alert('Need at least one driver and one rider to perform matching');
        return;
    }

    currentMatches = matchRidersToDrivers(drivers, riders);
    displayMatchingResults();

    // Switch to matching tab
    document.querySelector('[data-tab="matching"]').click();
}

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Match riders to drivers
function matchRidersToDrivers(drivers, riders) {
    const matches = [];
    const driverCapacity = {};
    
    // Initialize driver capacity tracking
    drivers.forEach(d => {
        driverCapacity[d.id] = d.capacity;
    });

    // Match each rider to the closest available driver
    riders.forEach(rider => {
        let minDistance = Infinity;
        let bestDriver = null;

        drivers.forEach(driver => {
            // Check if driver has capacity
            if (driverCapacity[driver.id] >= rider.passengers) {
                const dist = calculateDistance(
                    driver.lat, driver.lon,
                    rider.pickupLat, rider.pickupLon
                );

                if (dist < minDistance) {
                    minDistance = dist;
                    bestDriver = driver;
                }
            }
        });

        // Create a match if available driver found
        if (bestDriver) {
            driverCapacity[bestDriver.id] -= rider.passengers;
            matches.push({
                driverId: bestDriver.id,
                driverName: bestDriver.name,
                riderId: rider.id,
                riderName: rider.name,
                distance: minDistance.toFixed(2),
                passengers: rider.passengers
            });
        }
    });

    return matches;
}

// Display matching results
function displayMatchingResults() {
    const resultsDiv = document.getElementById('matchingResults');
    
    if (currentMatches.length === 0) {
        resultsDiv.innerHTML = '<div class="no-matches"><p>No matches found. Try adjusting driver capacity or rider locations.</p></div>';
        return;
    }

    let html = `<h3>Successfully Matched: ${currentMatches.length} rides</h3>`;
    
    currentMatches.forEach((match, index) => {
        html += `
            <div class="match-result">
                <h4>Match ${index + 1}</h4>
                <p><strong>Driver:</strong> ${match.driverName} (ID: ${match.driverId})</p>
                <p><strong>Rider:</strong> ${match.riderName} (ID: ${match.riderId})</p>
                <p><strong>Passengers:</strong> ${match.passengers}</p>
                <p><strong>Distance to Pickup:</strong> ${match.distance} miles</p>
            </div>
        `;
    });

    resultsDiv.innerHTML = html;
}

// Update UI
function updateUI() {
    updateDriversList();
    updateRidersList();
    updateStats();
}

// Update drivers list display
function updateDriversList() {
    const list = document.getElementById('driversList');
    
    if (drivers.length === 0) {
        list.innerHTML = '<p style="color: #999;">No drivers added yet</p>';
        return;
    }

    list.innerHTML = drivers.map(driver => `
        <div class="item">
            <div class="item-info">
                <h4>🚗 ${driver.name}</h4>
                <p>Location: (${driver.lat.toFixed(4)}, ${driver.lon.toFixed(4)})</p>
                <p>Capacity: ${driver.capacity} passengers</p>
            </div>
            <button class="btn-delete" onclick="deleteDriver(${driver.id})">Remove</button>
        </div>
    `).join('');
}

// Update riders list display
function updateRidersList() {
    const list = document.getElementById('ridersList');
    
    if (riders.length === 0) {
        list.innerHTML = '<p style="color: #999;">No riders added yet</p>';
        return;
    }

    list.innerHTML = riders.map(rider => `
        <div class="item">
            <div class="item-info">
                <h4>👤 ${rider.name}</h4>
                <p>Pickup: (${rider.pickupLat.toFixed(4)}, ${rider.pickupLon.toFixed(4)})</p>
                <p>Dropoff: (${rider.dropoffLat.toFixed(4)}, ${rider.dropoffLon.toFixed(4)})</p>
                <p>Passengers: ${rider.passengers}</p>
            </div>
            <button class="btn-delete" onclick="deleteRider(${rider.id})">Remove</button>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    document.getElementById('driverCount').textContent = drivers.length;
    document.getElementById('riderCount').textContent = riders.length;
    document.getElementById('matchCount').textContent = currentMatches.length;
}

// Reset simulation
function resetSimulation() {
    if (confirm('Are you sure you want to reset all data?')) {
        drivers = [];
        riders = [];
        currentMatches = [];
        clearDriverForm();
        clearRiderForm();
        document.getElementById('matchingResults').innerHTML = '';
        updateUI();
    }
}
