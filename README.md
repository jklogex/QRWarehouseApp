# Warehouse QR Authorization App

A React Native mobile application for authorizing warehouse entry and exit using QR codes. This app is designed for three types of users: Drivers, Supervisors, and Security Personnel.

## Features

### User Authentication & Role Management
- Secure login and registration system
- Role-based access control (Driver, Supervisor, Security)
- User profile management

### Driver Features
- Unique QR code generation with driver details and status
- Real-time status updates (Cleared/Not Cleared for exit)
- Simple interface to present QR code to security personnel

### Supervisor Features
- View and manage a list of all drivers
- Update driver status (Clear/Not Clear for exit)
- Real-time updates to driver QR codes

### Security Guard Features
- QR code scanning functionality
- Verification of driver status and identity
- Real-time validation against database records

## Technical Implementation

- **Frontend**: React Native for cross-platform mobile development
- **Backend**: Firebase Authentication and Firestore Database
- **QR Code**: Generation and scanning capabilities
- **Real-time Updates**: Immediate reflection of status changes

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd QRWarehouseApp
```

2. Install dependencies
```
npm install
```

3. Configure Firebase
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Update the Firebase configuration in `src/services/firebase.ts`

4. Run the application
```
# For Android
npx react-native run-android

# For iOS
npx react-native run-ios
```

## Project Structure

```
src/
├── assets/         # Images, fonts, and other static assets
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # Screen components
│   ├── auth/       # Authentication screens
│   ├── driver/     # Driver-specific screens
│   ├── supervisor/ # Supervisor-specific screens
│   └── security/   # Security-specific screens
└── services/       # Firebase and other services
```

## Usage

### Driver Workflow
1. Log in as a Driver
2. View current exit clearance status
3. Navigate to QR Code screen
4. Present QR code to security personnel at exit

### Supervisor Workflow
1. Log in as a Supervisor
2. View list of drivers
3. Select a driver to view details
4. Update driver's clearance status as needed

### Security Guard Workflow
1. Log in as Security
2. Scan driver's QR code at exit point
3. Verify driver's identity and clearance status
4. Allow or deny exit based on status

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native community
- Firebase for backend services
- All contributors to this project
