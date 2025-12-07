#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <cmath>
#include <iomanip>
#include <algorithm>
#include <cstring>

using namespace std;

struct Location {
    double latitude;
    double longitude;
    
    Location(double lat = 0, double lon = 0) : latitude(lat), longitude(lon) {}
};

struct Driver {
    int id;
    string name;
    Location location;
    int capacity;
    int currentPassengers;
    
    Driver() {}
    Driver(int id, string name, double lat, double lon, int cap) 
        : id(id), name(name), location(lat, lon), capacity(cap), currentPassengers(0) {}
};

struct Rider {
    int id;
    string name;
    Location pickupLocation;
    Location dropoffLocation;
    int passengerCount;
    
    Rider() {}
    Rider(int id, string name, double pickupLat, double pickupLon, 
          double dropoffLat, double dropoffLon, int passengers)
        : id(id), name(name), pickupLocation(pickupLat, pickupLon), 
          dropoffLocation(dropoffLat, dropoffLon), passengerCount(passengers) {}
};

// Haversine formula to calculate distance between two coordinates
double calculateDistance(Location loc1, Location loc2) {
    const double R = 3959; // Earth radius in miles
    double dLat = (loc2.latitude - loc1.latitude) * M_PI / 180.0;
    double dLon = (loc2.longitude - loc1.longitude) * M_PI / 180.0;
    
    double a = sin(dLat / 2) * sin(dLat / 2) +
               cos(loc1.latitude * M_PI / 180.0) * cos(loc2.latitude * M_PI / 180.0) *
               sin(dLon / 2) * sin(dLon / 2);
    
    double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
}

// Load drivers from file
vector<Driver> loadDrivers(const string& filename) {
    vector<Driver> drivers;
    ifstream file(filename);
    
    if (!file.is_open()) {
        cerr << "Error: Could not open " << filename << endl;
        return drivers;
    }
    
    int id;
    string name;
    double lat, lon;
    int capacity;
    
    while (file >> id >> name >> lat >> lon >> capacity) {
        drivers.push_back(Driver(id, name, lat, lon, capacity));
    }
    
    file.close();
    return drivers;
}

// Load riders from file
vector<Rider> loadRiders(const string& filename) {
    vector<Rider> riders;
    ifstream file(filename);
    
    if (!file.is_open()) {
        cerr << "Error: Could not open " << filename << endl;
        return riders;
    }
    
    int id, passengers;
    string name;
    double pickupLat, pickupLon, dropoffLat, dropoffLon;
    
    while (file >> id >> name >> pickupLat >> pickupLon >> dropoffLat >> dropoffLon >> passengers) {
        riders.push_back(Rider(id, name, pickupLat, pickupLon, dropoffLat, dropoffLon, passengers));
    }
    
    file.close();
    return riders;
}

// Match riders to drivers based on proximity and capacity
struct Match {
    int driverId;
    int riderId;
    double distance;
    string driverName;
    string riderName;
};

vector<Match> matchRidersToDrivers(vector<Driver>& drivers, vector<Rider>& riders) {
    vector<Match> matches;
    vector<bool> riderMatched(riders.size(), false);
    
    // For each rider, find the closest available driver with capacity
    for (int i = 0; i < riders.size(); i++) {
        double minDistance = 1e9;
        int bestDriver = -1;
        
        for (int j = 0; j < drivers.size(); j++) {
            // Check if driver has capacity for this rider
            if (drivers[j].currentPassengers + riders[i].passengerCount <= drivers[j].capacity) {
                // Calculate distance from driver to rider's pickup location
                double dist = calculateDistance(drivers[j].location, riders[i].pickupLocation);
                
                if (dist < minDistance) {
                    minDistance = dist;
                    bestDriver = j;
                }
            }
        }
        
        // If a suitable driver was found, create a match
        if (bestDriver != -1) {
            drivers[bestDriver].currentPassengers += riders[i].passengerCount;
            Match match;
            match.driverId = drivers[bestDriver].id;
            match.riderId = riders[i].id;
            match.distance = minDistance;
            match.driverName = drivers[bestDriver].name;
            match.riderName = riders[i].name;
            matches.push_back(match);
            riderMatched[i] = true;
        }
    }
    
    return matches;
}

// Print results to console
void printMatches(const vector<Match>& matches, const vector<Rider>& riders) {
    cout << "\n========== RIDE MATCHING RESULTS ==========" << endl;
    cout << "Total Matches: " << matches.size() << endl;
    
    if (matches.empty()) {
        cout << "No matches found." << endl;
    } else {
        cout << setw(12) << "Driver" << setw(15) << "Rider" << setw(15) << "Distance (mi)" << endl;
        cout << string(42, '-') << endl;
        
        for (const auto& match : matches) {
            cout << setw(12) << match.driverName 
                 << setw(15) << match.riderName 
                 << setw(15) << fixed << setprecision(2) << match.distance << endl;
        }
    }
    
    cout << "==========================================" << endl;
}

// Generate JSON output for web interface
void outputJSON(const vector<Match>& matches) {
    cout << "Content-Type: application/json\n\n";
    cout << "{\"matches\":[";
    
    for (int i = 0; i < matches.size(); i++) {
        if (i > 0) cout << ",";
        cout << "{\"driver\":\"" << matches[i].driverName 
             << "\",\"rider\":\"" << matches[i].riderName 
             << "\",\"distance\":" << fixed << setprecision(2) << matches[i].distance << "}";
    }
    
    cout << "],\"total\":" << matches.size() << "}";
}

int main(int argc, char* argv[]) {
    // Check if running as CGI (from web) or console
    bool isCGI = (getenv("REQUEST_METHOD") != nullptr);
    
    // Build file paths
    string dataPath = "data/";
    string driverFile = dataPath + "drivers.txt";
    string riderFile = dataPath + "riders.txt";
    
    // Load data
    vector<Driver> drivers = loadDrivers(driverFile);
    vector<Rider> riders = loadRiders(riderFile);
    
    if (drivers.empty() || riders.empty()) {
        if (isCGI) {
            cout << "Content-Type: application/json\n\n{\"error\":\"Data files not found\"}";
        } else {
            cerr << "Error: Could not load driver or rider data." << endl;
        }
        return 1;
    }
    
    // Perform matching
    vector<Match> matches = matchRidersToDrivers(drivers, riders);
    
    // Output results
    if (isCGI) {
        outputJSON(matches);
    } else {
        printMatches(matches, riders);
    }
    
    return 0;
}
