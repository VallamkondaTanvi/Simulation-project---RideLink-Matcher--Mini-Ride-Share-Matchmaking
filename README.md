# 🚗 Ride Share Matchmaking Simulation

A real-time ride-sharing matchmaking system that uses C++ backend with a modern web UI to demonstrate proximity-based driver-rider matching algorithms.

## 📋 Features

✅ **Real-time Matching Algorithm** - Uses Haversine distance formula for accurate location-based matching
✅ **Driver Management** - Add, view, and manage available drivers with capacity limits
✅ **Rider Requests** - Create rider requests with pickup/dropoff locations and passenger count
✅ **Intelligent Matching** - Automatically matches riders to nearest available drivers
✅ **Responsive Web UI** - Modern, user-friendly interface with real-time updates
✅ **CGI Backend** - C++ backend can run both standalone and as CGI on Apache

## 📁 Project Structure

```
RideShare_Project/
│
├── cgi-bin/
│   ├── match.cpp              # C++ matching algorithm
│   ├── match.cgi              # Compiled executable
│   └── data/
│       ├── drivers.txt        # Sample driver data
│       └── riders.txt         # Sample rider data
│
├── www/
│   ├── index.html             # Main web interface
│   ├── style.css              # Styling
│   └── script.js              # Frontend logic
│
└── README.md                  # This file
```

## 🔧 System Requirements

- **Windows/Linux/Mac** - Cross-platform compatible
- **Compiler** - GCC or Clang (C++11 or higher)
- **Web Server** - Apache with CGI support (XAMPP recommended for Windows)
- **Browser** - Modern browser with ES6 support

### Optional but Recommended

- **XAMPP** - Apache + PHP bundled server
- **VS Code** - With C/C++ extension
- **Live Server** - VS Code extension for running web UI


## 📊 Understanding the Matching Algorithm

The system uses the **Haversine formula** to calculate great-circle distances between driver and rider locations:

```
distance = 2R * arcsin(√[sin²(Δlat/2) + cos(lat1)cos(lat2)sin²(Δlon/2)])
```

Where:
- `R` = Earth's radius (3,959 miles)
- `lat1, lon1` = Driver location
- `lat2, lon2` = Rider pickup location

### Matching Process

1. **For each rider:**
   - Find all drivers with available capacity
   - Calculate distance to each driver
   - Assign to nearest driver
   - Reduce driver's remaining capacity

2. **Output:**
   - Matched driver-rider pairs
   - Distance to pickup location
   - Passenger count info

## 💾 Data Format

### drivers.txt
```
ID Name Latitude Longitude Capacity
1 Alice 40.7128 -74.0060 4
2 Bob 40.7150 -74.0070 3
```

### riders.txt
```
ID Name PickupLat PickupLon DropoffLat DropoffLon Passengers
1 John 40.7128 -74.0060 40.7160 -74.0100 1
2 Sarah 40.7150 -74.0070 40.7180 -74.0120 2
```

## 🎮 Using the Web Interface

### Overview Tab
- View system statistics
- Quick action buttons
- System information

### Drivers Tab
- View all active drivers
- Add new drivers with location and capacity
- Remove drivers from the system

### Riders Tab
- View all pending rider requests
- Add new requests with pickup/dropoff locations
- Remove rider requests

### Matching Results Tab
- Execute the matching algorithm
- View matched driver-rider pairs
- See distance to each pickup location


## 🔍 Troubleshooting

### Issue: "g++ command not found"
**Solution:** 
- Install MinGW (Windows): https://www.mingw-w64.org/
- Or use Visual Studio C++ build tools
- Add to system PATH

### Issue: CGI script not executing
**Solution:**
- Ensure Apache has CGI module enabled
- Check file permissions (chmod +x on Linux/Mac)
- Verify file location in cgi-bin directory
- Check Apache error logs

### Issue: "Cannot find drivers.txt or riders.txt"
**Solution:**
- Ensure data files are in `cgi-bin/data/` directory
- Check file paths are correct in match.cpp
- Verify Apache has read permissions

## 🧪 Testing

### Test the Web UI

1. Open `index.html` in browser
2. Click "Load Data" to populate sample drivers/riders
3. Click "Run Matching Algorithm"
4. View results in "Matching Results" tab

## 📈 Advanced Usage

### Custom Data

Edit `cgi-bin/data/drivers.txt` and `cgi-bin/data/riders.txt`:

```
# drivers.txt example
1 Driver_Name Latitude Longitude Capacity
2 Alice 40.7128 -74.0060 4
3 Bob 40.7150 -74.0070 3
```

### Modify Algorithm

Edit matching logic in `cgi-bin/match.cpp`:
- `matchRidersToDrivers()` - Main matching function
- `calculateDistance()` - Distance calculation
- Thresholds and priorities can be customized

### Extend Web UI

Edit `www/script.js` to:
- Add real-time location updates
- Implement map visualization
- Add pricing calculations
- Create driver-rider chat

## 📄 License

Free to use and modify for educational purposes.

## 🎯 Learning Outcomes

This project demonstrates:
- C++ programming and file I/O
- Geographic distance calculations
- Algorithm optimization
- CGI programming basics
- Frontend-backend integration
- HTML/CSS/JavaScript for modern web UI
- Data structure management

## 📚 References

- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- [Apache CGI Documentation](https://httpd.apache.org/docs/2.4/cgi_common.html)
- [XAMPP Official](https://www.apachefriends.org/)
- [C++ Reference](https://en.cppreference.com/)
