import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Driver Screens
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverQRCodeScreen from '../screens/driver/DriverQRCodeScreen';

// Supervisor Screens
import SupervisorHomeScreen from '../screens/supervisor/SupervisorHomeScreen';
import DriverDetailsScreen from '../screens/supervisor/DriverDetailsScreen';

// Security Screens
import SecurityHomeScreen from '../screens/security/SecurityHomeScreen';
import ScanQRCodeScreen from '../screens/security/ScanQRCodeScreen';

// Auth Context
import { useAuth } from '../services/authContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, userProfile } = useAuth();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // Auth Routes
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Create Account' }} 
            />
          </>
        ) : (
          // Role-based Routes
          <>
            {userProfile?.role === 'driver' && (
              <>
                <Stack.Screen 
                  name="DriverHome" 
                  component={DriverHomeScreen} 
                  options={{ title: 'Driver Dashboard' }} 
                />
                <Stack.Screen 
                  name="DriverQRCode" 
                  component={DriverQRCodeScreen} 
                  options={{ title: 'Your QR Code' }} 
                />
              </>
            )}
            
            {userProfile?.role === 'supervisor' && (
              <>
                <Stack.Screen 
                  name="SupervisorHome" 
                  component={SupervisorHomeScreen} 
                  options={{ title: 'Supervisor Dashboard' }} 
                />
                <Stack.Screen 
                  name="DriverDetails" 
                  component={DriverDetailsScreen} 
                  options={{ title: 'Driver Details' }} 
                />
              </>
            )}
            
            {userProfile?.role === 'security' && (
              <>
                <Stack.Screen 
                  name="SecurityHome" 
                  component={SecurityHomeScreen} 
                  options={{ title: 'Security Dashboard' }} 
                />
                <Stack.Screen 
                  name="ScanQRCode" 
                  component={ScanQRCodeScreen} 
                  options={{ title: 'Scan QR Code' }} 
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 